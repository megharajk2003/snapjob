import { getCollection } from '../config/mongodb.js';
import { ObjectId } from 'mongodb';

export class Application {
  static async create(applicationData) {
    const applications = await getCollection('applications');
    const newApplication = {
      ...applicationData,
      jobId: new ObjectId(applicationData.jobId),
      providerId: new ObjectId(applicationData.providerId),
      hirerId: new ObjectId(applicationData.hirerId),
      status: 'pending',
      appliedAt: new Date()
    };
    
    try {
      const result = await applications.insertOne(newApplication);
      return { ...newApplication, _id: result.insertedId };
    } catch (error) {
      // Handle duplicate application
      if (error.code === 11000) {
        throw new Error('Already applied for this job');
      }
      throw error;
    }
  }

  static async findByJob(jobId) {
    const applications = await getCollection('applications');
    return await applications.find({ jobId: new ObjectId(jobId) }).toArray();
  }

  static async findByProvider(providerId) {
    const applications = await getCollection('applications');
    return await applications.find({ providerId: new ObjectId(providerId) }).sort({ appliedAt: -1 }).toArray();
  }

  static async findByHirer(hirerId) {
    const applications = await getCollection('applications');
    return await applications.find({ hirerId: new ObjectId(hirerId) }).sort({ appliedAt: -1 }).toArray();
  }

  static async updateStatus(jobId, providerId, status) {
    const applications = await getCollection('applications');
    return await applications.updateOne(
      { 
        jobId: new ObjectId(jobId), 
        providerId: new ObjectId(providerId) 
      },
      { $set: { status } }
    );
  }

  static async getJobApplicationsWithProviders(jobId) {
    const applications = await getCollection('applications');
    const users = await getCollection('users');
    
    const pipeline = [
      { $match: { jobId: new ObjectId(jobId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'providerId',
          foreignField: '_id',
          as: 'provider'
        }
      },
      { $unwind: '$provider' },
      {
        $sort: {
          'provider.isAadhaarVerified': -1,
          'provider.avgRating': -1,
          'appliedAt': 1
        }
      }
    ];
    
    return await applications.aggregate(pipeline).toArray();
  }
}
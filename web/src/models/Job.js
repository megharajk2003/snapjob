import { getCollection } from '../config/mongodb.js';
import { ObjectId } from 'mongodb';

export class Job {
  static async create(jobData) {
    const jobs = await getCollection('jobs');
    const newJob = {
      ...jobData,
      status: 'open',
      completionPin: this.generateCompletionPin(),
      postedAt: new Date(),
      location: {
        type: 'Point',
        coordinates: jobData.coordinates
      }
    };
    
    const result = await jobs.insertOne(newJob);
    return { ...newJob, _id: result.insertedId };
  }

  static async findById(id) {
    const jobs = await getCollection('jobs');
    return await jobs.findOne({ _id: new ObjectId(id) });
  }

  static async findNearbyJobs(coordinates, maxDistance = 10000, category = null) {
    const jobs = await getCollection('jobs');
    const query = {
      status: 'open',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: coordinates
          },
          $maxDistance: maxDistance
        }
      }
    };

    if (category) {
      query.category = category;
    }

    return await jobs.find(query).toArray();
  }

  static async findByHirer(hirerId) {
    const jobs = await getCollection('jobs');
    return await jobs.find({ hirerId: new ObjectId(hirerId) }).sort({ postedAt: -1 }).toArray();
  }

  static async updateStatus(id, status, providerId = null) {
    const jobs = await getCollection('jobs');
    const updateData = { status };
    if (providerId) {
      updateData.assignedProviderId = new ObjectId(providerId);
    }
    
    return await jobs.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
  }

  static async completeJob(id, completionPin) {
    const jobs = await getCollection('jobs');
    const job = await this.findById(id);
    
    if (job && job.completionPin === completionPin) {
      return await jobs.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: 'completed', completedAt: new Date() } }
      );
    }
    
    return null;
  }

  static generateCompletionPin() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  static async findJobsByProvider(providerId, status = null) {
    const applications = await getCollection('applications');
    let query = { providerId: new ObjectId(providerId) };
    
    if (status) {
      query.status = status;
    }
    
    const userApplications = await applications.find(query).toArray();
    const jobIds = userApplications.map(app => app.jobId);
    
    if (jobIds.length === 0) return [];
    
    const jobs = await getCollection('jobs');
    return await jobs.find({ _id: { $in: jobIds } }).toArray();
  }
}
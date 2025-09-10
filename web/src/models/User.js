import { getCollection } from '../config/mongodb.js';
import { ObjectId } from 'mongodb';

export class User {
  static async create(userData) {
    const users = await getCollection('users');
    const newUser = {
      ...userData,
      createdAt: new Date(),
      avgRating: 0,
      ...(userData.role === 'provider' && {
        providerProfile: {
          primarySkill: '',
          secondarySkills: [],
          portfolio: [],
          isAvailable: false,
          currentLocation: {
            type: 'Point',
            coordinates: [0, 0]
          },
          totalJobsCompleted: 0,
          ...userData.providerProfile
        }
      }),
      ...(userData.role === 'hirer' && {
        hirerProfile: {
          totalJobsPosted: 0,
          ...userData.hirerProfile
        }
      })
    };
    
    const result = await users.insertOne(newUser);
    return { ...newUser, _id: result.insertedId };
  }

  static async findByMobileNumber(mobileNumber) {
    const users = await getCollection('users');
    return await users.findOne({ mobileNumber });
  }

  static async findById(id) {
    const users = await getCollection('users');
    return await users.findOne({ _id: new ObjectId(id) });
  }

  static async updateProfile(id, updateData) {
    const users = await getCollection('users');
    return await users.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
  }

  static async updateLocation(id, coordinates) {
    const users = await getCollection('users');
    return await users.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          'providerProfile.currentLocation': {
            type: 'Point',
            coordinates: coordinates
          }
        }
      }
    );
  }

  static async findNearbyProviders(coordinates, maxDistance = 10000, skillFilter = null) {
    const users = await getCollection('users');
    const query = {
      role: 'provider',
      'providerProfile.isAvailable': true,
      'providerProfile.currentLocation': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: coordinates
          },
          $maxDistance: maxDistance
        }
      }
    };

    if (skillFilter) {
      query.$or = [
        { 'providerProfile.primarySkill': skillFilter },
        { 'providerProfile.secondarySkills': { $in: [skillFilter] } }
      ];
    }

    return await users.find(query).toArray();
  }

  static async updateAvailability(id, isAvailable) {
    const users = await getCollection('users');
    return await users.updateOne(
      { _id: new ObjectId(id) },
      { $set: { 'providerProfile.isAvailable': isAvailable } }
    );
  }

  static async addToPortfolio(id, portfolioItem) {
    const users = await getCollection('users');
    return await users.updateOne(
      { _id: new ObjectId(id) },
      { $push: { 'providerProfile.portfolio': portfolioItem } }
    );
  }
}
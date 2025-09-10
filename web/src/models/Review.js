import { getCollection } from '../config/mongodb.js';
import { ObjectId } from 'mongodb';

export class Review {
  static async create(reviewData) {
    const reviews = await getCollection('reviews');
    const newReview = {
      ...reviewData,
      jobId: new ObjectId(reviewData.jobId),
      reviewerId: new ObjectId(reviewData.reviewerId),
      revieweeId: new ObjectId(reviewData.revieweeId),
      createdAt: new Date()
    };
    
    const result = await reviews.insertOne(newReview);
    
    // Update user's average rating
    await this.updateUserAverageRating(reviewData.revieweeId);
    
    return { ...newReview, _id: result.insertedId };
  }

  static async findByUser(userId) {
    const reviews = await getCollection('reviews');
    return await reviews.find({ revieweeId: new ObjectId(userId) }).sort({ createdAt: -1 }).toArray();
  }

  static async findByJob(jobId) {
    const reviews = await getCollection('reviews');
    return await reviews.find({ jobId: new ObjectId(jobId) }).toArray();
  }

  static async updateUserAverageRating(userId) {
    const reviews = await getCollection('reviews');
    const users = await getCollection('users');
    
    const result = await reviews.aggregate([
      { $match: { revieweeId: new ObjectId(userId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]).toArray();
    
    if (result.length > 0) {
      const { avgRating } = result[0];
      await users.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { avgRating: Math.round(avgRating * 10) / 10 } }
      );
    }
  }

  static async getUserStats(userId) {
    const reviews = await getCollection('reviews');
    
    const stats = await reviews.aggregate([
      { $match: { revieweeId: new ObjectId(userId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]).toArray();
    
    if (stats.length === 0) {
      return { avgRating: 0, totalReviews: 0, ratingDistribution: [] };
    }
    
    return stats[0];
  }

  static async getPopularTags(userId) {
    const reviews = await getCollection('reviews');
    
    const tagStats = await reviews.aggregate([
      { $match: { revieweeId: new ObjectId(userId) } },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).toArray();
    
    return tagStats.map(tag => ({ tag: tag._id, count: tag.count }));
  }
}
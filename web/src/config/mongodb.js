import { MongoClient } from 'mongodb';

const MONGODB_URI = "mongodb+srv://akashperumal2003_db_user:Ju9tIrd6TteK70Mn@snapjob.jcw326i.mongodb.net/";
const DB_NAME = 'quickjob';

let client;
let database;

export async function connectToMongoDB() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    database = client.db(DB_NAME);
    
    // Create indexes for better performance
    await createIndexes();
  }
  return database;
}

async function createIndexes() {
  const db = await connectToMongoDB();
  
  // Users collection indexes
  await db.collection('users').createIndex({ mobileNumber: 1 }, { unique: true });
  await db.collection('users').createIndex({ 'providerProfile.currentLocation': '2dsphere' });
  await db.collection('users').createIndex({ isAadhaarVerified: 1 });
  
  // Jobs collection indexes
  await db.collection('jobs').createIndex({ location: '2dsphere' });
  await db.collection('jobs').createIndex({ status: 1 });
  await db.collection('jobs').createIndex({ category: 1 });
  await db.collection('jobs').createIndex({ hirerId: 1 });
  
  // Applications collection indexes
  await db.collection('applications').createIndex({ jobId: 1, providerId: 1 }, { unique: true });
  await db.collection('applications').createIndex({ providerId: 1 });
  await db.collection('applications').createIndex({ hirerId: 1 });
  
  // Reviews collection indexes
  await db.collection('reviews').createIndex({ revieweeId: 1 });
  await db.collection('reviews').createIndex({ jobId: 1 });
}

export async function getCollection(collectionName) {
  const db = await connectToMongoDB();
  return db.collection(collectionName);
}

export function closeConnection() {
  if (client) {
    client.close();
    client = null;
    database = null;
  }
}
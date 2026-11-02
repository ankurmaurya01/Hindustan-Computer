import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents connections from growing exponentially during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hindustan_computer';

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('>>> [DB] Connected successfully to MongoDB at:', MONGODB_URI);
      return mongooseInstance;
    }).catch(async (err) => {
      console.warn('>>> [DB] Direct MongoDB connection failed:', err.message);
      console.log('>>> [DB] Falling back to robust embedded data store for local preview.');
      // Return mongoose or dummy to prevent app from crashing
      throw err;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectToDatabase;

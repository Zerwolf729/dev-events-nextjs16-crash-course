import mongoose from 'mongoose';

// Extend the global namespace to include the mongoose cache
declare global {
  // Prevent TypeScript errors by allowing mongoose property on global
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Initialize the cached connection object
// In development, Next.js hot-reloads can create multiple connections
// This cache prevents that by storing the connection in the global object
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Establishes a connection to MongoDB using Mongoose
 * Uses a cached connection in development to prevent multiple connections
 * @returns {Promise<mongoose.Connection>} The Mongoose connection object
 */
async function connectToDatabase(): Promise<mongoose.Connection> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise if one doesn't exist
  if (!cached.promise) {
    const options = {
      bufferCommands: false, // Disable Mongoose buffering
    };

    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    // Await the connection promise and cache the result
    cached.conn = await cached.promise;
  } catch (error) {
    // Clear the promise if connection fails
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;

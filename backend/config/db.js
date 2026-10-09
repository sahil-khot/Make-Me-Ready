import mongoose from "mongoose";
import { env } from "./env.js";

let gridFSBucket = null;
let connectionPromise = null;

// Do not buffer Mongoose queries indefinitely if DB is disconnected
mongoose.set("bufferCommands", false);

export const isConfiguredMongoUri = (uri) => {
  if (!uri || typeof uri !== "string") return false;
  // Detect unreplaced template placeholders like <cluster-host> or <db_user>
  if (uri.includes("<") || uri.includes(">")) return false;
  return uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://");
};

export const connectDB = async () => {
  if (mongoose.connection?.readyState === 1) {
    return mongoose.connection;
  }

  if (!isConfiguredMongoUri(env.MONGODB_URI)) {
    const errorMsg =
      "MONGODB_URI is not properly configured (it contains template brackets '<...>'). Please update your MongoDB Atlas connection string in your environment variables.";
    console.warn(`[MongoDB Warning] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      const conn = await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "images",
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`MongoDB Connection Error: ${error.message}`);
      connectionPromise = null;
      throw error;
    }
  })();

  return connectionPromise;
};

export const getGridFSBucket = () => {
  if (!gridFSBucket && mongoose.connection?.db) {
    gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "images",
    });
  }
  return gridFSBucket;
};

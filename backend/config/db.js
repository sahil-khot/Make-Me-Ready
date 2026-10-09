import mongoose from "mongoose";
import { env } from "./env.js";

let gridFSBucket = null;
let connectionPromise = null;

export const connectDB = async () => {
  if (mongoose.connection?.readyState === 1) {
    return mongoose.connection;
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

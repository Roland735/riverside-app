// configs/dbConfig.js
import mongoose from "mongoose";

const mongooseOpts = {
  // Your existing recommended options:
  useNewUrlParser: true,
  useUnifiedTopology: true,

  // Force all reads to the primary node:
  readPreference: "primary",
  readConcern: { level: 'majority' },
  w: 'majority',

  // Ensure Mongoose uses the full SRV host list rather than a single host:
  directConnection: false,
};

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log("MongoDB already connected");
      return;
    }
    const conn = await mongoose.connect(process.env.MONGODB_URL, mongooseOpts);
    console.log(`MongoDB Connected (primary): ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      console.log("MongoDB already disconnected");
      return;
    }
    await mongoose.disconnect();
    console.log("MongoDB Disconnected");
  } catch (error) {
    console.error(`MongoDB disconnection error: ${error.message}`);
    process.exit(1);
  }
};

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export async function connectDB(retries = 5, delay = 5000) {
  if (isConnected) {
    console.log('Using existing MongoDB connection.');
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI is not set. Starting without MongoDB for local development.');
    isConnected = true;
    return;
  }

  while (retries > 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);

      isConnected = true;
      console.log('✅ MongoDB Connected Successfully!');
      return;
    } catch (error) {
      console.error(
        `MongoDB Connection Failed! Retries left: ${retries - 1}`
      );

      retries -= 1;
      if (retries === 0) {
        console.warn('MongoDB Connection Failed. Continuing without database for local development.');
        isConnected = true;
        return;
      }

      console.log(`⏳ Retrying connection in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export default connectDB;
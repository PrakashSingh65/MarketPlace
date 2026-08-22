import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export async function connectDB(retries = 5, delay = 5000) {
  // Already connected ho toh fast return karein
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log(' Using existing MongoDB connection.');
    return;
  }

  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoURI) {
    console.warn('⚠️ MONGODB_URI / MONGO_URI is not set in environment variables!');
    return;
  }

  // Connection Event Listeners
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB connection lost.');
    isConnected = false;
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });

  while (retries > 0) {
    try {
      console.log('⏳ Connecting to MongoDB...');
      await mongoose.connect(mongoURI);

      isConnected = true;
      console.log('✅ MongoDB Connected Successfully!');
      return;
    } catch (error) {
      retries -= 1;
      console.error(`❌ MongoDB Connection Failed! Retries left: ${retries}`);
      console.error(`Reason: ${error.message}`);

      if (retries === 0) {
        console.error('💥 All retry attempts exhausted. Could not connect to MongoDB.');
        // Production ya Docker env me exit kar dena standard practices hai
        if (process.env.NODE_ENV === 'production') {
          process.exit(1);
        }
        return;
      }

      console.log(`⏳ Retrying connection in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export default connectDB;
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

// Global Connection Listeners (Fired once)
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB connection lost.');
  isConnected = false;
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Connection Error:', err.message);
});

const connectDB = async (retries = 5, delay = 3000) => {
  // Already connected check
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('⚡ Using existing MongoDB connection.');
    return;
  }

  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('💥 MONGODB_URI / MONGO_URI is missing in .env file!');
    process.exit(1);
  }

  while (retries > 0) {
    try {
      console.log('⏳ Connecting to MongoDB...');
      
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000, // Fast timeout for quick error catching
      });

      isConnected = true;
      console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
      return;
    } catch (error) {
      retries -= 1;
      console.error(`❌ MongoDB Connection Failed! Retries left: ${retries}`);
      console.error(`Reason: ${error.message}`);

      if (retries === 0) {
        console.error('💥 All retry attempts exhausted. Halting process to avoid timeout errors.');
        process.exit(1); // Force exit so server doesn't stay alive without DB
      }

      console.log(`⏳ Retrying connection in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export default connectDB;
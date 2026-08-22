import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';
import mainRouter from './routes/index.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Production me exact frontend URL se replace karein
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static Uploads Directory (Images/Files ke liye)
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use('/api', mainRouter);

// Health Check / Root Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'B2B Textile Marketplace API Running Successfully!',
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `API Endpoint ${req.originalUrl} not found` 
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// Server Startup Function (DB connection ke baad server start karein)
const startServer = async () => {
  try {
    // Database Connect karein
    await connectDB();
    
    // Express Server Bind karein ('0.0.0.0' for Docker compatibility)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('💥 Failed to start server due to DB connection error:', error.message);
  }
};

startServer();
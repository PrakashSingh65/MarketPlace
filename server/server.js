import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';
import mainRouter from './routes/index.js';

dotenv.config();

const app = express();

// Allowed Origins List for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

// Fixed CORS Setup
app.use(cors({
  origin: (origin, callback) => {
    // Postman ya local tools ke request (jahan origin null hota hai) allow karein
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Dev environment ke liye allow all dynamic origins
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static Uploads Directory
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

// Server Startup Function
const startServer = async () => {
  try {
    await connectDB();
    
    // Bind to 0.0.0.0 for Docker & Local IPv4/IPv6 compatibility
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('💥 Failed to start server due to DB connection error:', error.message);
    process.exit(1);
  }
};

startServer();
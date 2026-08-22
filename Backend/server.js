import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import mainRouter from './routes/index.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/api', mainRouter);

app.get('/', (req, res) => {
  res.send('B2B Textile Marketplace API Running!');
});

app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `API Endpoint ${req.originalUrl} not found` 
  });
});

app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// Database connection attempt
connectDB()
  .then(() => {
    console.log('MongoDB connection established successfully.');
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    // process.exit(1) ko hata diya gaya hai taaki server crash na ho
  });

// Express server ko bina DB wait kiye listen mode par rakhein
// '0.0.0.0' Host specify karna Docker binding ke liye zaroori hai
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
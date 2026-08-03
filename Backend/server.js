import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();

const app = express();
app.use('/auth', authRoutes);
app.use('/products', productRoutes);


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('B2B Textile Marketplace API Running!');
});


const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
import express from 'express';

// Individual Route Imports
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import orderRoutes from './orderRoutes.js';
import cartRoutes from './cartRoutes.js';

const router = express.Router();

// API Sub-routes Mapping
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/fabrics', productRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);

export default router;
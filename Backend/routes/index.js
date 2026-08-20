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
router.use('/fabrics', productRoutes); // Alias for products
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);

// Unmatched API Sub-routes Handler (/api/*)
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Endpoint ${req.originalUrl} not found`
  });
});

export default router;
import express from 'express';

import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import orderRoutes from './orderRoutes.js';
import cartRoutes from './cartRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/fabrics', productRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);

router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Endpoint ${req.originalUrl} not found`
  });
});

export default router;
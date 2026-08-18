const express = require('express');
const router = express.Router();

// Individual Route Imports
const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');
const supplierRoutes = require('./supplier.routes');
const buyerRoutes = require('./buyer.routes');

// API Sub-routes Mapping
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/supplier', supplierRoutes);
router.use('/buyer', buyerRoutes);

module.exports = router;
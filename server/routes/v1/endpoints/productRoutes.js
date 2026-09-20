import express from 'express';
import {
  getProducts,
  getProductsByCategory,
  getProductById,
  addProduct,
  deleteProduct,
  addProductReview,
} from '../../../controllers/productController.js';
import upload from '../../../middleware/upload.js';
import { authMiddleware, isSupplier } from '../../../middleware/auth.middleware.js';
import { productCacheMiddleware } from '../../../middleware/cacheMiddleware.js';

const router = express.Router();

// GET routes cached with Redis (TTL: 600s / 10 Minutes)
router.get('/', productCacheMiddleware, getProducts);
router.get('/category/:categoryName', productCacheMiddleware, getProductsByCategory);
router.get('/:id', productCacheMiddleware, getProductById);

router.post('/', authMiddleware, isSupplier, upload.single('image'), addProduct);
router.delete('/:id', authMiddleware, isSupplier, deleteProduct);
router.post('/:id/reviews', authMiddleware, addProductReview);

export default router;
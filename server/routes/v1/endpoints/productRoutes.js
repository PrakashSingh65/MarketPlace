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
import { authMiddleware } from '../../../middleware/auth.middleware.js';

const router = express.Router();


router.get('/', getProducts);
router.get('/category/:categoryName', getProductsByCategory);
router.get('/:id', getProductById);

router.post('/', authMiddleware, upload.single('image'), addProduct);
router.delete('/:id', authMiddleware, deleteProduct);
router.post('/:id/reviews', authMiddleware, addProductReview);

export default router;
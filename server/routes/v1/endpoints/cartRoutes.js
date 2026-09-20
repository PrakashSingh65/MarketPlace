import express from 'express';
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateCartItem,
} from '../../../controllers/CartController.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';
import { cartCacheMiddleware } from '../../../middleware/cacheMiddleware.js';

const router = express.Router();

// GET own cart cached with Redis (TTL: 30s) scoped to authenticated user
router.get('/', authMiddleware, cartCacheMiddleware, getCart);
router.post('/add', authMiddleware, addToCart);
router.put('/update/:productId', authMiddleware, updateCartItem);
router.delete('/remove/:productId', authMiddleware, removeFromCart);
router.delete('/clear', authMiddleware, clearCart);

export default router;
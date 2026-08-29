import express from 'express';
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateCartItem,
} from '../../../controllers/CartController.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';

const router = express.Router();

// All cart routes require authentication — user sees only their own cart
router.get('/', authMiddleware, getCart);                               // GET own cart
router.post('/add', authMiddleware, addToCart);                         // POST add item
router.put('/update/:productId', authMiddleware, updateCartItem);       // PUT update qty
router.delete('/remove/:productId', authMiddleware, removeFromCart);    // DELETE single item
router.delete('/clear', authMiddleware, clearCart);                     // DELETE clear all

export default router;
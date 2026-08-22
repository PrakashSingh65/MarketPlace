import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/CartController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getCart);
router.post('/add', verifyToken, addToCart);
router.delete('/remove/:productId', verifyToken, removeFromCart);

export default router;
import express from 'express';
import { addToCart, getCart, removeFromCart } from '../../../controllers/CartController.js';
import { authMiddleware as verifyToken } from '../../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', verifyToken, getCart);
router.post('/add', verifyToken, addToCart);
router.delete('/remove/:productId', verifyToken, removeFromCart);

export default router;
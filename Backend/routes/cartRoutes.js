import express from 'express';
import { getCart, addToCart } from '../controllers/cartController.js';
import verifyToken from '../middleware/auth.js'; // Protect route

const router = express.Router();

router.get('/', verifyToken, getCart);
router.post('/add', verifyToken, addToCart);

export default router;
import express from 'express';
import { addToCart, getCart } from '../controllers/cartController.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getCart);
router.post('/add', verifyToken, addToCart);

export default router;
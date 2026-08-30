import express from 'express';
import { getRazorpayKey, createRazorpayOrder, verifyPayment } from '../../../controllers/paymentController.js';
import { optionalAuthMiddleware } from '../../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/key', getRazorpayKey);
router.post('/create-order', optionalAuthMiddleware, createRazorpayOrder);
router.post('/verify-payment', optionalAuthMiddleware, verifyPayment);

export default router;
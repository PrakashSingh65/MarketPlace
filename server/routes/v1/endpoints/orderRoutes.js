import express from 'express';
import { 
  createOrder, 
  getUserOrders,
  getOrderById, 
  getAllOrders, 
  updateOrderStatus, 
  cancelOrder 
} from '../../../controllers/orderController.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';
import { orderCacheMiddleware } from '../../../middleware/cacheMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createOrder);

// GET routes cached with Redis (TTL: 180s / 3 Minutes)
router.get('/my-orders', authMiddleware, orderCacheMiddleware, getUserOrders);
router.get('/user/:userId', authMiddleware, orderCacheMiddleware, getUserOrders);
router.get('/all', authMiddleware, orderCacheMiddleware, getAllOrders);
router.get('/:id', authMiddleware, orderCacheMiddleware, getOrderById);

router.put('/update-status/:id', authMiddleware, updateOrderStatus);
router.put('/cancel/:id', authMiddleware, cancelOrder);

export default router;
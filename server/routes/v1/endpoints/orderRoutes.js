import express from 'express';
import { 
  createOrder, 
  getUserOrders,
  getOrderById, 
  getAllOrders, 
  updateOrderStatus, 
  cancelOrder 
} from '../../../controllers/orderController.js';
import { authMiddleware, optionalAuthMiddleware } from '../../../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', optionalAuthMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getUserOrders);
router.get('/user/:userId', authMiddleware, getUserOrders);
router.get('/all', authMiddleware, getAllOrders);
router.get('/:id', optionalAuthMiddleware, getOrderById);
router.put('/update-status/:id', authMiddleware, updateOrderStatus);
router.put('/cancel/:id', authMiddleware, cancelOrder);

export default router;
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

const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getUserOrders);
router.get('/user/:userId', authMiddleware, getUserOrders);
router.get('/all', authMiddleware, getAllOrders);
router.get('/:id', authMiddleware, getOrderById);
router.put('/update-status/:id', authMiddleware, updateOrderStatus);
router.put('/cancel/:id', authMiddleware, cancelOrder);

export default router;
import express from 'express';
import { 
  createOrder, 
  getOrderById, 
  getAllOrders, 
  updateOrderStatus, 
  cancelOrder 
} from '../controllers/orderController.js';

const router = express.Router();

// 1. GET /api/orders/my-orders
router.get('/my-orders', getAllOrders);

// 2. GET /api/orders/:id
router.get('/:id', getOrderById);

// 3. POST /api/orders
router.post('/', createOrder);

// 4. PUT /api/orders/update-status/:id
router.put('/update-status/:id', updateOrderStatus);

// 5. PUT /api/orders/cancel/:id
router.put('/cancel/:id', cancelOrder);

export default router;
import express from 'express';
import { 
  createOrder, 
  getOrderById, 
  getAllOrders, 
  updateOrderStatus, 
  cancelOrder 
} from '../controllers/orderController.js';

// Optional: Agar Auth Middleware setup hai toh import karein
// import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. GET /api/orders/my-orders - Buyer Dashboard Orders List
router.get('/my-orders', getAllOrders);

// 2. GET /api/orders/:id - Single Order Details & Tracking Page (Order ID ya Mongo ID se)
router.get('/:id', getOrderById);

// 3. POST /api/orders - Checkout Process (Create Order)
router.post('/', createOrder);

// 4. PUT /api/orders/update-status/:id - Supplier/Admin Status Update
router.put('/update-status/:id', updateOrderStatus);

// 5. PUT /api/orders/cancel/:id - Buyer Order Cancel Action
router.put('/cancel/:id', cancelOrder);

export default router;
import express from 'express';
import { 
  createOrder, 
  getOrderById, 
  getAllOrders, 
  updateOrderStatus, 
  cancelOrder 
} from '../../../controllers/orderController.js';

const router = express.Router();

router.get('/my-orders', getAllOrders);
router.post('/', createOrder);
router.put('/update-status/:id', updateOrderStatus);
router.put('/cancel/:id', cancelOrder);
router.get('/:id', getOrderById);

export default router;
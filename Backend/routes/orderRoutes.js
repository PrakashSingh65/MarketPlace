import express from 'express';
import Order from '../models/Order.js'; // Extension .js zaroori hai
import { protect } = require middleware standard path adjustment:
// import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. GET /api/orders/my-orders (Buyer Dashboard Orders Fetch)
router.get('/my-orders', async (req, res) => {
  try {
    // Agar Auth Middleware Active Hai:
    // const userId = req.user ? req.user._id : null;
    // const query = userId ? { user: userId } : {};
    
    const orders = await Order.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Error fetching buyer orders:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Orders fetch nahi ho paye',
      error: error.message
    });
  }
});

// 2. POST /api/orders (Checkout Process)
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentStatus, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart empty hai'
      });
    }

    const newOrder = new Order({
      user: req.user ? req.user._id : null,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'upi',
      paymentStatus: paymentStatus || 'Paid',
      totalAmount: totalAmount || 0,
      status: 'Pending'
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: savedOrder
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({
      success: false,
      message: 'Order place nahi ho paya',
      error: error.message
    });
  }
});

export default router;
const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Aapka Order Model
const { protect } = require('../middleware/authMiddleware'); // Auth Middleware

// 1. GET /api/orders/my-orders (Buyer ke specific orders fetch karne ke liye)
router.get('/my-orders', protect, async (req, res) => {
  try {
    // Current logged-in user ke ID se orders dhundhein
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Error fetching buyer orders:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error: Orders fetch nahi ho paye'
    });
  }
});

// 2. POST /api/orders (Naya order create karne ke liye - Checkout process)
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentStatus, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart khali hai' });
    }

    const newOrder = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentStatus || 'Pending',
      totalAmount,
      status: 'Pending'
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ success: false, message: 'Order place nahi ho paya' });
  }
});

module.exports = router;
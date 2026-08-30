import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';

const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_API_KEY;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

export const getRazorpayKey = async (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_API_KEY || '';
  res.status(200).json({ keyId });
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, orderId } = req.body;
    const userId = req.user?._id || req.body.userId;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Valid payment amount is required' });
    }

    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      return res.status(500).json({
        message: 'Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.',
        success: false
      });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), 
      currency,
      receipt: receipt || `receipt_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save payment record in DB with user ID if available
    const payment = new Payment({
      user: userId || null,
      order: orderId && orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null,
      razorpayOrderId: razorpayOrder.id,
      amount: Number(amount),
      currency,
      status: 'Created',
      paymentMethod: 'Razorpay'
    });

    await payment.save();

    res.status(200).json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_API_KEY,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
      paymentId: payment._id
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(500).json({ message: 'Razorpay order creation failed', error: error.message, success: false });
  }
};

export const createOrder = createRazorpayOrder;

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const userId = req.user?._id || req.body.userId;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing Razorpay payment parameters', success: false });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'RAZORPAY_KEY_SECRET is not configured on server', success: false });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update Payment transaction in DB
      const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
      if (payment) {
        payment.razorpayPaymentId = razorpay_payment_id;
        payment.razorpaySignature = razorpay_signature;
        payment.status = 'Captured';
        if (userId && !payment.user) payment.user = userId;
        await payment.save();
      }

      // Update associated Order in DB
      let updatedOrder = null;
      const targetOrderId = orderId || payment?.order;

      if (targetOrderId) {
        updatedOrder = await Order.findOne({
          $or: [
            { _id: targetOrderId.toString().match(/^[0-9a-fA-F]{24}$/) ? targetOrderId : null },
            { orderId: targetOrderId },
            { razorpayOrderId: razorpay_order_id }
          ]
        });
      } else {
        updatedOrder = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      }

      if (updatedOrder) {
        updatedOrder.paymentStatus = 'Paid';
        updatedOrder.status = 'Order Confirmed';
        updatedOrder.razorpayOrderId = razorpay_order_id;
        updatedOrder.razorpayPaymentId = razorpay_payment_id;
        if (userId && !updatedOrder.user) {
          updatedOrder.user = userId;
        }
        await updatedOrder.save();
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        order: updatedOrder
      });
    } else {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'Failed' }
      );

      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message, success: false });
  }
};
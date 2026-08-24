import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpay = null;
try {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_API_KEY;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (keyId && keySecret) {
    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
} catch (err) {
  console.warn('⚠️ Razorpay initialization warning:', err.message);
}

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!razorpay) {
      return res.status(400).json({ message: 'Razorpay is not configured' });
    }

    const options = {
      amount: Number(amount) * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(500).json({ message: 'Order creation failed', error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
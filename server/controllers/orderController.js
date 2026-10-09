import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Payment from '../models/Payment.js';
import { invalidateOrderCache } from '../middleware/cacheMiddleware.js';

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      userId,
      paymentStatus,
      razorpayPaymentId
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items in order', success: false });
    }

    const resolvedUserId = req.user?._id || userId || req.body.user || null;

    // 1. Validate product IDs and fetch authoritative product documents from database
    const productIds = items
      .map((item) => item.product || item._id || item.productId)
      .filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (productIds.length !== items.length) {
      return res.status(400).json({
        message: 'Invalid product ID detected in order items',
        success: false
      });
    }

    const dbProducts = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(dbProducts.map((p) => [p._id.toString(), p]));

    // 2. Build verified items with database-verified prices and check stock
    const verifiedItems = [];
    for (const item of items) {
      const pid = (item.product || item._id || item.productId).toString();
      const dbProduct = productMap.get(pid);

      if (!dbProduct) {
        return res.status(404).json({
          message: `Product with ID ${pid} not found in inventory`,
          success: false
        });
      }

      const qty = Number(item.quantity) > 0 ? Number(item.quantity) : 1;

      // Verify stock availability
      if (typeof dbProduct.stock === 'number' && dbProduct.stock < qty) {
        return res.status(400).json({
          message: `Insufficient stock for "${dbProduct.title}". Requested: ${qty}, Available: ${dbProduct.stock}`,
          success: false
        });
      }

      // Authoritative price directly from DB (ignoring any client-provided prices)
      const authoritativePrice = Number(dbProduct.pricePerMeter ?? dbProduct.price ?? 0);
      const platformFee = 19;

      verifiedItems.push({
        product: dbProduct._id,
        title: dbProduct.title || dbProduct.name || 'Textile Fabric',
        image: dbProduct.image || (dbProduct.images && dbProduct.images[0]) || '',
        seller: dbProduct.supplier ? String(dbProduct.supplier) : 'OnestoLabs',
        price: authoritativePrice,
        listingPrice: authoritativePrice,
        specialPrice: authoritativePrice,
        platformFee,
        quantity: qty
      });
    }

    // 3. Recalculate financial totals securely on the backend
    const subtotal = verifiedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalPlatformFee = verifiedItems.reduce((sum, item) => sum + (item.platformFee * item.quantity), 0);
    const calculatedGrandTotal = subtotal + totalPlatformFee;

    const formattedPricing = {
      listingPrice: subtotal,
      specialPrice: subtotal,
      totalPlatformFee,
      totalDiscount: 0
    };

    const formattedAddress = {
      name: shippingAddress?.name || req.user?.name || 'Customer',
      phone: shippingAddress?.phone || req.user?.phone || '',
      street: shippingAddress?.street || shippingAddress?.address || '',
      address: shippingAddress?.address || shippingAddress?.street || '',
      city: shippingAddress?.city || '',
      pincode: shippingAddress?.pincode || ''
    };

    const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
    const timeline = [
      { title: 'Order Confirmed', date: currentDate, description: 'Order successfully placed', completed: true },
      { title: 'Shipped', date: 'In Progress', description: 'Item is being processed by seller', completed: false },
      { title: 'Out For Delivery', date: 'Pending', description: '', completed: false },
      { title: 'Delivery', date: 'Expected within 3-5 days', description: '', completed: false }
    ];

    const normalizedPaymentMethod = paymentMethod || 'Razorpay';
    const isCod = ['COD', 'cod', 'Cash On Delivery'].includes(normalizedPaymentMethod);

    // 4. Generate Razorpay order using verified backend total if online payment and not already paid
    let generatedRazorpayOrderId = null;
    let razorpayOrderData = null;

    if (!isCod && !razorpayPaymentId) {
      const keyId = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_API_KEY;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (keyId && keySecret) {
        const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const rzpOrder = await razorpay.orders.create({
          amount: Math.round(calculatedGrandTotal * 100), // In paise
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`
        });

        generatedRazorpayOrderId = rzpOrder.id;
        razorpayOrderData = {
          orderId: rzpOrder.id,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          keyId
        };

        const payment = new Payment({
          user: resolvedUserId,
          razorpayOrderId: rzpOrder.id,
          amount: calculatedGrandTotal,
          currency: 'INR',
          status: 'Created',
          paymentMethod: 'Razorpay'
        });
        await payment.save();
      }
    }

    const resolvedRazorpayOrderId = req.body.razorpayOrderId || generatedRazorpayOrderId || null;
    const resolvedPaymentStatus = isCod
      ? 'Pending'
      : (razorpayPaymentId ? 'Paid' : 'Pending');

    const order = new Order({
      user: resolvedUserId,
      items: verifiedItems,
      shippingAddress: formattedAddress,
      paymentMethod: normalizedPaymentMethod,
      paymentStatus: resolvedPaymentStatus,
      razorpayOrderId: resolvedRazorpayOrderId,
      razorpayPaymentId: razorpayPaymentId || null,
      pricing: formattedPricing,
      totalAmount: calculatedGrandTotal,
      status: 'Order Confirmed',
      timeline
    });

    const savedOrder = await order.save();

    // Link payment record to saved order if payment intent was created
    if (generatedRazorpayOrderId) {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: generatedRazorpayOrderId },
        { order: savedOrder._id }
      );
    }

    // 5. Deduct stock for each purchased product
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    await invalidateOrderCache(resolvedUserId, savedOrder._id);
    return res.status(201).json({ 
      message: 'Order placed successfully', 
      success: true,
      order: savedOrder,
      razorpayOrder: razorpayOrderData
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Error creating order', error: error.message, success: false });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?._id || req.params.userId || req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required', success: false });
    }

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user orders', error: error.message, success: false });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const isObjectId = id && id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { $or: [{ _id: id }, { orderId: id }] } : { orderId: id };
    const order = await Order.findOne(query).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found', success: false });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details', error: error.message, success: false });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message, success: false });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found', success: false });
    }

    order.status = status;

    const statusLevels = ['Order Confirmed', 'Shipped', 'Out For Delivery', 'Delivered'];
    const currentLevelIndex = statusLevels.indexOf(status);

    if (currentLevelIndex !== -1) {
      order.timeline = order.timeline.map((step, idx) => ({
        ...step,
        completed: idx <= currentLevelIndex
      }));
    }

    const updatedOrder = await order.save();
    await invalidateOrderCache(order.user, order._id);
    res.status(200).json({ message: 'Order status updated', success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message, success: false });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = id && id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { $or: [{ _id: id }, { orderId: id }] } : { orderId: id };
    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({ message: 'Order not found', success: false });
    }

    const isOwner = order.user && req.user && order.user.toString() === req.user._id.toString();
    const isAdmin = (req.user?.role || '').toUpperCase() === 'ADMIN';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to cancel this order', success: false });
    }

    if (order.status === 'Delivered') {
      return res.status(400).json({ message: 'Delivered orders cannot be cancelled', success: false });
    }

    order.status = 'Cancelled';
    const cancelledOrder = await order.save();
    await invalidateOrderCache(order.user, order._id);

    res.status(200).json({ message: 'Order cancelled successfully', success: true, order: cancelledOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order', error: error.message, success: false });
  }
};
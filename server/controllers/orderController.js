import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      userId,
      pricing,
      totalAmount,
      paymentStatus,
      razorpayOrderId,
      razorpayPaymentId
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order', success: false });
    }

    const resolvedUserId = req.user?._id || userId || req.body.user || null;

    const totalPlatformFee = items.reduce((sum, item) => sum + ((item.platformFee || 19) * (item.quantity || 1)), 0);
    const subtotal = items.reduce((sum, item) => sum + (Number(item.price || 0) * (item.quantity || 1)), 0);
    const calculatedGrandTotal = subtotal + totalPlatformFee;

    const finalTotalAmount = totalAmount ? Number(totalAmount) : calculatedGrandTotal;

    const formattedPricing = {
      listingPrice: pricing?.listingPrice || subtotal,
      specialPrice: pricing?.specialPrice || subtotal,
      totalPlatformFee: pricing?.totalPlatformFee || totalPlatformFee,
      totalDiscount: pricing?.totalDiscount || 0
    };

    const formattedAddress = {
      name: shippingAddress?.name || 'Customer',
      phone: shippingAddress?.phone || '',
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
    const isCod = normalizedPaymentMethod === 'COD' || normalizedPaymentMethod === 'cod' || normalizedPaymentMethod === 'Cash On Delivery';
    
    let resolvedPaymentStatus = paymentStatus || (isCod ? 'Pending' : (razorpayPaymentId ? 'Paid' : 'Pending'));

    const order = new Order({
      user: resolvedUserId,
      items,
      shippingAddress: formattedAddress,
      paymentMethod: normalizedPaymentMethod,
      paymentStatus: resolvedPaymentStatus,
      razorpayOrderId: razorpayOrderId || null,
      razorpayPaymentId: razorpayPaymentId || null,
      pricing: formattedPricing,
      totalAmount: finalTotalAmount,
      status: 'Order Confirmed',
      timeline
    });

    const savedOrder = await order.save();
    res.status(201).json({ 
      message: 'Order placed successfully', 
      success: true,
      order: savedOrder 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message, success: false });
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
    
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const order = await Order.findOne({
      $or: [{ orderId: id }, { _id: isObjectId ? id : null }]
    }).populate('user', 'name email phone');

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
    res.status(200).json({ message: 'Order status updated', success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message, success: false });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const order = await Order.findOne({
      $or: [{ orderId: id }, { _id: isObjectId ? id : null }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found', success: false });
    }

    if (order.status === 'Delivered') {
      return res.status(400).json({ message: 'Delivered orders cannot be cancelled', success: false });
    }

    order.status = 'Cancelled';
    const cancelledOrder = await order.save();

    res.status(200).json({ message: 'Order cancelled successfully', success: true, order: cancelledOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order', error: error.message, success: false });
  }
};
import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, userId, pricing } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    const totalPlatformFee = items.reduce((sum, item) => sum + ((item.platformFee || 19) * (item.quantity || 1)), 0);
    const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
    const grandTotal = subtotal + totalPlatformFee;

    const formattedPricing = {
      listingPrice: pricing?.listingPrice || subtotal,
      specialPrice: pricing?.specialPrice || subtotal,
      totalPlatformFee: pricing?.totalPlatformFee || totalPlatformFee,
      totalDiscount: pricing?.totalDiscount || 0
    };

    const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
    const timeline = [
      { title: 'Order Confirmed', date: currentDate, description: 'Order successfully placed', completed: true },
      { title: 'Shipped', date: 'In Progress', description: 'Item is being processed by seller', completed: false },
      { title: 'Out For Delivery', date: 'Pending', description: '', completed: false },
      { title: 'Delivery', date: 'Expected within 3-5 days', description: '', completed: false }
    ];

    const order = new Order({
      user: userId || req.user?._id || null,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      pricing: formattedPricing,
      totalAmount: grandTotal,
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
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findOne({
      $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    }).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
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
    res.status(200).json({ message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      $or: [{ orderId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'Delivered') {
      return res.status(400).json({ message: 'Delivered orders cannot be cancelled' });
    }

    order.status = 'Cancelled';
    const cancelledOrder = await order.save();

    res.status(200).json({ message: 'Order cancelled successfully', order: cancelledOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order', error: error.message });
  }
};
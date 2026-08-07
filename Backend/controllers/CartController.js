import Cart from '../models/Cart.js';

const getAuthenticatedUserId = (req) => {
  const rawUserId = req.user?.userId || req.user?._id || req.user?.id;
  return rawUserId?.toString();
};

// Add or Update Item in Cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId && item.productId.toString() === productId.toString()
    );

    const qtyToAdd = Number(quantity) > 0 ? Number(quantity) : 1;

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += qtyToAdd;
    } else {
      cart.items.push({ productId, quantity: qtyToAdd });
    }

    await cart.save();

    const populatedCart = await Cart.findOne({ userId }).populate('items.productId');

    return res.status(200).json({
      success: true,
      message: 'Product added to cart successfully',
      cart: populatedCart || cart
    });
  } catch (error) {
    console.error('SERVER ERROR IN ADD TO CART:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

// Get User Cart
export const getCart = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    let cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error('SERVER ERROR IN GET CART:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Helper: Get authenticated user _id from req.user (set by authMiddleware)
const getUserId = (req) => req.user?._id;

// ─── Add or Update Item in Cart ───────────────────────────────────────────────
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
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
      cart: populatedCart
    });
  } catch (error) {
    console.error('ADD TO CART ERROR:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

// ─── Get Logged-In User's Cart Only ───────────────────────────────────────────
export const getCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const cart = await Cart.findOne({ userId }).populate('items.productId');

    // Return empty cart if none exists – do NOT auto-create
    if (!cart) {
      return res.status(200).json({ success: true, cart: { userId, items: [] } });
    }

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error('GET CART ERROR:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

// ─── Remove Single Item from Cart (own cart only) ─────────────────────────────
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.productId && item.productId.toString() !== productId.toString()
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.productId');

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      cart: populatedCart
    });
  } catch (error) {
    console.error('REMOVE FROM CART ERROR:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

// ─── Clear Entire Cart (own cart only) ────────────────────────────────────────
export const clearCart = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(200).json({ success: true, message: 'Cart is already empty' });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({ success: true, message: 'Cart cleared successfully', cart });
  } catch (error) {
    console.error('CLEAR CART ERROR:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

// ─── Update Item Quantity in Cart (own cart only) ─────────────────────────────
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (!quantity || Number(quantity) < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId && item.productId.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = Number(quantity);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.productId');

    return res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      cart: populatedCart
    });
  } catch (error) {
    console.error('UPDATE CART ITEM ERROR:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};
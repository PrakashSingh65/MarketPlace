import { useState } from 'react';

const CART_KEY = 'marketplace-cart';

const readCart = () => {
  try {
    const storedCart = localStorage.getItem(CART_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch {
    return [];
  }
};

export default function useCart() {
  const [cart, setCart] = useState(readCart);

  const updateCart = (nextCart) => {
    setCart(nextCart);
    localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
  };

  const addToCart = (product) => {
    const productId = product._id || product.id;
    const existingItem = cart.find((item) => (item._id || item.id) === productId);
    const nextCart = existingItem
      ? cart.map((item) => (item._id || item.id) === productId
        ? { ...item, quantity: (item.quantity || 1) + 1 }
        : item)
      : [...cart, { ...product, quantity: 1 }];
    updateCart(nextCart);
  };

  const updateQuantity = (productId, quantity) => {
    updateCart(cart.map((item) => (item._id || item.id) === productId ? { ...item, quantity } : item));
  };

  const removeFromCart = (productId) => {
    updateCart(cart.filter((item) => (item._id || item.id) !== productId));
  };

  const clearCart = () => updateCart([]);

  return { cart, addToCart, updateQuantity, removeFromCart, clearCart };
}
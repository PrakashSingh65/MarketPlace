import React, { createContext, useContext, useState, useEffect } from 'react';

// Exporting CartContext to prevent import errors
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('lelobhai_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('lelobhai_cart', JSON.stringify(cart));
  }, [cart]);

  // Add Item to Cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const id = product._id || product.id;
      const existingItem = prevCart.find((item) => (item._id || item.id) === id);

      if (existingItem) {
        return prevCart.map((item) =>
          (item._id || item.id) === id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Remove Item from Cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => (item._id || item.id) !== id));
  };

  // Update Item Quantity (Fixes Quantity + / - issue)
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item._id || item.id) === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Clear Cart
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
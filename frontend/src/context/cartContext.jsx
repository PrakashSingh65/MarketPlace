import React, { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Cart initial load error:", e);
      return [];
    }
  });

  // Jab bhi cart array change ho, localStorage update karein
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      console.error("Cart save error:", e);
    }
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    if (!product) return;

    const targetId = product._id || product.id;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => (item._id || item.id) === targetId
      );

      if (existingIndex > -1) {
        // Immutable update (Object duplicate banakar quantity update karna)
        return prevCart.map((item, index) => {
          if (index === existingIndex) {
            return {
              ...item,
              quantity: (Number(item.quantity) || 1) + Number(qty),
            };
          }
          return item;
        });
      }

      // Naya product add karne ke liye
      return [
        ...prevCart,
        {
          ...product,
          id: targetId,
          quantity: Number(qty) || 1,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => (item._id || item.id) !== productId)
    );
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item._id || item.id) === productId
          ? { ...item, quantity: Number(newQty) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
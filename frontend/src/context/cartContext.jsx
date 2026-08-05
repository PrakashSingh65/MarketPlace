import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  // LocalStorage se cart items load karein ya initial empty array rakhein
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('marketplace_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Cart update hone par localStorage save karein
  useEffect(() => {
    localStorage.setItem('marketplace_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 1. Add Product to Cart
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const pId = product._id || product.id;
      const existing = prevItems.find((item) => (item._id || item.id) === pId);

      if (existing) {
        return prevItems.map((item) =>
          (item._id || item.id) === pId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  // 2. Update Quantity
  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        (item._id || item.id) === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // 3. Remove Product
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => (item._id || item.id) !== productId)
    );
  };

  // Clear Cart
  const clearCart = () => setCartItems([]);

  // Calculations
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
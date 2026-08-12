import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { token } = useContext(AuthContext);

  // Initial Load from LocalStorage or Backend
  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        try {
          const res = await fetch('/api/cart', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (res.ok && data.cart) {
            const items = data.cart.items.map(item => ({
              ...item.productId,
              quantity: item.quantity
            }));
            setCartItems(items);
          }
        } catch (err) {
          console.error("Cart Fetch Error:", err);
        }
      } else {
        const localData = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(localData);
      }
    };
    fetchCart();
  }, [token]);

  // ➕ ADD TO CART FUNCTION
  const addToCart = async (product) => {
    try {
      const pId = product._id || product.id;

      // 1. Local State Update (Instant UI feedback)
      setCartItems((prevItems) => {
        const existingIndex = prevItems.findIndex(item => (item._id || item.id) === pId);
        let updated;
        if (existingIndex > -1) {
          updated = [...prevItems];
          updated[existingIndex].quantity = (updated[existingIndex].quantity || 1) + 1;
        } else {
          updated = [...prevItems, { ...product, quantity: 1 }];
        }
        localStorage.setItem('cart', JSON.stringify(updated));
        return updated;
      });

      // 2. Backend API Sync (if logged in)
      if (token) {
        await fetch('/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productId: pId, quantity: 1 })
        });
      }
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, totalItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};
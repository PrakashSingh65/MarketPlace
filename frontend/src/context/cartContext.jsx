import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { token, logout } = useContext(AuthContext) || {};

  // Initial Load from LocalStorage or Backend
  useEffect(() => {
    const fetchCart = async () => {
      const localData = JSON.parse(localStorage.getItem('cart') || '[]');

      // Token check
      if (token && token !== 'undefined' && token !== 'null') {
        try {
          const res = await fetch('/api/cart', {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });

          // If Token is Expired / Invalid (401 or 403)
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token');
            if (logout) logout();
            setCartItems(localData);
            return;
          }

          const data = await res.json();
          if (res.ok && data.cart) {
            const items = data.cart.items.map((item) => ({
              ...(item.productId || item),
              _id: item.productId?._id || item._id || item.id,
              quantity: item.quantity,
            }));
            setCartItems(items);
          } else {
            setCartItems(localData);
          }
        } catch (err) {
          setCartItems(localData);
        }
      } else {
        setCartItems(localData);
      }
    };

    fetchCart();
  }, [token, logout]);

  // ➕ ADD TO CART FUNCTION
  const addToCart = async (product) => {
    try {
      const pId = product._id || product.id;

      setCartItems((prevItems) => {
        const existingIndex = prevItems.findIndex(
          (item) => (item._id || item.id) === pId
        );
        let updated;
        if (existingIndex > -1) {
          updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: (updated[existingIndex].quantity || 1) + 1,
          };
        } else {
          updated = [...prevItems, { ...product, quantity: 1 }];
        }
        localStorage.setItem('cart', JSON.stringify(updated));
        return updated;
      });

      if (token && token !== 'undefined') {
        await fetch('/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: pId, quantity: 1 }),
        });
      }
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  };

  // 🗑️ REMOVE FROM CART FUNCTION
  const removeFromCart = async (productId, isFullRemove = false) => {
    const targetId =
      typeof productId === 'object'
        ? productId._id || productId.id
        : productId;

    setCartItems((prevItems) => {
      const updated = prevItems.reduce((acc, item) => {
        const currentId =
          item._id || item.id || item.productId?._id || item.productId;

        if (currentId === targetId) {
          if (isFullRemove || (item.quantity || 1) <= 1) {
            return acc;
          }
          return [...acc, { ...item, quantity: item.quantity - 1 }];
        }

        return [...acc, item];
      }, []);

      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });

    if (token && token !== 'undefined') {
      try {
        await fetch(`/api/cart/remove/${targetId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error('Backend remove item error:', err);
      }
    }
  };

  // 🧹 CLEAR ALL CART FUNCTION
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const totalItems = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 💡 Custom hook export (Easy import ke liye)
export const useCart = () => useContext(CartContext);
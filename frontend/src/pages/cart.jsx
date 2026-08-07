import { useState, useEffect } from 'react';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Cart Items from API & LocalStorage
  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/cart', {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await res.json();

      if (res.ok && data.cart && data.cart.items) {
        // Backend DB items map karein
        const formatted = data.cart.items.map((item) => ({
          ...item.productId,
          quantity: item.quantity,
          cartItemId: item._id,
        }));
        setCartItems(formatted);
      } else {
        // Fallback to LocalStorage
        const localData = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(localData);
      }
    } catch (err) {
      console.error('Cart Fetch Error:', err);
      const localData = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(localData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Quantity Handler
  const updateQuantity = (id, delta) => {
    const updated = cartItems.map((item) => {
      if ((item._id || item.id) === id) {
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  // Remove Item Handler
  const removeItem = (id) => {
    const updated = cartItems.filter((item) => (item._id || item.id) !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading Cart...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ShoppingBag className="text-indigo-500" /> Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-5 max-w-lg mx-auto mt-10">
            <div className="w-20 h-20 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag size={40} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Your Cart is Empty</h2>
              <p className="text-xs text-slate-400 mt-2">
                Looks like you haven't added any fabrics or materials to your cart yet.
              </p>
            </div>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/20"
            >
              <ArrowLeft size={16} /> Explore Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id || item.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4"
                >
                  <img
                    src={
                      (item.images && item.images[0]) ||
                      item.image ||
                      'https://via.placeholder.com/100'
                    }
                    alt={item.title || item.name}
                    className="w-20 h-20 object-cover rounded-xl bg-slate-950"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">
                      {item.title || item.name}
                    </h3>
                    <p className="text-xs text-indigo-400 font-semibold mt-1">
                      ₹{item.price} / meter
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-slate-700 bg-slate-950 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item._id || item.id, -1)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-xs font-bold">{item.quantity || 1}</span>
                        <button
                          onClick={() => updateQuantity(item._id || item.id, 1)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item._id || item.id)}
                        className="text-rose-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-fit space-y-4">
              <h3 className="text-sm font-bold border-b border-slate-800 pb-3">Order Summary</h3>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-semibold">Free</span>
                </div>
              </div>
              <div className="border-t border-slate-800 pt-3 flex justify-between font-bold text-sm text-white">
                <span>Total Amount</span>
                <span className="text-indigo-400">₹{totalAmount}</span>
              </div>
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs font-bold transition">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, ShoppingBag, Image as ImageIcon } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.price || item.pricePerMeter || 0;
      const qty = item.quantity || 1;
      return total + price * qty;
    }, 0);
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800">
          <ShoppingBag className="text-indigo-400" size={28} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Aapka Cart Khali Hai</h2>
        <p className="text-slate-400 text-sm mb-6">Marketplace se products add karein.</p>
        <Link
          to="/marketplace"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-6 rounded-xl transition text-sm"
        >
          Explore Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="text-indigo-400" /> Shopping Cart ({cart.length})
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-red-400 hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, idx) => {
            // Check all possible image properties in product object
            const imageSrc = item.image || item.imageUrl || item.img || item.images?.[0];

            return (
              <div
                key={item._id || item.id || idx}
                className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4"
              >
                {/* Image Container with Fallback */}
                <div className="w-20 h-20 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-700">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={item.title || item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Image load error hone par fallback placeholder set hoga
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=200';
                      }}
                    />
                  ) : (
                    <ImageIcon className="text-slate-500" size={24} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-white truncate">
                    {item.title || item.name || 'Product Item'}
                  </h3>
                  <p className="text-xs text-indigo-400 mt-1 font-semibold">
                    ₹{item.price || item.pricePerMeter || 0} x {item.quantity || 1}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item._id || item.id)}
                  className="text-slate-500 hover:text-red-400 p-2 transition"
                  title="Remove Item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit space-y-4">
          <h2 className="font-bold text-lg border-b border-slate-800 pb-2">Order Summary</h2>
          <div className="flex justify-between text-sm text-slate-300">
            <span>Total Amount</span>
            <span className="font-bold text-emerald-400">₹{calculateTotal()}</span>
          </div>
          <Link
            to="/checkout"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition text-center block text-sm"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from 'lucide-react';
import { CartContext } from '../context/cartContext';

export default function Cart() {
  const { cartItems, addToCart, removeFromCart, clearCart } = useContext(CartContext);

  // Safe Subtotal Calculation
  const subtotal = (cartItems || []).reduce((acc, item) => {
    const price = Number(item?.price) || Number(item?.productId?.price) || 0;
    const qty = Number(item?.quantity) || 1;
    return acc + price * qty;
  }, 0);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-950 text-white p-4">
        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 text-slate-500">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Aapka Cart Khali Hai</h2>
        <p className="text-slate-400 mb-6 text-sm">Marketplace se products add karein.</p>
        <Link
          to="/marketplace"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition"
        >
          Explore Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <ShoppingBag className="text-indigo-500" /> Shopping Cart
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Aapke paas <span className="text-indigo-400 font-bold">{cartItems.length}</span> items hain
            </p>
          </div>
          <Link
            to="/marketplace"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => {
              // Extract product properties safely
              const p = item.productId || item;
              const title = p.title || p.name || 'Untitled Fabric';
              const price = p.price || 0;
              const image =
                (p.images && p.images[0]) || p.image || 'https://via.placeholder.com/100';
              const quantity = item.quantity || 1;
              const id = p._id || p.id || index;

              return (
                <div
                  key={id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 hover:border-slate-700 transition"
                >
                  <img
                    src={image}
                    alt={title}
                    className="w-20 h-20 object-cover rounded-xl bg-slate-950"
                  />

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-white text-base">{title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{p.category || 'Fabric'}</p>
                    <p className="text-emerald-400 font-bold text-sm mt-1">
                      ₹{price} <span className="text-xs text-slate-400 font-normal">/meter</span>
                    </p>
                  </div>

                  {/* Quantity Controls & Delete */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 px-2 py-1">
                      <button
                        onClick={() => removeFromCart && removeFromCart(id)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-sm font-bold text-indigo-400">{quantity}</span>
                      <button
                        onClick={() => addToCart && addToCart(p)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart && removeFromCart(id, true)}
                      className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition"
                      title="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit space-y-4">
            <h2 className="text-lg font-bold border-b border-slate-800 pb-3">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white font-semibold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Tax / GST</span>
                <span className="text-white font-semibold">Calculated at Checkout</span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 flex justify-between font-bold text-lg">
              <span>Total Amount</span>
              <span className="text-emerald-400">₹{subtotal.toLocaleString()}</span>
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/30 transition active:scale-95">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { ShieldCheck, Trash2, Bookmark, Zap, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart = [], removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  // Quantity Change Handler (Safely updates context)
  const handleQuantityChange = (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty >= 1) {
      if (updateQuantity) {
        updateQuantity(itemId, newQty);
      }
    }
  };

  // Dynamic Price Calculations
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
  const totalMRP = cart.reduce((sum, item) => {
    const original = item.originalPrice || Math.round(Number(item.price) * 1.5);
    return sum + (original * (item.quantity || 1));
  }, 0);
  const totalDiscount = totalMRP - subtotal;
  const platformFee = cart.length > 0 ? 19 : 0;
  const grandTotal = subtotal + platformFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center max-w-md w-full space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto">
            <ShoppingBag size={32} />
          </div>
          <h2 className="text-xl font-black text-white">Your Cart is Empty</h2>
          <p className="text-xs text-slate-400">Looks like you haven't added anything to your cart yet.</p>
          <button 
            onClick={() => navigate('/')} 
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer"
          >
            Explore Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              Shopping Cart <span className="text-xs font-semibold bg-indigo-950 text-indigo-400 border border-indigo-800/50 px-2 py-0.5 rounded-full">{cart.length} items</span>
            </h1>
            <p className="text-xs text-slate-400">Review your selected products and checkout</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1 cursor-pointer"
          >
            Continue Shopping <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            
            {cart.map((item, index) => {
              const itemId = item._id || item.id || index;
              const currentQty = item.quantity || 1;
              const originalPrice = item.originalPrice || Math.round(Number(item.price) * 1.5);
              const discountPercent = Math.round(((originalPrice - item.price) / originalPrice) * 100);

              return (
                <div key={itemId} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-lg">
                  <div className="flex gap-4 sm:gap-6">
                    
                    {/* Item Image */}
                    <div className="w-24 h-24 bg-slate-950 border border-slate-800 rounded-2xl p-2 flex items-center justify-center flex-shrink-0">
                      <img 
                        src={item.image || item.imageUrl || 'https://via.placeholder.com/150'} 
                        alt={item.title || item.name} 
                        className="max-h-full max-w-full object-contain rounded-lg"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 space-y-1.5">
                      <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1 hover:text-indigo-400 transition cursor-pointer">
                        {item.title || item.name}
                      </h3>
                      <p className="text-xs text-slate-500">Standard Retail Pack</p>

                      {/* Pricing */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-base sm:text-lg font-black text-white">₹{item.price}</span>
                        <span className="text-xs text-slate-500 line-through">₹{originalPrice}</span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded-md">
                          {discountPercent}% OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Quantity Counter */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
                    
                    {/* Reliable + / - Quantity Controls */}
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
                      <span className="text-slate-400 font-medium mr-1">Qty:</span>
                      <button
                        onClick={() => handleQuantityChange(itemId, currentQty, -1)}
                        className="w-6 h-6 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-lg flex items-center justify-center text-white transition cursor-pointer disabled:opacity-40"
                        disabled={currentQty <= 1}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-mono font-bold text-white px-2 text-sm">{currentQty}</span>
                      <button
                        onClick={() => handleQuantityChange(itemId, currentQty, 1)}
                        className="w-6 h-6 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-lg flex items-center justify-center text-white transition cursor-pointer"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-4 text-slate-400 font-semibold">
                      <button className="flex items-center gap-1.5 hover:text-indigo-400 transition cursor-pointer">
                        <Bookmark size={14} /> Save for later
                      </button>
                      <button 
                        onClick={() => removeFromCart && removeFromCart(itemId)}
                        className="flex items-center gap-1.5 hover:text-red-400 transition cursor-pointer"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                      <button 
                        onClick={() => navigate('/checkout')}
                        className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                      >
                        <Zap size={14} /> Buy Now
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}

          </div>

          {/* RIGHT: Modern Dark Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 sticky top-6 shadow-xl">
              <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Price Details</h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Total MRP</span>
                  <span className="text-slate-200">₹{totalMRP.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span>- ₹{totalDiscount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Platform Fee</span>
                  <span className="text-slate-200">₹{platformFee}</span>
                </div>

                <div className="border-t border-slate-800 pt-3 flex justify-between font-extrabold text-sm text-white">
                  <span>Total Amount</span>
                  <span className="text-indigo-400">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Savings Badge */}
              <div className="bg-emerald-950/40 border border-emerald-800/50 p-3 rounded-2xl text-center text-xs font-semibold text-emerald-400">
                You'll save ₹{totalDiscount.toLocaleString()} on this order!
              </div>

              {/* Security info */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <ShieldCheck size={20} className="text-emerald-400 flex-shrink-0" />
                <span>Safe & Secure Payments. 100% Authentic Products.</span>
              </div>

              {/* Place Order CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl text-xs transition cursor-pointer shadow-lg shadow-indigo-600/20"
              >
                Proceed to Checkout (₹{grandTotal.toLocaleString()})
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
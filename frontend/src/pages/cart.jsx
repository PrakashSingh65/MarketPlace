import React from 'react';
import { ShieldCheck, Trash2, Bookmark, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart = [], removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  // Price Calculations
  const totalMRP = cart.reduce((sum, item) => sum + ((item.originalPrice || item.price * 1.5) * (item.quantity || 1)), 0);
  const totalDiscount = cart.reduce((sum, item) => sum + (((item.originalPrice || item.price * 1.5) - item.price) * (item.quantity || 1)), 0);
  const platformFee = cart.length > 0 ? 19 : 0;
  const totalAmount = Math.max(0, totalMRP - totalDiscount + platformFee);

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-sm shadow-sm text-center max-w-md w-full">
          <img src="https://uk.store.asus.com/media/cart/empty-cart.png" alt="Empty Cart" className="w-40 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-800">Your cart is empty!</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">Explore our wide range of products and add items to your cart.</p>
          <button 
            onClick={() => navigate('/')} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2.5 rounded-sm text-sm shadow-sm transition cursor-pointer"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f2f4] py-4 px-2 sm:px-6 lg:px-12 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN: Cart Items List */}
        <div className="lg:col-span-8 space-y-3">
          
          {/* Address / Pincode Bar */}
          <div className="bg-white p-4 rounded-sm shadow-sm flex items-center justify-between border border-slate-200">
            <div className="text-sm">
              <span className="text-slate-600">From Saved Addresses</span>
            </div>
            <button className="text-blue-600 border border-slate-300 px-4 py-1.5 rounded-sm text-xs font-bold hover:bg-blue-50 transition cursor-pointer">
              Enter Delivery Pincode
            </button>
          </div>

          {/* Cart Item Cards */}
          <div className="bg-white rounded-sm shadow-sm border border-slate-200 divide-y divide-slate-100">
            {cart.map((item, index) => {
              const originalPrice = item.originalPrice || Math.round(item.price * 1.5);
              const discountPercent = Math.round(((originalPrice - item.price) / originalPrice) * 100);

              return (
                <div key={item._id || item.id || index} className="p-4 sm:p-6 space-y-4">
                  <div className="flex gap-4 sm:gap-6">
                    
                    {/* Item Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 flex items-center justify-center border border-slate-100 p-1">
                      <img 
                        src={item.image || item.imageUrl || 'https://via.placeholder.com/150'} 
                        alt={item.title || item.name} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 space-y-1.5">
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-1 hover:text-blue-600 cursor-pointer">
                        {item.title || item.name}
                      </h3>
                      <p className="text-xs text-slate-500">100 g / Standard Pack</p>

                      {/* Pricing Section */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                          ↓{discountPercent}%
                        </span>
                        <span className="text-xs text-slate-400 line-through">₹{originalPrice}</span>
                        <span className="text-base sm:text-lg font-bold text-slate-900">₹{item.price}</span>
                      </div>

                      <p className="text-[11px] text-slate-500 pt-1">
                        Delivery by <span className="font-semibold text-slate-700">Aug 23, Sun</span>
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-50 text-xs text-slate-600">
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Qty:</span>
                      <select
                        value={item.quantity || 1}
                        onChange={(e) => updateQuantity && updateQuantity(item._id || item.id, Number(e.target.value))}
                        className="border border-slate-300 rounded-sm px-2 py-1 bg-white text-xs font-semibold focus:outline-none focus:border-blue-600"
                      >
                        {[1, 2, 3, 4, 5].map((q) => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                      </select>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-4 sm:gap-6 font-semibold uppercase text-[12px]">
                      <button className="flex items-center gap-1.5 hover:text-blue-600 transition cursor-pointer">
                        <Bookmark size={14} /> Save for later
                      </button>
                      <button 
                        onClick={() => removeFromCart && removeFromCart(item._id || item.id)}
                        className="flex items-center gap-1.5 hover:text-red-600 transition cursor-pointer"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                      <button 
                        onClick={() => navigate('/checkout')}
                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition cursor-pointer"
                      >
                        <Zap size={14} /> Buy this now
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: Sticky Price Details Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-sm shadow-sm border border-slate-200 sticky top-4">
            
            <h2 className="text-sm font-bold text-slate-500 uppercase px-6 py-4 border-b border-slate-100">
              Price Details
            </h2>

            <div className="p-6 space-y-4 text-sm">
              <div className="flex justify-between text-slate-700">
                <span>MRP (incl. of all taxes)</span>
                <span>₹{totalMRP.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-slate-700">
                <span>Fees</span>
                <span>₹{platformFee}</span>
              </div>

              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discounts</span>
                <span>- ₹{totalDiscount.toLocaleString()}</span>
              </div>

              <div className="border-t border-dashed border-slate-200 pt-4 flex justify-between font-bold text-base text-slate-900">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>

              {/* Green Savings Alert Box */}
              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-sm text-center text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1.5">
                <span>%</span>
                <span>You'll save ₹{totalDiscount.toLocaleString()} on this order!</span>
              </div>
            </div>

            {/* Bottom Security Badge */}
            <div className="border-t border-slate-100 p-4 bg-slate-50 text-xs text-slate-500 flex items-center gap-3">
              <ShieldCheck size={28} className="text-slate-400 flex-shrink-0" />
              <span>Safe and secure payments. Easy returns. 100% Authentic products.</span>
            </div>

            {/* Sticky Place Order Bar */}
            <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-white">
              <div>
                <span className="text-[10px] text-slate-400 line-through block">₹{totalMRP.toLocaleString()}</span>
                <span className="text-base font-bold text-slate-900">₹{totalAmount.toLocaleString()}</span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="bg-[#fb641b] hover:bg-[#e05512] text-white font-bold px-8 py-3 rounded-sm text-sm shadow transition cursor-pointer uppercase"
              >
                Place Order
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
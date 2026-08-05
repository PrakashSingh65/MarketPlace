import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ArrowRight, ShieldCheck, Tag 
} from 'lucide-react';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, totalItems } = useContext(CartContext);
  const navigate = useNavigate();

  // Price & Order Calculations
  const taxRate = 0.05; // 5% GST on Textiles
  const estimatedTax = subtotal * taxRate;
  const shippingFee = subtotal > 10000 || subtotal === 0 ? 0 : 500; // Bulk order free shipping threshold
  const grandTotal = subtotal + estimatedTax + shippingFee;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h2>
        <p className="text-slate-400 text-xs mb-6 text-center max-w-sm">
          Looks like you haven't added any fabrics or materials to your cart yet.
        </p>
        <Link
          to="/"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-2xl text-xs transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <ArrowLeft size={16} /> Explore Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2 transition">
              <ArrowLeft size={14} /> Continue Sourcing
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Shopping Cart</h1>
          </div>
          <span className="text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3.5 py-1.5 rounded-full">
            {totalItems} {totalItems === 1 ? 'Item' : 'Items'} Selected
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 1. Products List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const itemId = item._id || item.id;
              return (
                <div
                  key={itemId}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:border-slate-700"
                >
                  {/* Product Details */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300'}
                      alt={item.title || item.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-800 bg-slate-950 flex-shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-0.5">
                        {item.category || 'Fabric Material'}
                      </span>
                      <h3 className="text-sm font-bold text-white line-clamp-1">{item.title || item.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        ₹{item.price ? Number(item.price).toLocaleString('en-IN') : '0'} <span className="text-[10px] text-slate-500">/ meter</span>
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                    
                    {/* Counter Buttons */}
                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(itemId, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(itemId, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Total Price for this Item */}
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-white block">
                        ₹{((Number(item.price) || 0) * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(itemId)}
                      className="text-slate-500 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-red-500/10"
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2. Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-24">
              <h2 className="text-lg font-bold text-white pb-4 border-b border-slate-800 flex items-center gap-2">
                <Tag size={18} className="text-indigo-400" /> Order Summary
              </h2>

              <div className="py-4 space-y-3 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="text-slate-200 font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Estimated Tax (5% GST)</span>
                  <span className="text-slate-200 font-semibold">₹{estimatedTax.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Logistics & Delivery</span>
                  <span className={shippingFee === 0 ? "text-emerald-400 font-semibold" : "text-slate-200 font-semibold"}>
                    {shippingFee === 0 ? 'FREE (Bulk Discount)' : `₹${shippingFee.toLocaleString('en-IN')}`}
                  </span>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="pt-4 border-t border-slate-800 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Grand Total</span>
                  <span className="text-xl font-black text-indigo-400">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Inclusive of all taxes and verified supplier dispatch.</p>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => alert('Proceeding to Checkout Flow...')}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-2xl text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>B2B Buyer Protection & Verified Escrow Guarantee</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
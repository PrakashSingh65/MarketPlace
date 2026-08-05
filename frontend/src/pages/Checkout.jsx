import { useState, useContext } from 'react';
import { CartContext } from '../context/cartContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState({ name: '', phone: '', city: '', street: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const estimatedTax = subtotal * 0.05;
  const grandTotal = subtotal + estimatedTax;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setOrderPlaced(true);
      clearCart();
    }, 1500);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h2>
        <p className="text-slate-400 text-xs mb-6 text-center max-w-sm">
          Aapka order successfully place ho chuka hai. Supplier dispatch ki process shuru kar rahe hain.
        </p>
        <Link to="/" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/cart" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white">
          <ArrowLeft size={14} /> Back to Cart
        </Link>

        <h1 className="text-2xl font-black">Checkout & Delivery Details</h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 text-xs">
            <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2">1. Delivery Address</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input required type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" 
                  value={address.name} onChange={e => setAddress({...address, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Phone Number</label>
                <input required type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" 
                  value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Street / Warehouse Address</label>
              <input required type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" 
                value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">City</label>
                <input required type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" 
                  value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">PIN Code</label>
                <input required type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" 
                  value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
              </div>
            </div>

            <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2 pt-4">2. Payment Method</h2>
            <div className="space-y-2">
              {['UPI / Online', 'Cash on Delivery (COD)'].map((method) => (
                <label key={method} className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
                  <input type="radio" name="payment" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                  <span className="font-semibold">{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl h-fit space-y-4">
            <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Order Summary</h2>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between"><span>GST (5%)</span><span>₹{estimatedTax}</span></div>
              <div className="flex justify-between font-bold text-white pt-2 border-t border-slate-800">
                <span>Grand Total</span><span className="text-indigo-400 text-sm">₹{grandTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-indigo-600/30"
            >
              {isProcessing ? 'Processing Order...' : 'Confirm & Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
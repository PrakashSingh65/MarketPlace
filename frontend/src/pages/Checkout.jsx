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

  // 🟢 Real Backend Order Placement Integration
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const orderPayload = {
        items: cartItems.map(item => ({
          product: item._id || item.id,
          title: item.title || item.name,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress: address,
        paymentMethod,
        totalAmount: grandTotal
      };

      const res = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        setOrderPlaced(true);
        clearCart();
      } else {
        alert('Order placement failed. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Network error while placing order.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h2>
        <p className="text-slate-400 text-xs mb-6 text-center max-w-sm">
          Aapka order successfully place ho kar database me save ho chuka hai. Supplier dispatch process shuru kar rahe hain.
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
                <input required type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500" 
                  value={address.name} onChange={e => setAddress({...address, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Phone Number</label>
                <input required type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500" 
                  value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Street / Warehouse Address</label>
              <input required type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500" 
                value={address.street} onChange={e => setAddress({...address, street: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">City</label>
                <input required type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500" 
                  value={address.city} onChange={e => setAddress({...address, city: e.target.value})} />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">PIN Code</label>
                <input required type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500" 
                  value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} />
              </div>
            </div>

            <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2 pt-4">2. Payment Method</h2>
            <div className="space-y-2">
              {['UPI / Online', 'Cash on Delivery (COD)'].map((method) => (
                <label key={method} className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-indigo-500/50 transition">
                  <input type="radio" name="payment" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                  <span className="font-semibold text-slate-200">{method}</span>
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
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {isProcessing ? 'Saving to Database...' : 'Confirm & Place Order'}
            </button>
            
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 pt-1">
              <ShieldCheck size={12} className="text-emerald-400" /> Safe & Encrypted Checkout
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
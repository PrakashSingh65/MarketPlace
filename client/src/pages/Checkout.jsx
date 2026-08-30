import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CreditCard, QrCode, Banknote, CheckCircle, ArrowLeft, Lock, Edit2, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import useCart from '../hooks/useCart';
import { useCreateOrder } from '../api/orderApi';
import { useCreateRazorpayOrder, useVerifyPayment, useGetRazorpayKey } from '../api/paymentApi';
import { openRazorpayCheckout } from '../utils/razorpay';
import { setShippingAddress as setReduxShippingAddress } from '../redux/slice/orderSlice';
import { setPaymentMethod as setReduxPaymentMethod, setPaymentStatus } from '../redux/slice/paymentSlice';

export default function Checkout({ onOrderPlaced }) {
  const dispatch = useDispatch();
  const { cart, clearCart } = useCart();
  const user = useSelector((state) => state.auth?.user);
  const reduxShipping = useSelector((state) => state.order?.shippingAddress);
  const reduxPaymentMethod = useSelector((state) => state.payment?.paymentMethod);

  const [shippingAddress, setShippingAddress] = useState({
    name: reduxShipping?.name || user?.name || '',
    phone: reduxShipping?.phone || user?.phone || '',
    address: reduxShipping?.address || reduxShipping?.street || '',
    city: reduxShipping?.city || '',
    pincode: reduxShipping?.pincode || ''
  });

  const [paymentMethod, setPaymentMethod] = useState(reduxPaymentMethod || 'Razorpay');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const [upiId, setUpiId] = useState('prakash@upi');
  const merchantName = 'OnestoLabs B2B';

  const { data: keyData } = useGetRazorpayKey();
  const createOrderMutation = useCreateOrder();
  const createRazorpayOrderMutation = useCreateRazorpayOrder();
  const verifyPaymentMutation = useVerifyPayment();

  useEffect(() => {
    dispatch(setReduxShippingAddress(shippingAddress));
  }, [shippingAddress, dispatch]);

  useEffect(() => {
    dispatch(setReduxPaymentMethod(paymentMethod));
  }, [paymentMethod, dispatch]);

  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
  const tax = Math.round(subtotal * 0.05);
  const shippingFee = subtotal > 2000 ? 0 : 150;
  const grandTotal = subtotal + tax + shippingFee;

  const upiPayUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName)}&am=${grandTotal}&cu=INR`;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!cart || cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setLoading(true);

    const orderPayload = {
      items: cart.map(item => ({
        product: item._id || item.id,
        title: item.title || item.name,
        quantity: item.quantity || 1,
        price: item.price,
        image: item.image || item.images?.[0]
      })),
      shippingAddress: {
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        street: shippingAddress.address,
        address: shippingAddress.address,
        city: shippingAddress.city,
        pincode: shippingAddress.pincode
      },
      userId: user?._id,
      totalAmount: grandTotal
    };

    try {
      if (paymentMethod === 'cod' || paymentMethod === 'COD') {
        // Cash on Delivery Order Flow
        const response = await createOrderMutation.mutateAsync({
          ...orderPayload,
          paymentMethod: 'COD',
          paymentStatus: 'Pending'
        });

        if (response.success || response.order) {
          setPlacedOrder(response.order);
          setOrderSuccess(true);
          dispatch(setPaymentStatus('Pending'));
          if (clearCart) clearCart();
          if (onOrderPlaced) onOrderPlaced();
        }
      } else {
        // Online Payment Flow via Razorpay
        const razorpayOrderRes = await createRazorpayOrderMutation.mutateAsync({
          amount: grandTotal,
          currency: 'INR',
          orderId: `OD_${Date.now()}`
        });

        if (!razorpayOrderRes || (!razorpayOrderRes.orderId && !razorpayOrderRes.id)) {
          throw new Error(razorpayOrderRes?.message || 'Failed to create Razorpay payment order');
        }

        const razorpayKeyId = razorpayOrderRes.keyId || keyData?.keyId;
        const rzpOrderId = razorpayOrderRes.orderId || razorpayOrderRes.id;

        const razorpayOpened = await openRazorpayCheckout({
          keyId: razorpayKeyId,
          orderId: rzpOrderId,
          amount: razorpayOrderRes.amount || Math.round(grandTotal * 100),
          currency: razorpayOrderRes.currency || 'INR',
          name: 'MarketPlace B2B',
          description: `Order Payment (Total: ₹${grandTotal})`,
          prefill: {
            name: shippingAddress.name,
            email: user?.email || '',
            phone: shippingAddress.phone
          },
          onSuccess: async (rzpResponse) => {
            try {
              // 1. Verify Payment Signature on backend
              const verifyRes = await verifyPaymentMutation.mutateAsync({
                razorpay_order_id: rzpResponse.razorpay_order_id,
                razorpay_payment_id: rzpResponse.razorpay_payment_id,
                razorpay_signature: rzpResponse.razorpay_signature
              });

              // 2. Create Order on backend with Paid status
              const orderRes = await createOrderMutation.mutateAsync({
                ...orderPayload,
                paymentMethod: 'Razorpay',
                paymentStatus: 'Paid',
                razorpayOrderId: rzpResponse.razorpay_order_id,
                razorpayPaymentId: rzpResponse.razorpay_payment_id
              });

              setPlacedOrder(orderRes.order || verifyRes.order);
              setOrderSuccess(true);
              dispatch(setPaymentStatus('Paid'));
              if (clearCart) clearCart();
              if (onOrderPlaced) onOrderPlaced();
            } catch (err) {
              console.error('Payment verification/order error:', err);
              alert(err.message || 'Payment verification failed');
            } finally {
              setLoading(false);
            }
          },
          onDismiss: () => {
            setLoading(false);
          }
        });

        if (!razorpayOpened) {
          setLoading(false);
        }
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert(err.message || 'An error occurred during checkout.');
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle size={36} />
          </div>
          <h2 className="text-xl font-black text-white">Order Placed Successfully!</h2>
          <p className="text-xs text-slate-400">
            Order ID: <span className="text-indigo-400 font-mono font-bold">{placedOrder?.orderId || placedOrder?._id || 'Registered'}</span>
          </p>
          <p className="text-xs text-slate-400">
            Payment Method: <span className="text-emerald-400 uppercase font-bold">{paymentMethod}</span>
          </p>
          <button
            onClick={() => window.location.href = placedOrder?._id ? `/order/${placedOrder._id}` : '/my-orders'}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer"
          >
            Track Order Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()} className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white cursor-pointer">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <Lock size={18} className="text-emerald-400" /> Secure Checkout
            </h1>
            <p className="text-xs text-slate-400">Complete your B2B order & select payment gateway</p>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: Shipping Details & Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Shipping Address */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">1. Delivery Address</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Full Name / Company Name"
                  value={shippingAddress.name}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <input
                type="text"
                required
                placeholder="Complete Address (Street, Building, Landmark)"
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="text"
                  required
                  placeholder="Pincode"
                  value={shippingAddress.pincode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* 2. Payment Gateway Selection */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">2. Select Payment Gateway</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Razorpay / UPI Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Razorpay')}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-3 cursor-pointer ${
                    paymentMethod === 'Razorpay'
                      ? 'bg-indigo-950/40 border-indigo-500 text-white ring-2 ring-indigo-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <QrCode size={20} className={paymentMethod === 'Razorpay' ? 'text-indigo-400' : 'text-slate-500'} />
                  <div>
                    <p className="text-xs font-bold text-white">Razorpay Online</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">UPI, GPay, Cards, NetBanking</p>
                  </div>
                </button>

                {/* Card Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-3 cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-indigo-950/40 border-indigo-500 text-white ring-2 ring-indigo-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <CreditCard size={20} className={paymentMethod === 'card' ? 'text-indigo-400' : 'text-slate-500'} />
                  <div>
                    <p className="text-xs font-bold text-white">Credit / Debit Card</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Via Razorpay Gateway</p>
                  </div>
                </button>

                {/* COD Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-3 cursor-pointer ${
                    paymentMethod === 'cod' || paymentMethod === 'COD'
                      ? 'bg-indigo-950/40 border-indigo-500 text-white ring-2 ring-indigo-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Banknote size={20} className={paymentMethod === 'cod' || paymentMethod === 'COD' ? 'text-indigo-400' : 'text-slate-500'} />
                  <div>
                    <p className="text-xs font-bold text-white">Cash on Delivery</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Pay upon shipment</p>
                  </div>
                </button>

              </div>

              {/* UPI Direct QR Code Simulation */}
              {paymentMethod === 'Razorpay' && (
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl text-xs space-y-4">
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-2">
                    <Edit2 size={14} className="text-indigo-400 shrink-0" />
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Enter Bank UPI ID (e.g. 9876543210@ybl)"
                      className="w-full bg-transparent text-white text-xs focus:outline-none font-mono"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="bg-white p-2.5 rounded-2xl border border-slate-700 shadow-lg shrink-0">
                      <QRCodeSVG value={upiPayUrl} size={120} />
                    </div>

                    <div className="space-y-2 text-center sm:text-left">
                      <p className="text-indigo-400 font-bold">Instant Online Checkout</p>
                      <p className="text-slate-200 text-[11px] font-semibold">
                        Payee Name: <span className="text-emerald-400">{merchantName}</span>
                      </p>
                      <p className="text-slate-500 text-[10px]">
                        Click "Pay & Place Order" below to open the official Razorpay payment portal.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* RIGHT: Order Summary */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Order Summary</h2>

              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <p className="text-xs text-slate-500">Cart is empty.</p>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div>
                        <p className="text-slate-200 font-semibold truncate max-w-37.5">{item.title || item.name}</p>
                        <p className="text-[10px] text-slate-500">Qty: {item.quantity || 1}</p>
                      </div>
                      <span className="font-bold text-white">₹{Number(item.price) * (item.quantity || 1)}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-slate-800 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-slate-200">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST (5%)</span>
                  <span className="text-slate-200">₹{tax}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping Fee</span>
                  <span className="text-slate-200">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-white font-extrabold text-sm border-t border-slate-800 pt-2">
                  <span>Grand Total</span>
                  <span className="text-indigo-400">₹{grandTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-xs transition disabled:opacity-50 mt-2 cursor-pointer"
              >
                {loading ? 'Processing Order...' : `Pay & Place Order (₹${grandTotal})`}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
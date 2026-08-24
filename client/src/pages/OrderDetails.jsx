import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  CheckCircle2, Circle, ArrowLeft, Download, MessageSquare, 
  XCircle, Share2, ChevronRight, Copy, CreditCard, Loader2, AlertCircle
} from 'lucide-react';

export default function OrderDetails() {
  const navigate = useNavigate();
  const { orderId = 'OD438380571732119100' } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // 1. Fetch Live Order Details from Backend API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Adjust your API base URL if needed
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to fetch order details');
        }

        setOrder(data.order);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // 2. Copy Order ID
  const handleCopyOrderId = () => {
    if (order?.orderId || order?._id) {
      navigator.clipboard.writeText(order.orderId || order._id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 3. Download Invoice
  const handleDownloadInvoice = () => {
    alert(`Downloading Invoice for Order #${order?.orderId || order?._id}`);
  };

  // 4. Cancel Order via API
  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancelling(true);
      const targetId = order?.orderId || order?._id;
      const response = await fetch(`http://localhost:5000/api/orders/cancel/${targetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Order cancel nahi ho saka');
      }

      setOrder((prev) => ({
        ...prev,
        status: 'Cancelled'
      }));
      alert('Order cancelled successfully.');
    } catch (err) {
      alert(err.message || 'Error cancelling order');
    } finally {
      setCancelling(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
        <Loader2 size={36} className="animate-spin text-indigo-500 mb-3" />
        <p className="text-xs text-slate-400 font-semibold">Fetching live order details...</p>
      </div>
    );
  }

  // Error State
  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 space-y-4">
        <AlertCircle size={40} className="text-rose-500" />
        <h2 className="text-base font-bold text-white">Order Details Not Found</h2>
        <p className="text-xs text-slate-400 max-w-sm text-center">{error || 'Order detail load nahi ho saki.'}</p>
        <button
          onClick={() => navigate('/orders')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
        >
          Go to My Orders
        </button>
      </div>
    );
  }

  const isCancelled = order.status === 'Cancelled';
  const displayOrderId = order.orderId || order._id;

  // Address String Formatter
  const formattedAddress = typeof order.shippingAddress === 'string'
    ? order.shippingAddress
    : order.shippingAddress
      ? `${order.shippingAddress.name || ''}, ${order.shippingAddress.street || ''}, ${order.shippingAddress.city || ''} - ${order.shippingAddress.pincode || ''} (Ph: ${order.shippingAddress.phone || ''})`
      : 'Address not available';

  // Fallback timeline generator if backend timeline is empty
  const defaultTimeline = [
    { title: 'Order Confirmed', date: new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), completed: true },
    { title: 'Shipped', date: 'In Progress', completed: ['Shipped', 'Out For Delivery', 'Delivered'].includes(order.status) },
    { title: 'Out For Delivery', date: 'Expected Soon', completed: ['Out For Delivery', 'Delivered'].includes(order.status) },
    { title: 'Delivery', date: 'Pending', completed: order.status === 'Delivered' }
  ];

  const timelineSteps = order.timeline && order.timeline.length > 0 ? order.timeline : defaultTimeline;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold transition cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to My Orders
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Order ID: <strong className="text-white font-mono">{displayOrderId}</strong></span>
            <button onClick={handleCopyOrderId} className="hover:text-indigo-400 transition cursor-pointer">
              <Copy size={14} />
            </button>
            {copied && <span className="text-emerald-400 text-[10px] bg-emerald-950 px-2 py-0.5 rounded">Copied!</span>}
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN: Items, Tracking & Actions */}
          <div className="lg:col-span-8 space-y-6">

            {/* Pay Online Banner */}
            {!isCancelled && order.paymentMethod?.toUpperCase() === 'COD' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-xs text-slate-300">Pay online for a smooth doorstep experience</span>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer">
                  Pay ₹{order.totalAmount}
                </button>
              </div>
            )}

            {/* Product Details List */}
            <div className="space-y-3">
              {order.items && order.items.map((item, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex gap-4 sm:gap-6 shadow-xl">
                  <div className="w-24 h-24 bg-slate-950 border border-slate-800 rounded-2xl p-2 flex items-center justify-center flex-shrink-0">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800'} 
                      alt={item.title} 
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h2 className="text-sm sm:text-base font-bold text-white leading-snug">{item.title}</h2>
                    <p className="text-xs text-slate-500">Seller: <span className="text-slate-400">{item.seller || 'OnestoLabs'}</span></p>
                    <p className="text-xs text-slate-400">Qty: {item.quantity || 1}</p>
                    <div className="text-lg font-black text-white pt-1">₹{item.price}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Tracking Steps */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Order Status</h3>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  isCancelled ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  {order.status || 'Processing'}
                </span>
              </div>
              
              {!isCancelled ? (
                <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
                  {timelineSteps.map((step, idx) => {
                    const isDone = step.completed;
                    return (
                      <div key={idx} className="relative flex items-start gap-4">
                        {/* Status Icon Indicator */}
                        <div className={`absolute -left-[31px] bg-slate-900 rounded-full p-0.5 ${isDone ? 'text-emerald-400' : 'text-slate-600'}`}>
                          {isDone ? <CheckCircle2 size={20} className="fill-emerald-950" /> : <Circle size={20} />}
                        </div>

                        {/* Step Details */}
                        <div className={`space-y-1 ${isDone ? 'text-white' : 'text-slate-500'}`}>
                          <div className="text-xs font-bold">
                            {step.title}
                            {step.date && <span className="font-normal text-slate-400">, {step.date}</span>}
                          </div>
                          {step.description && (
                            <div className="text-xs bg-slate-950 border border-slate-800 text-slate-300 p-2.5 rounded-xl mt-1">
                              {step.description}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-rose-950/30 border border-rose-900/50 p-4 rounded-2xl text-xs text-rose-300">
                  This order was cancelled. If you need further assistance, please contact customer support.
                </div>
              )}

              {/* Action Buttons: Cancel & Chat */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                <button 
                  onClick={handleCancelOrder}
                  disabled={isCancelled || cancelling || order.status === 'Delivered'}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-800 hover:bg-slate-800/80 text-xs font-bold text-slate-300 hover:text-red-400 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle size={15} /> {isCancelled ? 'Order Cancelled' : cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-800 hover:bg-slate-800/80 text-xs font-bold text-slate-300 hover:text-indigo-400 transition cursor-pointer">
                  <MessageSquare size={15} /> Chat with us
                </button>
              </div>
            </div>

            {/* Extra Options */}
            <div className="space-y-3">
              <button className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 p-4 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-200 transition cursor-pointer">
                <span>Rate your experience</span>
                <ChevronRight size={16} className="text-slate-500" />
              </button>
              <button className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 p-4 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-200 transition cursor-pointer">
                <span className="flex items-center gap-2"><Share2 size={16} className="text-indigo-400" /> Send Order Details</span>
                <ChevronRight size={16} className="text-slate-500" />
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Delivery & Price Details */}
          <div className="lg:col-span-4 space-y-6">

            {/* Delivery Address */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-xl">
              <h3 className="text-xs font-bold text-white border-b border-slate-800 pb-2">Delivery details</h3>
              <p className="text-xs text-slate-400 pt-1 leading-relaxed">
                Delivering to <strong className="text-slate-200">{formattedAddress}</strong>
              </p>
            </div>

            {/* Price Details */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold text-white border-b border-slate-800 pb-3">Price details</h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Listing price</span>
                  <span className="text-slate-200">₹{order.pricing?.listingPrice || order.totalAmount}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Special discount</span>
                  <span>-₹{order.pricing?.totalDiscount || 0}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Platform / Delivery Fee</span>
                  <span className="text-slate-200">₹{order.pricing?.totalPlatformFee || 19}</span>
                </div>
                <div className="border-t border-slate-800 pt-3 flex justify-between font-extrabold text-sm text-white">
                  <span>Total amount</span>
                  <span className="text-indigo-400">₹{order.totalAmount}</span>
                </div>
              </div>

              {/* Paid By info */}
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex items-center justify-between text-xs">
                <span className="text-slate-400">Payment Method</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <CreditCard size={14} className="text-indigo-400" /> {order.paymentMethod || 'COD'}
                </span>
              </div>

              {/* Download Invoice Button */}
              <button 
                onClick={handleDownloadInvoice}
                className="w-full border border-indigo-500/30 hover:border-indigo-500 bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 font-bold py-3 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Download size={15} /> Download Invoice
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
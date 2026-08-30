import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  CheckCircle2, Circle, ArrowLeft, Download, MessageSquare, 
  XCircle, Share2, ChevronRight, Copy, CreditCard, Loader2, AlertCircle
} from 'lucide-react';
import { useGetOrderById, useCancelOrder } from '../api/orderApi';
import { useCreateRazorpayOrder, useVerifyPayment, useGetRazorpayKey } from '../api/paymentApi';
import { openRazorpayCheckout } from '../utils/razorpay';

export default function OrderDetails() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const user = useSelector((state) => state.auth?.user);

  const [copied, setCopied] = useState(false);
  const [paying, setPaying] = useState(false);

  const { data: orderData, isLoading, isError, error, refetch } = useGetOrderById(orderId);
  const cancelOrderMutation = useCancelOrder();
  const { data: keyData } = useGetRazorpayKey();
  const createRazorpayOrderMutation = useCreateRazorpayOrder();
  const verifyPaymentMutation = useVerifyPayment();

  const order = orderData?.order || (orderData && !orderData.message ? orderData : null);

  const handleCopyOrderId = () => {
    if (order?.orderId || order?._id) {
      navigator.clipboard.writeText(order.orderId || order._id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadInvoice = () => {
    alert(`Downloading Invoice for Order #${order?.orderId || order?._id}`);
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const targetId = order?.orderId || order?._id || orderId;
      await cancelOrderMutation.mutateAsync(targetId);
      alert('Order cancelled successfully.');
      refetch();
    } catch (err) {
      alert(err.message || 'Error cancelling order');
    }
  };

  const handlePayOnline = async () => {
    if (!order) return;
    setPaying(true);

    try {
      const razorpayOrderRes = await createRazorpayOrderMutation.mutateAsync({
        amount: order.totalAmount,
        currency: 'INR',
        orderId: order._id || order.orderId
      });

      const razorpayKeyId = razorpayOrderRes.keyId || keyData?.keyId;
      const rzpOrderId = razorpayOrderRes.orderId || razorpayOrderRes.id;

      await openRazorpayCheckout({
        keyId: razorpayKeyId,
        orderId: rzpOrderId,
        amount: razorpayOrderRes.amount || Math.round(order.totalAmount * 100),
        currency: razorpayOrderRes.currency || 'INR',
        name: 'MarketPlace B2B',
        description: `Pay for Order #${order.orderId || order._id}`,
        prefill: {
          name: order.shippingAddress?.name || user?.name || '',
          email: user?.email || '',
          phone: order.shippingAddress?.phone || user?.phone || ''
        },
        onSuccess: async (rzpResponse) => {
          try {
            await verifyPaymentMutation.mutateAsync({
              razorpay_order_id: rzpResponse.razorpay_order_id,
              razorpay_payment_id: rzpResponse.razorpay_payment_id,
              razorpay_signature: rzpResponse.razorpay_signature,
              orderId: order._id || order.orderId
            });
            alert('Payment completed successfully!');
            refetch();
          } catch (err) {
            alert(err.message || 'Payment verification failed');
          } finally {
            setPaying(false);
          }
        },
        onDismiss: () => {
          setPaying(false);
        }
      });
    } catch (err) {
      console.error('Pay online error:', err);
      alert(err.message || 'Error initiating payment');
      setPaying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
        <Loader2 size={36} className="animate-spin text-indigo-500 mb-3" />
        <p className="text-xs text-slate-400 font-semibold">Fetching live order details...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 space-y-4">
        <AlertCircle size={40} className="text-rose-500" />
        <h2 className="text-base font-bold text-white">Order Details Not Found</h2>
        <p className="text-xs text-slate-400 max-w-sm text-center">{error?.message || 'Could not load order details.'}</p>
        <button
          onClick={() => navigate('/my-orders')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
        >
          Go to My Orders
        </button>
      </div>
    );
  }

  const isCancelled = order.status === 'Cancelled';
  const isPaid = order.paymentStatus === 'Paid';
  const displayOrderId = order.orderId || order._id;

  const formattedAddress = typeof order.shippingAddress === 'string'
    ? order.shippingAddress
    : order.shippingAddress
      ? `${order.shippingAddress.name || ''}, ${order.shippingAddress.street || order.shippingAddress.address || ''}, ${order.shippingAddress.city || ''} - ${order.shippingAddress.pincode || ''} (Ph: ${order.shippingAddress.phone || ''})`
      : 'Address not available';

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
            {!isCancelled && !isPaid && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-200 font-semibold">Pay online for instant verification</p>
                  <p className="text-[10px] text-slate-400">Use Razorpay for UPI, Cards, NetBanking</p>
                </div>
                <button
                  onClick={handlePayOnline}
                  disabled={paying}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
                >
                  {paying ? 'Opening Razorpay...' : `Pay ₹${order.totalAmount}`}
                </button>
              </div>
            )}

            {/* Product Details List */}
            <div className="space-y-3">
              {order.items && order.items.map((item, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex gap-4 sm:gap-6 shadow-xl">
                  <div className="w-24 h-24 bg-slate-950 border border-slate-800 rounded-2xl p-2 flex items-center justify-center shrink-0">
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
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    isPaid ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    Payment: {order.paymentStatus || 'Pending'}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    isCancelled ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                  }`}>
                    {order.status || 'Order Confirmed'}
                  </span>
                </div>
              </div>
              
              {!isCancelled ? (
                <div className="relative pl-6 space-y-8 before:absolute before:left-2.75 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {timelineSteps.map((step, idx) => {
                    const isDone = step.completed;
                    return (
                      <div key={idx} className="relative flex items-start gap-4">
                        <div className={`absolute -left-7.75 bg-slate-900 rounded-full p-0.5 ${isDone ? 'text-emerald-400' : 'text-slate-600'}`}>
                          {isDone ? <CheckCircle2 size={20} className="fill-emerald-950" /> : <Circle size={20} />}
                        </div>

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
                  disabled={isCancelled || cancelOrderMutation.isPending || order.status === 'Delivered'}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-800 hover:bg-slate-800/80 text-xs font-bold text-slate-300 hover:text-red-400 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle size={15} /> {isCancelled ? 'Order Cancelled' : cancelOrderMutation.isPending ? 'Cancelling...' : 'Cancel Order'}
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
                  <CreditCard size={14} className="text-indigo-400" /> {order.paymentMethod || 'Razorpay'}
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
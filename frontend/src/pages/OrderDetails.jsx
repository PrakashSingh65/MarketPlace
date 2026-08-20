import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  CheckCircle2, Circle, ArrowLeft, Download, MessageSquare, 
  XCircle, Share2, ShieldCheck, ChevronRight, Copy, CreditCard
} from 'lucide-react';

export default function OrderDetails() {
  const navigate = useNavigate();
  const { orderId = 'OD438380571732119100' } = useParams();

  const [copied, setCopied] = useState(false);
  const [orderCancelled, setOrderCancelled] = useState(false);

  // Mock Order Data (Integrate with your API/Context)
  const order = {
    id: orderId,
    product: {
      title: 'BARE ANATOMY Anti Hair Fall Shampoo | 5x Hair Fall Control & Growth',
      seller: 'OnestoLabs',
      price: 265,
      listingPrice: 265,
      specialPrice: 249,
      totalFees: 16,
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800'
    },
    paymentMethod: 'Cash On Delivery',
    deliveryAddress: 'Karahiya, Ghazipur, Uttar Pradesh',
    currentStep: 1, // 0: Confirmed, 1: Shipped, 2: Out for Delivery, 3: Delivered
    timeline: [
      { title: 'Order Confirmed', date: 'Mon, Aug 17', status: 'completed' },
      { title: 'Shipped', date: 'Thu, Aug 20', description: 'Your item has arrived at a facility, Chanduli', status: 'completed' },
      { title: 'Out For Delivery', date: 'Expected Fri, Aug 21', status: 'pending' },
      { title: 'Delivery', date: 'Fri, Aug 21 By 11 PM', status: 'pending' }
    ]
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadInvoice = () => {
    alert(`Downloading Invoice for Order #${order.id}`);
  };

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setOrderCancelled(true);
    }
  };

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
            <span>Order ID: <strong className="text-white font-mono">{order.id}</strong></span>
            <button onClick={handleCopyOrderId} className="hover:text-indigo-400 transition cursor-pointer">
              <Copy size={14} />
            </button>
            {copied && <span className="text-emerald-400 text-[10px] bg-emerald-950 px-2 py-0.5 rounded">Copied!</span>}
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN: Item info, Tracking & Actions */}
          <div className="lg:col-span-8 space-y-6">

            {/* Pay Online Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <span className="text-xs text-slate-300">Pay online for a smooth doorstep experience</span>
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer">
                Pay ₹{order.product.price}
              </button>
            </div>

            {/* Product Details Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex gap-4 sm:gap-6 shadow-xl">
              <div className="w-24 h-24 bg-slate-950 border border-slate-800 rounded-2xl p-2 flex items-center justify-center flex-shrink-0">
                <img 
                  src={order.product.image} 
                  alt={order.product.title} 
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              </div>
              <div className="flex-1 space-y-1">
                <h2 className="text-sm sm:text-base font-bold text-white leading-snug">{order.product.title}</h2>
                <p className="text-xs text-slate-500">Seller: <span className="text-slate-400">{order.product.seller}</span></p>
                <div className="text-lg font-black text-white pt-1">₹{order.product.price}</div>
              </div>
            </div>

            {/* Order Tracking Steps */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Order Status</h3>
              
              <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
                {order.timeline.map((step, idx) => {
                  const isDone = idx <= order.currentStep && !orderCancelled;
                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Status Icon Indicator */}
                      <div className={`absolute -left-[31px] bg-slate-900 rounded-full p-0.5 ${isDone ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {isDone ? <CheckCircle2 size={20} className="fill-emerald-950" /> : <Circle size={20} />}
                      </div>

                      {/* Step Details */}
                      <div className={`space-y-1 ${isDone ? 'text-white' : 'text-slate-500'}`}>
                        <div className="text-xs font-bold">{step.title}, <span className="font-normal text-slate-400">{step.date}</span></div>
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

              {/* Action Buttons: Cancel & Chat */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                <button 
                  onClick={handleCancelOrder}
                  disabled={orderCancelled}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-800 hover:bg-slate-800/80 text-xs font-bold text-slate-300 hover:text-red-400 transition cursor-pointer disabled:opacity-50"
                >
                  <XCircle size={15} /> {orderCancelled ? 'Order Cancelled' : 'Cancel Order'}
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
              <p className="text-xs text-slate-400 pt-1">Delivering to <strong className="text-slate-200">{order.deliveryAddress}</strong></p>
            </div>

            {/* Price Details */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold text-white border-b border-slate-800 pb-3">Price details</h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Listing price</span>
                  <span className="text-slate-200">₹{order.product.listingPrice}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Special price</span>
                  <span>₹{order.product.specialPrice}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total fees</span>
                  <span className="text-slate-200">₹{order.product.totalFees}</span>
                </div>
                <div className="border-t border-slate-800 pt-3 flex justify-between font-extrabold text-sm text-white">
                  <span>Total amount</span>
                  <span className="text-indigo-400">₹{order.product.price}</span>
                </div>
              </div>

              {/* Paid By info */}
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex items-center justify-between text-xs">
                <span className="text-slate-400">Paid By</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <CreditCard size={14} className="text-indigo-400" /> {order.paymentMethod}
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
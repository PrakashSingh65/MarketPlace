import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck, ShoppingBag, MapPin, Box } from 'lucide-react';

export default function BuyerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchMyOrders();
    // Auto-refresh order status every 5 seconds for live tracking simulation
    const interval = setInterval(fetchMyOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMyOrders = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Status Stepper Helper Function
  const getStatusStep = (status) => {
    switch (status) {
      case 'Accepted': return 1;
      case 'Preparing': return 2;
      case 'Ready for Dispatch': return 3;
      case 'Completed': return 4;
      default: return 0; // Pending
    }
  };

  const steps = [
    { title: 'Pending', icon: Clock },
    { title: 'Accepted', icon: CheckCircle2 },
    { title: 'Preparing', icon: Box },
    { title: 'Ready for Dispatch', icon: Truck },
    { title: 'Completed', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-black">My Orders & Live Tracking</h1>
          <p className="text-xs text-slate-400 mt-1">Track your fabric orders in real-time as suppliers process them</p>
        </div>

        {loading ? (
          <div className="text-center py-10 text-xs text-slate-500">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-3">
            <ShoppingBag className="mx-auto text-slate-600" size={32} />
            <p className="text-xs text-slate-400">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStep = getStatusStep(order.status || 'Pending');

              return (
                <div key={order._id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
                  
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-4 text-xs">
                    <div>
                      <span className="font-bold text-white text-sm">Order #{order._id.slice(-6)}</span>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin size={12} /> Delivered to: <span className="text-slate-200">{order.shippingAddress?.address || 'N/A'}, {order.shippingAddress?.city}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-indigo-400 font-extrabold text-base">₹{order.totalAmount}</span>
                      <p className="text-[10px] text-slate-500">Auto-updating status</p>
                    </div>
                  </div>

                  {/* 🚚 LIVE TRACKING PROGRESS BAR */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-400">Fulfillment Status:</p>
                    <div className="grid grid-cols-5 gap-1 relative">
                      {steps.map((step, idx) => {
                        const Icon = step.icon;
                        const isPassed = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <div key={step.title} className="flex flex-col items-center text-center space-y-2">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                              isCurrent 
                                ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20 scale-110' 
                                : isPassed 
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-slate-950 text-slate-600 border border-slate-800'
                            }`}>
                              <Icon size={14} />
                            </div>
                            <span className={`text-[9px] font-semibold ${
                              isCurrent ? 'text-indigo-400' : isPassed ? 'text-slate-300' : 'text-slate-600'
                            }`}>
                              {step.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Purchased Items List */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                    <p className="text-[10px] font-bold text-slate-500">Items Ordered:</p>
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-slate-300">
                        <span>{item.title} (x{item.quantity}m)</span>
                        <span className="font-semibold text-slate-200">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { ShoppingBag, Package, Clock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export default function BuyerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${apiUrl}/api/orders/my-orders`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await res.json();
        // Safe mapping: Object ya direct array dono handle karega
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (err) {
        console.error('Error loading buyer orders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <ShoppingBag className="text-indigo-400" size={22} /> Buyer Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1">Track your placed orders and payment statuses</p>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-xl text-slate-300 transition"
          >
            <ArrowLeft size={14} /> Back to Shop
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl text-xs flex items-center gap-3">
            <AlertCircle size={18} />
            <span>Could not load live backend orders ({error}). Showing local order status.</span>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-300">Your Recent Orders ({orders.length})</h2>

          {orders.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 p-12 rounded-3xl text-center space-y-3">
              <Package size={40} className="mx-auto text-slate-600" />
              <p className="text-sm text-slate-400 font-medium">No orders found</p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map((order, index) => (
              <div key={order._id || index} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                
                <div className="flex flex-wrap justify-between items-center border-b border-slate-800 pb-3 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase">Order ID: #{order._id?.slice(-8) || `ORD-${index + 101}`}</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Placed on: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Just now'}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase">
                      {order.paymentMethod || 'UPI'}
                    </span>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                      order.status === 'Completed' || order.status === 'Delivered'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {order.status === 'Completed' ? <CheckCircle size={10} /> : <Clock size={10} />}
                      {order.status || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-xs">
                        <span className="text-slate-300">{item.title || item.product?.title || 'Product Item'} × {item.quantity || 1}</span>
                        <span className="text-slate-400 font-semibold">₹{Number(item.price || 0) * (item.quantity || 1)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500">Standard Marketplace Order</p>
                  )}
                </div>

                {/* Total */}
                <div className="border-t border-slate-800/80 pt-3 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total Amount</span>
                  <span className="text-indigo-400 font-extrabold text-sm">₹{order.totalAmount || 0}</span>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
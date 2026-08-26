import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Package, Clock, CheckCircle, 
  AlertCircle, ArrowLeft, RefreshCw, ChevronRight 
} from 'lucide-react';

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/orders/my-orders`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch orders (Status: ${res.status})`);
      }

      const data = await res.json();
      // Handle both raw array responses and `{ orders: [] }` wrapper objects
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      console.error('Error loading buyer orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 font-medium">Loading your order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 border border-slate-800 p-6 rounded-3xl gap-4 shadow-xl">
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2.5">
              <ShoppingBag className="text-indigo-400" size={22} /> Buyer Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1">Track your placed orders, invoices, and shipment status</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 px-3 py-2 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
            >
              <RefreshCw size={14} /> Refresh
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-xl text-slate-300 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Shop
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-950/40 border border-rose-800/60 text-rose-300 p-4 rounded-2xl text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertCircle size={18} className="text-rose-400 shrink-0" />
              <span>Could not load orders from server ({error}). Please check your API backend.</span>
            </div>
            <button 
              onClick={fetchOrders}
              className="bg-rose-900/50 hover:bg-rose-900 text-rose-200 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Orders List Container */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Your Orders ({orders.length})
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 p-12 rounded-3xl text-center space-y-4 shadow-xl">
              <Package size={44} className="mx-auto text-slate-600" />
              <div className="space-y-1">
                <p className="text-sm text-slate-300 font-bold">No orders found</p>
                <p className="text-xs text-slate-500">You haven't placed any orders yet.</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map((order, index) => {
              const orderId = order.orderId || order._id;
              const isDelivered = order.status === 'Completed' || order.status === 'Delivered';
              const isCancelled = order.status === 'Cancelled';

              return (
                <div key={order._id || index} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4 shadow-lg hover:border-slate-700 transition">
                  
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap justify-between items-center border-b border-slate-800/80 pb-3 gap-2">
                    <div>
                      <span className="text-[11px] text-indigo-400 font-mono font-bold">
                        Order ID: #{orderId ? orderId.slice(-8).toUpperCase() : `ORD-${index + 101}`}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Placed on: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : 'Recent'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-950 text-slate-300 border border-slate-800 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        {order.paymentMethod || 'UPI'}
                      </span>
                      
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border ${
                        isDelivered 
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60' 
                          : isCancelled 
                          ? 'bg-rose-950/60 text-rose-400 border-rose-800/60' 
                          : 'bg-amber-950/60 text-amber-400 border-amber-800/60'
                      }`}>
                        {isDelivered ? <CheckCircle size={10} /> : <Clock size={10} />}
                        {order.status || 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="space-y-2.5">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-xs bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/50">
                          <span className="text-slate-200 font-medium">
                            {item.title || item.product?.title || 'Product Item'} <span className="text-slate-500 font-bold ml-1">× {item.quantity || 1}</span>
                          </span>
                          <span className="text-slate-300 font-bold">
                            ₹{Number(item.price || 0) * (item.quantity || 1)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">Standard Marketplace Item</p>
                    )}
                  </div>

                  {/* Order Footer & Action */}
                  <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400">Total Amount: </span>
                      <span className="text-indigo-400 font-black text-sm ml-1">₹{order.totalAmount || 0}</span>
                    </div>

                    <button
                      onClick={() => navigate(`/order-details/${orderId || order._id}`)}
                      className="inline-flex items-center gap-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
                    >
                      View Details <ChevronRight size={14} />
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
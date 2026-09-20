import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, Package, Clock, CheckCircle2, 
  AlertCircle, ArrowLeft, RefreshCw, ChevronRight, Calendar
} from 'lucide-react';
import { useGetMyOrders } from '../api/orderApi';

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useGetMyOrders();

  const orders = Array.isArray(data) ? data : (data?.orders || []);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-[#070714] text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Loading your order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070714] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#0f0c1b]/90 border border-purple-900/40 p-6 rounded-3xl gap-4 shadow-xl">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <ShoppingBag className="text-orange-400" size={24} /> Buyer Orders Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Track live shipment statuses, invoices, and payment confirmations
            </p>
          </div>
          
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1.5 text-xs bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 px-3.5 py-2 rounded-xl text-slate-300 hover:text-white transition cursor-pointer"
            >
              <RefreshCw size={13} /> Refresh
            </button>
            <Link
              to="/marketplace"
              className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl transition shadow-md shadow-orange-500/20"
            >
              <ArrowLeft size={13} /> Shop More
            </Link>
          </div>
        </div>

        {/* Error Alert */}
        {isError && (
          <div className="bg-rose-950/40 border border-rose-800/60 text-rose-300 p-4 rounded-2xl text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertCircle size={18} className="text-rose-400 shrink-0" />
              <span>Could not load orders ({error?.message || 'Server error'}). Please ensure you are logged in.</span>
            </div>
            <button 
              onClick={() => refetch()}
              className="bg-rose-900/50 hover:bg-rose-900 text-rose-200 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Orders List Container */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Placed Orders ({orders.length})
            </h2>
          </div>

          {orders.length === 0 ? (
            <div className="bg-[#0f0c1b]/80 border border-purple-900/40 p-12 rounded-3xl text-center space-y-4 shadow-xl">
              <Package size={44} className="mx-auto text-purple-600" />
              <div className="space-y-1">
                <p className="text-base text-slate-200 font-bold">No orders placed yet</p>
                <p className="text-xs text-slate-400">Explore mill products in our catalog and place your first wholesale order.</p>
              </div>
              <Link
                to="/marketplace"
                className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-xs transition shadow-lg shadow-orange-500/20"
              >
                Start Sourcing
              </Link>
            </div>
          ) : (
            orders.map((order, index) => {
              const orderId = order.orderId || order._id;
              const isDelivered = order.status === 'Completed' || order.status === 'Delivered';
              const isCancelled = order.status === 'Cancelled';

              return (
                <div 
                  key={order._id || index} 
                  className="bg-[#0f0c1b]/90 border border-purple-900/40 p-5 rounded-3xl space-y-4 shadow-lg hover:border-orange-500/40 transition"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap justify-between items-center border-b border-purple-900/30 pb-3 gap-2">
                    <div>
                      <span className="text-[11px] text-orange-400 font-mono font-bold">
                        Order ID: #{orderId ? orderId.slice(-10).toUpperCase() : `ORD-${index + 101}`}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Calendar size={12} />
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : 'Recent'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="bg-[#070714] text-slate-300 border border-purple-900/50 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        {order.paymentMethod || 'Razorpay'}
                      </span>
                      
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border ${
                        isDelivered 
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60' 
                          : isCancelled 
                          ? 'bg-rose-950/60 text-rose-400 border-rose-800/60' 
                          : 'bg-amber-950/60 text-amber-400 border-amber-800/60'
                      }`}>
                        {isDelivered ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        {order.status || 'Order Confirmed'}
                      </span>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="space-y-2">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-xs bg-[#070714] p-3 rounded-xl border border-purple-900/20">
                          <span className="text-slate-200 font-medium">
                            {item.title || item.product?.title || 'Fabric Item'} <span className="text-purple-400 font-bold ml-1">× {item.quantity || 1} m</span>
                          </span>
                          <span className="text-orange-400 font-bold">
                            ₹{Number(item.price || 0) * (item.quantity || 1)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">Marketplace Item</p>
                    )}
                  </div>

                  {/* Order Footer & Action */}
                  <div className="border-t border-purple-900/30 pt-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400">Total Consignment: </span>
                      <span className="text-orange-400 font-black text-sm ml-1">₹{order.totalAmount || 0}</span>
                    </div>

                    <button
                      onClick={() => navigate(`/order/${orderId || order._id}`)}
                      className="inline-flex items-center gap-1 bg-purple-950/60 hover:bg-orange-500 hover:text-slate-950 border border-purple-500/30 text-purple-200 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
                    >
                      Track Shipment <ChevronRight size={14} />
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
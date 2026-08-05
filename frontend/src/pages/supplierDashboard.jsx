import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Clock, CheckCircle2, TrendingUp, Package, Plus, Edit2, Trash2 } from 'lucide-react';

export default function SupplierDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch(`${apiUrl}/api/orders`),
        fetch(`${apiUrl}/api/products`)
      ]);

      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // ANALYTICS CALCULATIONS
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
  const totalOrdersCount = orders.length;
  const completedOrdersCount = orders.filter(o => o.status === 'Completed').length;
  const pendingOrdersCount = orders.filter(o => o.status !== 'Completed').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-white">Supplier Business Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Overview of your fabric sales, revenue metrics & order fulfillment</p>
        </div>

        {/* FEATURE 5: ANALYTICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Revenue */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2 relative overflow-hidden">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold">Total Revenue</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <DollarSign size={16} />
              </div>
            </div>
            <p className="text-2xl font-black text-white">₹{totalRevenue.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
              <TrendingUp size={12} /> Total earnings from fulfilled orders
            </p>
          </div>

          {/* Card 2: Total Orders */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold">Total Orders</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ShoppingBag size={16} />
              </div>
            </div>
            <p className="text-2xl font-black text-white">{totalOrdersCount}</p>
            <p className="text-[10px] text-slate-400">Received till date</p>
          </div>

          {/* Card 3: Pending / Processing */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold">Active Processing</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Clock size={16} />
              </div>
            </div>
            <p className="text-2xl font-black text-white">{pendingOrdersCount}</p>
            <p className="text-[10px] text-amber-400">Requires fulfillment</p>
          </div>

          {/* Card 4: Completed Orders */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-semibold">Completed Orders</span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <p className="text-2xl font-black text-white">{completedOrdersCount}</p>
            <p className="text-[10px] text-blue-400">Delivered successfully</p>
          </div>

        </div>

        {/* INVENTORY SUMMARY & QUICK METRICS */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-indigo-400">
              <Package size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Active Catalog Items</h3>
              <p className="text-xs text-slate-400">You currently have <span className="text-white font-bold">{products.length}</span> fabric products listed in the marketplace.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
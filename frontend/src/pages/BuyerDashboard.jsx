import { useState, useEffect } from 'react';
import { Package, User, Clock, CheckCircle2, Truck, Calendar, ShoppingBag } from 'lucide-react';

export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState('orders'); // 'profile' | 'orders' | 'history'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock User Profile Data
  const userProfile = {
    name: 'Standard Buyer',
    email: 'buyer@example.com',
    phone: '+91 9876543210',
    address: 'Warehouse 12, Industrial Area, Sector 62',
    city: 'Noida',
    accountType: 'B2B Wholesale Buyer'
  };

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/orders`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Status Step Helper for Tracker
  const getStatusStep = (status) => {
    switch (status) {
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 1; // Pending
    }
  };

  // Filter current active orders vs completed past orders
  const currentOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const previousOrders = orders.filter(o => o.status === 'Delivered');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black">Buyer Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your business profile, ongoing shipments, and purchase history</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 flex items-center gap-2 transition border-b-2 ${
              activeTab === 'orders'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock size={16} /> Current Orders ({currentOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 flex items-center gap-2 transition border-b-2 ${
              activeTab === 'history'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package size={16} /> Previous Orders ({previousOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 flex items-center gap-2 transition border-b-2 ${
              activeTab === 'profile'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User size={16} /> Profile Information
          </button>
        </div>

        {/* Content Sections */}
        {loading ? (
          <p className="text-xs text-slate-500">Loading your dashboard...</p>
        ) : (
          <>
            {/* 1. CURRENT ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {currentOrders.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-2">
                    <ShoppingBag size={32} className="mx-auto text-slate-600" />
                    <p className="text-xs text-slate-400">No active ongoing orders right now.</p>
                  </div>
                ) : (
                  currentOrders.map((order) => {
                    const step = getStatusStep(order.status);
                    return (
                      <div key={order._id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 text-xs">
                          <div>
                            <span className="font-bold text-white">Order ID: #{order._id.slice(-6)}</span>
                            <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-0.5">
                              <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold rounded-full text-[10px]">
                            {order.status || 'Pending'}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-1.5 text-xs">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-slate-300">
                              <span>{item.title} x <strong className="text-white">{item.quantity}</strong></span>
                              <span className="text-indigo-400 font-semibold">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Basic Order Tracker Bar */}
                        <div className="bg-slate-950 p-4 rounded-2xl space-y-2">
                          <p className="text-[11px] font-bold text-slate-400 mb-2">Live Order Status Tracking:</p>
                          <div className="grid grid-cols-4 gap-2 text-[10px] text-center">
                            <div className={`p-2 rounded-xl font-semibold border ${step >= 1 ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                              1. Pending
                            </div>
                            <div className={`p-2 rounded-xl font-semibold border ${step >= 2 ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                              2. Processing
                            </div>
                            <div className={`p-2 rounded-xl font-semibold border ${step >= 3 ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                              3. Shipped
                            </div>
                            <div className={`p-2 rounded-xl font-semibold border ${step >= 4 ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
                              4. Delivered
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 flex justify-between items-center text-xs font-bold border-t border-slate-800">
                          <span className="text-slate-400">Total Amount</span>
                          <span className="text-indigo-400 text-sm">₹{order.totalAmount}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* 2. PREVIOUS ORDERS TAB */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {previousOrders.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center text-slate-400 text-xs">
                    No past delivered order history found.
                  </div>
                ) : (
                  previousOrders.map((order) => (
                    <div key={order._id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2 text-xs">
                        <span className="font-bold text-white">Order ID: #{order._id.slice(-6)}</span>
                        <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-full text-[10px] flex items-center gap-1">
                          <CheckCircle2 size={12} /> Delivered
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-slate-300">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.title} (x{item.quantity})</span>
                            <span className="text-indigo-400">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 flex justify-between items-center text-xs font-bold border-t border-slate-800">
                        <span className="text-slate-400">Total Paid</span>
                        <span className="text-white">₹{order.totalAmount}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. PROFILE VIEW TAB */}
            {activeTab === 'profile' && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Account Profile Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <p className="text-slate-500 text-[10px]">Full Name</p>
                    <p className="font-bold text-white text-sm mt-0.5">{userProfile.name}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <p className="text-slate-500 text-[10px]">Account Type</p>
                    <p className="font-bold text-indigo-400 text-sm mt-0.5">{userProfile.accountType}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <p className="text-slate-500 text-[10px]">Email Address</p>
                    <p className="font-bold text-white mt-0.5">{userProfile.email}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <p className="text-slate-500 text-[10px]">Phone Number</p>
                    <p className="font-bold text-white mt-0.5">{userProfile.phone}</p>
                  </div>
                  <div className="md:col-span-2 bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <p className="text-slate-500 text-[10px]">Default Delivery Warehouse Address</p>
                    <p className="font-bold text-white mt-0.5">{userProfile.address}, {userProfile.city}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
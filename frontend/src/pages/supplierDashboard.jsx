import { useState, useEffect } from 'react';
import { 
  Plus, Package, CheckCircle2, ShoppingBag, Building2, 
  MapPin, Clock, Phone, Layers, AlertTriangle, TrendingUp,
  Boxes, Trash2
} from 'lucide-react';

export default function SupplierDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [supplierProfile, setSupplierProfile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'Cotton',
    stock: 50, // Default stock quantity
    material: '',
    description: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchProducts();
    fetchSupplierOrders();

    // Load Onboarding Profile Data
    const savedProfile = localStorage.getItem('supplierProfile');
    if (savedProfile) {
      setSupplierProfile(JSON.parse(savedProfile));
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };

  const fetchSupplierOrders = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${apiUrl}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          price: Number(formData.price),
          stock: Number(formData.stock) 
        }),
      });

      if (res.ok) {
        setMessage('Product added successfully! 🎉');
        setFormData({ title: '', price: '', category: 'Cotton', stock: 50, material: '', description: '', image: '' });
        fetchProducts();
      } else {
        setMessage('Failed to add product');
      }
    } catch (err) {
      setMessage('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await fetch(`${apiUrl}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchSupplierOrders();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  //  CALCULATED METRICS FOR WIDGETS
  const totalProductsCount = products.length;
  const activeProductsCount = products.filter(p => (p.stock ?? 10) > 0).length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || !o.status).length;
  const lowStockProducts = products.filter(p => (p.stock ?? 10) < 15);
  const recentOrders = [...orders].reverse().slice(0, 3); // Top 3 recent orders

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-2xl font-black">Supplier Control Center</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time business insights, inventory alerts, and order management</p>
        </div>

        {/*  Onboarded Business Profile Banner */}
        {supplierProfile && (
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 rounded-xl flex items-center justify-center">
                <Building2 size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">{supplierProfile.businessName || 'My Textile Mill'}</h2>
                <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-md font-semibold">
                  {supplierProfile.businessType || 'Verified Supplier'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                <p className="text-slate-500 text-[10px] flex items-center gap-1"><MapPin size={10} /> Address</p>
                <p className="font-semibold text-slate-200 mt-0.5 truncate">{supplierProfile.address || 'N/A'}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                <p className="text-slate-500 text-[10px] flex items-center gap-1"><Phone size={10} /> Contact</p>
                <p className="font-semibold text-slate-200 mt-0.5">{supplierProfile.phone || 'N/A'}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                <p className="text-slate-500 text-[10px] flex items-center gap-1"><Clock size={10} /> Working Hours</p>
                <p className="font-semibold text-slate-200 mt-0.5">{supplierProfile.operatingHours || 'N/A'}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                <p className="text-slate-500 text-[10px] flex items-center gap-1"><Layers size={10} /> Minimum Order (MOQ)</p>
                <p className="font-semibold text-indigo-400 mt-0.5">{supplierProfile.moq || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* SUGGESTED ANALYTICS WIDGETS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <Boxes size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Total Products</p>
              <h3 className="text-lg font-bold text-white">{totalProductsCount}</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Active In-Stock</p>
              <h3 className="text-lg font-bold text-white">{activeProductsCount}</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Pending Orders</p>
              <h3 className="text-lg font-bold text-white">{pendingOrdersCount}</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Low Stock Alerts</p>
              <h3 className="text-lg font-bold text-white">{lowStockProducts.length}</h3>
            </div>
          </div>
        </div>

        {/*  INVENTORY ALERTS WIDGET (Shows when stock < 15) */}
        {lowStockProducts.length > 0 && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center justify-between gap-4 text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-400 shrink-0" />
              <span><strong>Inventory Alert:</strong> {lowStockProducts.length} product(s) running low on stock! Consider restocking soon.</span>
            </div>
            <span className="font-bold underline text-[11px] cursor-pointer">Review Items</span>
          </div>
        )}

        {/* Product Form & Inventory Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Product Form */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-3xl h-fit">
            <h2 className="text-sm font-bold flex items-center gap-2 mb-4">
              <Plus size={16} className="text-indigo-400" /> Add New Inventory Product
            </h2>

            {message && (
              <div className="mb-4 p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 size={14} /> {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Cotton Fabric"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Price (/ meter)</label>
                  <input
                    type="number"
                    required
                    placeholder="250"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Initial Stock (Meters)</label>
                  <input
                    type="number"
                    required
                    placeholder="100"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Cotton">Cotton</option>
                  <option value="Silk">Silk</option>
                  <option value="Denim">Denim</option>
                  <option value="Polyester">Polyester</option>
                  <option value="Linen">Linen</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl transition mt-2 disabled:opacity-50"
              >
                {loading ? 'Publishing...' : 'Publish Product'}
              </button>
            </form>
          </div>

          {/* INVENTORY MANAGEMENT SECTION */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <Package size={16} className="text-indigo-400" /> Active Inventory Management ({products.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((p) => {
                const stockQty = p.stock ?? 25; // fallback mock stock
                return (
                  <div key={p._id || p.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex gap-3 items-center relative">
                    <img
                      src={p.image || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300'}
                      alt={p.title || p.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xs text-white truncate">{p.title || p.name}</h3>
                      <p className="text-[10px] text-slate-400">{p.category}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-bold text-indigo-400">₹{p.price} / m</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                          stockQty < 15 
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        }`}>
                          Stock: {stockQty}m
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CUSTOMER ORDERS MANAGEMENT */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <ShoppingBag size={16} className="text-indigo-400" /> Marketplace Orders ({orders.length})
          </h2>

          {orders.length === 0 ? (
            <p className="text-xs text-slate-500">No customer orders received yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o._id} className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div>
                    <p className="font-bold text-white">Order ID: #{o._id.slice(-6)}</p>
                    <p className="text-slate-400 mt-0.5">
                      Buyer: <span className="text-slate-200 font-semibold">{o.shippingAddress?.name || 'Customer'}</span> ({o.shippingAddress?.city || 'N/A'})
                    </p>
                    <p className="text-indigo-400 font-bold mt-1">Total: ₹{o.totalAmount}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">Status:</span>
                    <select
                      value={o.status || 'Pending'}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
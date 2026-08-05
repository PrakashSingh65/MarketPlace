import { useState, useEffect } from 'react';
import { Plus, Package, CheckCircle2, ShoppingBag } from 'lucide-react';

export default function SupplierDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'Cotton',
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
  }, []);

  // 1. Fetch Existing Products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };

  // 2. Fetch Customer Orders
  const fetchSupplierOrders = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders for supplier:', err);
    }
  };

  // 3. Handle Product Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${apiUrl}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, price: Number(formData.price) }),
      });

      if (res.ok) {
        setMessage('Product added successfully! 🎉');
        setFormData({ title: '', price: '', category: 'Cotton', material: '', description: '', image: '' });
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

  // 4. Update Order Status
  const updateStatus = async (orderId, newStatus) => {
    try {
      await fetch(`${apiUrl}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchSupplierOrders(); // Live refresh orders list
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-black">Supplier Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Manage catalog inventory and track customer orders</p>
        </div>

        {/* Product Add & Inventory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Product Form */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-3xl h-fit">
            <h2 className="text-sm font-bold flex items-center gap-2 mb-4">
              <Plus size={16} className="text-indigo-400" /> Add New Product
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
                  placeholder="e.g. Organic Pure Cotton Fabric"
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

          {/* Active Inventory List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-bold flex items-center gap-2">
              <Package size={16} className="text-indigo-400" /> Active Inventory ({products.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((p) => (
                <div key={p._id || p.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex gap-3 items-center">
                  <img
                    src={p.image || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300'}
                    alt={p.title || p.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-800"
                  />
                  <div>
                    <h3 className="font-bold text-xs text-white line-clamp-1">{p.title || p.name}</h3>
                    <p className="text-[10px] text-slate-400">{p.category}</p>
                    <p className="text-xs font-bold text-indigo-400 mt-1">₹{p.price} / m</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🟢 Customer Orders Section */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <ShoppingBag size={16} className="text-indigo-400" /> Customer Orders ({orders.length})
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
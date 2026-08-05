import { useState, useEffect } from 'react';
import { 
  Plus, Package, CheckCircle2, ShoppingBag, Building2, 
  MapPin, Clock, Phone, Layers, AlertTriangle, Boxes, 
  Trash2, Edit3, Eye, EyeOff, X, Truck, User, Calendar
} from 'lucide-react';

export default function SupplierDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [supplierProfile, setSupplierProfile] = useState(null);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'Cotton',
    stock: 50,
    isAvailable: true,
    image: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchProducts();
    fetchSupplierOrders();

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

  // ADD or EDIT PRODUCT SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const url = editingId 
      ? `${apiUrl}/api/products/${editingId}` 
      : `${apiUrl}/api/products`;
    
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          price: Number(formData.price),
          stock: Number(formData.stock) 
        }),
      });

      if (res.ok) {
        setMessage(editingId ? 'Product updated successfully! ✏️' : 'Product published successfully! 🎉');
        resetForm();
        fetchProducts();
      } else {
        setMessage('Failed to save product');
      }
    } catch (err) {
      setMessage('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${apiUrl}/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // TOGGLE AVAILABILITY
  const toggleAvailability = async (product) => {
    const updatedStatus = !product.isAvailable;
    try {
      await fetch(`${apiUrl}/api/products/${product._id || product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: updatedStatus })
      });
      fetchProducts();
    } catch (err) {
      console.error('Error updating availability:', err);
    }
  };

  // EDIT PREFILL
  const handleEditClick = (product) => {
    setEditingId(product._id || product.id);
    setFormData({
      title: product.title || product.name || '',
      price: product.price || '',
      category: product.category || 'Cotton',
      stock: product.stock ?? 50,
      isAvailable: product.isAvailable ?? true,
      image: product.image || '',
      description: product.description || ''
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      price: '',
      category: 'Cotton',
      stock: 50,
      isAvailable: true,
      image: '',
      description: ''
    });
  };

  // UPDATE ORDER STATUS (Pending -> Accepted -> Preparing -> Ready for Dispatch -> Completed)
  const updateOrderStatus = async (orderId, newStatus) => {
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

  // Status Badge Styling Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'Preparing':
        return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
      case 'Ready for Dispatch':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'Completed':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-300'; // Pending
    }
  };

  const totalProductsCount = products.length;
  const activeProductsCount = products.filter(p => (p.isAvailable ?? true) && (p.stock ?? 10) > 0).length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending' || !o.status).length;
  const lowStockProducts = products.filter(p => (p.stock ?? 10) < 15);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black">Supplier Control Center</h1>
          <p className="text-xs text-slate-400 mt-1">Manage product listings, inventory stock, and customer orders</p>
        </div>

        {/* 🏢 Business Profile Banner */}
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

        {/* 📈 Analytics Widgets */}
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
              <p className="text-[10px] text-slate-400 font-medium">Active & Available</p>
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

        {/* 🛒 CUSTOMER ORDERS MANAGEMENT SECTION */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ShoppingBag size={16} className="text-indigo-400" /> Received Customer Orders ({orders.length})
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">View incoming order details and update fulfillment status</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-500 text-xs">
              No customer orders received yet.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const currentStatus = order.status || 'Pending';
                return (
                  <div key={order._id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-4 text-xs">
                    
                    {/* Header Details */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div>
                        <span className="font-bold text-white">Order ID: #{order._id.slice(-6)}</span>
                        <div className="flex items-center gap-3 text-slate-400 text-[10px] mt-1">
                          <span className="flex items-center gap-1"><User size={12} /> {order.shippingAddress?.name || 'Customer'}</span>
                          <span className="flex items-center gap-1"><MapPin size={12} /> {order.shippingAddress?.city || 'Location N/A'}</span>
                          <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Status Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold ${getStatusBadge(currentStatus)}`}>
                          {currentStatus}
                        </span>
                        
                        <select
                          value={currentStatus}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Ready for Dispatch">Ready for Dispatch</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Items Breakdown */}
                    <div className="bg-slate-900/60 p-3 rounded-xl space-y-2 border border-slate-800/50">
                      <p className="text-[10px] font-bold text-slate-400">Order Line Items:</p>
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-slate-300 text-xs">
                          <span>{item.title} x <strong className="text-white">{item.quantity}</strong></span>
                          <span className="text-indigo-400 font-semibold">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Total Amount Footer */}
                    <div className="flex justify-between items-center pt-1 text-xs">
                      <span className="text-slate-400">Grand Total:</span>
                      <span className="text-white font-bold text-sm">₹{order.totalAmount}</span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Catalog Management Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add / Edit Form */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-3xl h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold flex items-center gap-2">
                {editingId ? <Edit3 size={16} className="text-amber-400" /> : <Plus size={16} className="text-indigo-400" />} 
                {editingId ? 'Edit Product Details' : 'Add New Product'}
              </h2>
              {editingId && (
                <button onClick={resetForm} className="text-slate-400 hover:text-white text-xs flex items-center gap-1">
                  <X size={14} /> Cancel
                </button>
              )}
            </div>

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
                  placeholder="e.g. Premium Silk Blend Fabric"
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
                    placeholder="350"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Stock Quantity</label>
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
                <label className="block text-slate-400 mb-1">Upload Product Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="availability"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="availability" className="text-slate-300 cursor-pointer">
                  Mark as Available in Marketplace
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full font-bold py-2.5 rounded-xl transition mt-2 disabled:opacity-50 text-white ${
                  editingId ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                {loading ? 'Saving...' : editingId ? 'Update Product' : 'Publish Product'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

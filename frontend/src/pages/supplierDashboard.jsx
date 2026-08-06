import { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Clock, CheckCircle2, TrendingUp, Package, Plus, Upload, Trash2, X, Image as ImageIcon } from 'lucide-react';

export default function SupplierDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [productData, setProductData] = useState({
    title: '',
    category: 'Cotton',
    price: '',
    stock: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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

  // Image File Select Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Add Product Form Submit (Cloudinary + Backend API)
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', productData.title);
      formData.append('name', productData.title); // Fallback for name/title
      formData.append('category', productData.category);
      formData.append('price', productData.price);
      formData.append('stock', productData.stock);
      formData.append('description', productData.description);
      
      if (imageFile) {
        formData.append('image', imageFile); // File field for Cloudinary/Multer
      }

      const res = await fetch(`${apiUrl}/api/products`, {
        method: 'POST',
        body: formData // FormData uses multipart/form-data automatically
      });

      if (res.ok) {
        setIsModalOpen(false);
        setProductData({ title: '', category: 'Cotton', price: '', stock: '', description: '' });
        setImageFile(null);
        setImagePreview(null);
        fetchDashboardData(); // Refresh list
      } else {
        alert('Failed to upload product.');
      }
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Error uploading product.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Product Handler
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${apiUrl}/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchDashboardData();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Analytics Calculations
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
  const totalOrdersCount = orders.length;
  const completedOrdersCount = orders.filter(o => o.status === 'Completed').length;
  const pendingOrdersCount = orders.filter(o => o.status !== 'Completed').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-white">Supplier Business Dashboard</h1>
            <p className="text-xs text-slate-400 mt-1">Overview of your fabric sales, revenue metrics & order fulfillment</p>
          </div>
          
          {/* Add Product Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-indigo-600/20"
          >
            <Plus size={16} /> Add New Fabric
          </button>
        </div>

        {/* ANALYTICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
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

        {/* INVENTORY & PRODUCT LIST */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-indigo-400">
              <Package size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Active Catalog Items</h3>
              <p className="text-xs text-slate-400">You currently have <span className="text-white font-bold">{products.length}</span> fabric products listed in the marketplace.</p>
            </div>
          </div>

          {/* Product Grid / Table */}
          {products.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
              No products uploaded yet. Click "Add New Fabric" above to list your first item!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div key={prod._id || prod.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 relative group">
                  <div className="h-32 rounded-xl overflow-hidden bg-slate-900 relative">
                    <img 
                      src={prod.image || prod.imageUrl || 'https://via.placeholder.com/300'} 
                      alt={prod.title || prod.name} 
                      className="w-full h-full object-cover"
                    />
                    <button 
                      onClick={() => handleDeleteProduct(prod._id || prod.id)}
                      className="absolute top-2 right-2 p-1.5 bg-rose-500/80 hover:bg-rose-600 text-white rounded-lg transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate">{prod.title || prod.name}</h4>
                    <p className="text-[10px] text-slate-400">{prod.category} • ₹{prod.price}/m</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 🟢 ADD PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 relative shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload size={16} className="text-indigo-400" /> List New Fabric Product
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              
              {/* Image Upload Area */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Product Image (Cloudinary Upload)</label>
                <div className="border-2 border-dashed border-slate-800 rounded-2xl p-4 text-center hover:border-indigo-500/50 transition cursor-pointer relative bg-slate-950">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-28 mx-auto object-cover rounded-xl" />
                  ) : (
                    <div className="space-y-2 text-slate-500">
                      <ImageIcon size={28} className="mx-auto text-indigo-400" />
                      <p className="text-[11px]">Click or drag image file here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Fabric Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Pure Cotton Fabric"
                  value={productData.title}
                  onChange={(e) => setProductData({ ...productData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Category</label>
                  <select
                    value={productData.category}
                    onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Cotton">Cotton</option>
                    <option value="Silk">Silk</option>
                    <option value="Linen">Linen</option>
                    <option value="Denim">Denim</option>
                    <option value="Polyester">Polyester</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Price per Meter (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="250"
                    value={productData.price}
                    onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Available Stock (Meters)</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={productData.stock}
                  onChange={(e) => setProductData({ ...productData, stock: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition disabled:opacity-50 mt-2"
              >
                {submitting ? 'Uploading to Cloudinary...' : 'Upload Product'}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
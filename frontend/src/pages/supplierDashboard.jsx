import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { categoryColors } from '../components/ProductCard';
import { Package, Layers, BarChart3, Plus, AlertCircle, Loader2 } from 'lucide-react';

const CATEGORIES = ['Cotton', 'Silk', 'Polyester', 'Wool', 'Linen', 'Denim'];

export default function SupplierDashboard() {
  const { user, token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    pricePerMeter: '',
    moq: '',
    stockMeters: '',
    gsm: '',
    composition: ''
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${apiUrl}/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      
      // Filter for supplier's own products
      const myProducts = data.filter(p => p.supplierId?._id === user?.id || p.supplierId === user?.id);
      setProducts(myProducts);
    } catch (err) {
      setError('Could not load your products.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        pricePerMeter: Number(formData.pricePerMeter),
        moq: Number(formData.moq),
        stockMeters: Number(formData.stockMeters),
      };

      if (formData.gsm) payload.gsm = Number(formData.gsm);
      if (formData.composition) payload.composition = formData.composition;

      const res = await fetch(`${apiUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add product');

      // Reset form
      setFormData({
        title: '', description: '', category: '', pricePerMeter: '',
        moq: '', stockMeters: '', gsm: '', composition: ''
      });
      
      // Refresh products
      fetchProducts();
    } catch (err) {
      setSubmitError(err.message || 'An error occurred while adding the product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const uniqueCategories = new Set(products.map(p => p.category)).size;
  const totalStock = products.reduce((acc, p) => acc + (p.stockMeters || 0), 0);

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-6 py-8">
      {/* Header section */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-indigo-100">Manage your textile catalog and track your inventory.</p>
      </div>

      {/* Stats cards row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4 border border-slate-100">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Products</p>
            <p className="text-2xl font-bold text-slate-900">{products.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4 border border-slate-100">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Categories</p>
            <p className="text-2xl font-bold text-slate-900">{uniqueCategories}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-md flex items-center gap-4 border border-slate-100">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Stock</p>
            <p className="text-2xl font-bold text-slate-900">{totalStock.toLocaleString()} m</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Add Product Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 sticky top-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Add New Textile</h2>
            
            {submitError && (
              <div className="mb-4 p-3 bg-red-50 rounded-xl flex items-start gap-2 border border-red-100">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fabric Title</label>
                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm" placeholder="e.g. Premium Cotton Yarn" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm resize-none" placeholder="Fabric details..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm">
                  <option value="" disabled>Select category</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price per Meter (₹)</label>
                  <input required type="number" min="0" name="pricePerMeter" value={formData.pricePerMeter} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Min Order Qty (meters)</label>
                  <input required type="number" min="1" name="moq" value={formData.moq} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Available Stock (meters)</label>
                <input required type="number" min="0" name="stockMeters" value={formData.stockMeters} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">GSM (optional)</label>
                  <input type="number" min="0" name="gsm" value={formData.gsm} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Composition (optional)</label>
                  <input type="text" name="composition" value={formData.composition} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm" placeholder="e.g. 100% Cotton" />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110 text-white font-medium py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-70">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                {isSubmitting ? 'Adding...' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>

        {/* Right column: Product listings */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Your Published Listings</h2>
            <span className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-xs font-bold">
              {products.length} Products
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">{error}</div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 border-dashed p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No products yet</h3>
              <p className="text-slate-500">Add your first textile listing using the form on the left.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map(product => {
                const colorClass = categoryColors?.[product.category] || 'bg-slate-100 text-slate-700';
                return (
                  <div key={product._id} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colorClass}`}>
                        {product.category}
                      </span>
                      <span className="text-lg font-bold text-emerald-600">₹{product.pricePerMeter}<span className="text-xs text-slate-500 font-normal">/m</span></span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-1">{product.title}</h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[40px]">{product.description || 'No description provided.'}</p>
                    
                    <div className="grid grid-cols-2 gap-y-2 text-sm border-t border-slate-100 pt-3">
                      <div>
                        <span className="text-slate-500 block text-xs">MOQ</span>
                        <span className="font-medium text-slate-900">{product.moq} m</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-xs">Stock</span>
                        <span className="font-medium text-slate-900">{product.stockMeters} m</span>
                      </div>
                      {product.gsm && (
                        <div>
                          <span className="text-slate-500 block text-xs">GSM</span>
                          <span className="font-medium text-slate-900">{product.gsm}</span>
                        </div>
                      )}
                      {product.composition && (
                        <div className={!product.gsm ? 'col-span-2' : ''}>
                          <span className="text-slate-500 block text-xs">Composition</span>
                          <span className="font-medium text-slate-900 truncate block">{product.composition}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
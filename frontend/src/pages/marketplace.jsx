import React, { useState, useEffect, useContext } from 'react';
import { ShoppingBag, Search, Filter, CheckCircle2 } from 'lucide-react';
import { CartContext } from '../context/CartContext';

export default function Marketplace() {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // 🔔 Custom Notification State
  const [showNotification, setShowNotification] = useState(false);

  // Fetch Products from Backend / Mock Data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || data);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 🛒 Handle Add To Cart with Custom Notification
  const handleAddToCart = (product) => {
    addToCart(product);

    // Show Custom Popup
    setShowNotification(true);

    // 2 second baad automatically hide ho jayega
    setTimeout(() => {
      setShowNotification(false);
    }, 2000);
  };

  // Categories Filter
  const categories = ['All', 'Cotton', 'Silk', 'Polyester', 'Wool', 'Linen', 'Denim'];

  // Filter Products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8 px-4 sm:px-6 lg:px-8 relative">
      
      {/* 🔔 Clean Modern Popup (No 'localhost' text) */}
      {showNotification && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white text-sm font-semibold px-6 py-3 rounded-2xl border border-indigo-500/50 shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>Product add ho gya</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fabric Marketplace</h1>
            <p className="text-slate-400 text-sm mt-1">Browse and order premium textile materials</p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search fabrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-500 text-sm">Loading fabrics...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const image = (product.images && product.images[0]) || product.image || 'https://via.placeholder.com/300';
              
              return (
                <div
                  key={product._id || product.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition flex flex-col justify-between group"
                >
                  <div className="relative aspect-square bg-slate-950 overflow-hidden">
                    <img
                      src={image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-800">
                      {product.category || 'Fabric'}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-semibold text-white text-base line-clamp-1">{product.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {product.description || 'High quality material.'}
                      </p>
                      <p className="text-emerald-400 font-bold text-lg mt-2">
                        ₹{product.price} <span className="text-xs text-slate-400 font-normal">/meter</span>
                      </p>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-indigo-600/20 cursor-pointer"
                    >
                      <ShoppingBag size={16} /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Filter, Sparkles, ShoppingBag } from 'lucide-react';

export default function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'low-high', 'high-low'
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter & Sort Logic
  useEffect(() => {
    let result = [...products];

    // 1. Search Filter
    if (searchTerm.trim() !== '') {
      result = result.filter(p => 
        (p.title || p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 3. Price Sorting
    if (sortBy === 'low-high') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'high-low') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, sortBy, products]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/products`);
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Cotton', 'Silk', 'Denim', 'Polyester', 'Linen'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-indigo-900/40 via-slate-900 to-slate-900 border border-slate-800 p-8 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} /> B2B Marketplace Catalog
          </div>
          <h1 className="text-3xl font-black text-white">Explore Premium Wholesale Fabrics</h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Source high-grade textile materials directly from verified manufacturers and suppliers.
          </p>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="flex-1 min-w-[240px] relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search fabrics, materials, title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} className="text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="default">Sort by: Featured</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>

        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-xs">Loading marketplace catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-12 rounded-3xl text-center space-y-3">
            <Filter className="mx-auto text-slate-600" size={32} />
            <p className="text-xs text-slate-400">No fabrics found matching your search or filter criteria.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSortBy('default'); }}
              className="text-xs font-bold text-indigo-400 underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isAvail = product.isAvailable ?? true;
              return (
                <div key={product._id || product.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 group hover:border-slate-700 transition">
                  <div className="space-y-3">
                    <div className="relative overflow-hidden rounded-xl h-40 bg-slate-950">
                      <img
                        src={product.image || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500'}
                        alt={product.title || product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-indigo-400 text-[10px] px-2 py-0.5 rounded-md font-bold border border-slate-800">
                        {product.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-xs text-white truncate">{product.title || product.name}</h3>
                      <p className="text-indigo-400 font-extrabold text-sm mt-1">₹{product.price} <span className="text-[10px] text-slate-500 font-normal">/ meter</span></p>
                    </div>
                  </div>

                  <button
                    disabled={!isAvail}
                    onClick={() => addToCart && addToCart(product)}
                    className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                      isAvail 
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag size={14} />
                    {isAvail ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
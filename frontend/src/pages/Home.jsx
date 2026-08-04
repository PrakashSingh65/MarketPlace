import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, Filter, ArrowRight, ShieldCheck, Truck, Sparkles, 
  Layers, ShoppingBag, Menu, X, User, CheckCircle2, Star 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import InquiryModal from '../components/InquiryModal';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamic Product Categories List
  const categories = ['All', 'Cotton', 'Silk', 'Polyester', 'Denim', 'Linen'];

  // 1. Fetch Products from Backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error loading products:', err));
  }, []);

  // 2. Product Search & Product Filtering Logic
  const filteredProducts = products.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Featured Products (First 3 items or high-value items)
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      
      
      <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <ShoppingBag size={22} />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 tracking-tight block">TexMarket<span className="text-indigo-600">.b2b</span></span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block -mt-1">Verified Textile Hub</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8 font-medium text-slate-600 text-sm">
              <a href="#featured" className="hover:text-indigo-600 transition">Featured</a>
              <a href="#categories" className="hover:text-indigo-600 transition">Categories</a>
              <a href="#marketplace" className="hover:text-indigo-600 transition">All Fabrics</a>
              <a href="#how-it-works" className="hover:text-indigo-600 transition">Workflow</a>
              <div className="h-4 w-px bg-slate-200"></div>
              <Link 
                to="/supplier/dashboard" 
                className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full font-semibold border border-indigo-100 transition flex items-center gap-1.5"
              >
                <ShieldCheck size={16} /> Supplier Portal
              </Link>
            </div>

            {/* Auth Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 px-4 py-2 text-sm font-semibold transition">
                <User size={18} /> Sign In
              </Link>
              <Link to="/register" className="bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition">
                Get Started
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 p-2">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4">
            <a href="#featured" className="block text-slate-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Featured Products</a>
            <a href="#categories" className="block text-slate-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Categories</a>
            <a href="#marketplace" className="block text-slate-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Marketplace</a>
            <Link to="/supplier/dashboard" className="block text-indigo-600 font-semibold">Supplier Portal</Link>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link to="/login" className="w-full text-center py-2.5 text-slate-700 font-semibold rounded-xl border">Sign In</Link>
              <Link to="/register" className="w-full text-center py-2.5 bg-indigo-600 text-white font-semibold rounded-xl">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

    
      <section className="relative bg-slate-950 text-white pt-20 pb-28 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-300">
            <Sparkles size={14} className="text-indigo-400" />
            <span>Direct Buyer-to-Supplier B2B Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-tight">
            Source Premium Wholesale Fabrics <br />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200 bg-clip-text text-transparent">
              Directly From Verified Mills
            </span>
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Transparent MOQ limits, verified fabric quality, and direct RFQ quotes without middleman markups.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a href="#marketplace" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center gap-2">
              Explore Marketplace <ArrowRight size={16} />
            </a>
            <Link to="/supplier/dashboard" className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white px-8 py-3.5 rounded-2xl font-bold text-sm transition">
              Supplier Portal Access
            </Link>
          </div>
        </div>
      </section>

      
      {featuredProducts.length > 0 && (
        <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">Handpicked Selection</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Featured Fabrics</h2>
            </div>
            <a href="#marketplace" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((item) => (
              <div key={item._id} className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-4 right-4 bg-amber-400/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase flex items-center gap-1">
                  <Star size={12} className="fill-amber-400" /> Featured
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    {item.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-4 mb-2">{item.title}</h3>
                  <p className="text-slate-300 text-xs line-clamp-2 mb-6">{item.description}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-emerald-400">₹{item.pricePerMeter}</span>
                    <span className="text-[10px] text-slate-400 block">/ meter</span>
                  </div>
                  <button 
                    onClick={() => { setSelectedProduct(item); setIsModalOpen(true); }}
                    className="bg-white text-slate-900 hover:bg-indigo-50 font-bold px-4 py-2 rounded-xl text-xs transition"
                  >
                    Quick Inquiry
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      
      <section id="marketplace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Title + Product Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">Live Marketplace Grid</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Wholesale Fabric Directory</h2>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by fabric name, weave..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Product Filtering Category Pills */}
        <div id="categories" className="flex items-center gap-2 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 text-slate-400 mr-2 text-xs font-semibold uppercase tracking-wider">
            <Filter size={14} /> Filter:
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-lg scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-3">
            <Layers className="mx-auto text-slate-300" size={48} />
            <h3 className="text-lg font-bold text-slate-800">No Fabrics Found</h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              Try changing search term or category filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((item) => (
              <div 
                key={item._id} 
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                      {item.category}
                    </span>
                    <div className="text-right">
                      <span className="text-xl font-extrabold text-slate-900">₹{item.pricePerMeter}</span>
                      <span className="text-xs text-slate-400 block font-medium">/ meter</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium">MOQ (Min Order):</span>
                    <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {item.minOrderQty} meters
                    </span>
                  </div>

                  <button
                    onClick={() => { setSelectedProduct(item); setIsModalOpen(true); }}
                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-3 rounded-2xl font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all duration-200"
                  >
                    <span>Request Bulk Quote</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bulk Inquiry RFQ Modal */}
      <InquiryModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
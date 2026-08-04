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

  useEffect(() => {
    // Fetch products from backend, fallback to dummy data if API fails
    axios.get('http://localhost:5000/api/fabrics')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data);
        } else {
          setProducts(defaultProducts);
        }
      })
      .catch(() => {
        setProducts(defaultProducts);
      });
  }, []);

  // Filter products based on category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || 
      (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch = (product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleInquiryClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/*1. NAVIGATION BAR */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Layers size={22} />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Tex<span className="text-indigo-500">Market</span>
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
              <a href="#marketplace" className="hover:text-white transition">Marketplace</a>
              <a href="#features" className="hover:text-white transition">Why Choose Us</a>
              <a href="#about" className="hover:text-white transition">Quality Assurance</a>
            </div>

            {/* Auth Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-xs font-semibold text-slate-300 hover:text-white transition px-4 py-2">
                Sign In
              </Link>
              <Link to="/register" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20">
                Become a Supplier
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden text-slate-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
            <a href="#marketplace" className="block text-sm text-slate-300 py-2">Marketplace</a>
            <Link to="/login" className="block text-sm text-slate-300 py-2">Sign In</Link>
            <Link to="/register" className="block bg-indigo-600 text-white text-center py-2.5 rounded-xl font-semibold text-sm">
              Become a Supplier
            </Link>
          </div>
        )}
      </nav>

      {/*2. HERO SECTION*/}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-indigo-400 text-xs font-semibold mb-6">
            <Sparkles size={14} /> AI-Powered B2B Textile Marketplace
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Source Premium Fabrics Directly From <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Verified Mills</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-6 leading-relaxed">
            Eliminate middleman markups. Discover high-grade cotton, silk, linen, and denim fabrics with transparent wholesale rates and low MOQs.
          </p>

          {/* Quick Value Props */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-400" /> Verified Suppliers</span>
            <span className="flex items-center gap-2"><Truck size={16} className="text-indigo-400" /> Doorstep Bulk Logistics</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-400" /> Strict Quality Audits</span>
          </div>
        </div>
      </section>

      {/*3. MARKETPLACE CATALOG & FILTERS */}
      <section id="marketplace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Search & Category Filter Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search fabrics, weave, category..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((item) => (
            <div 
              key={item._id} 
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:border-slate-700 transition group duration-300"
            >
              <div>
                {/* Image & Category Tag */}
                <div className="relative h-48 bg-slate-950 rounded-2xl overflow-hidden mb-4">
                  <img 
                    src={item.image || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800'} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-indigo-400 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>

                {/* 🌟 PRODUCT TITLE WITH LINK TO DEDICATED PAGE */}
                <Link to={`/product/${item._id}`}>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition cursor-pointer">
                    {item.title}
                  </h3>
                </Link>

                <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                  {item.description || 'High quality commercial fabric ideal for fashion manufacturing and garment creation.'}
                </p>
              </div>

              {/* Price & Action */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Wholesale Rate</span>
                  <span className="text-base font-extrabold text-emerald-400">
                    ₹{item.pricePerMeter} <span className="text-[10px] text-slate-400 font-normal">/ meter</span>
                  </span>
                </div>

                <button
                  onClick={() => handleInquiryClick(item)}
                  className="bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  Request Quote <ArrowRight size={14} />
                </button>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* Inquiry Modal */}
      {selectedProduct && (
        <InquiryModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

    </div>
  );
}

// Default Fallback Products Data
const defaultProducts = [
  {
    _id: '1',
    title: 'Premium Organic Cotton Fabric',
    category: 'Cotton',
    description: '100% breathable organic combed cotton suitable for apparel, home textiles, and garment manufacturing.',
    pricePerMeter: 250,
    minOrderQty: 50,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: '2',
    title: 'Luxury Pure Silk Satin',
    category: 'Silk',
    description: 'High-shine, smooth Mulberry silk ideal for premium festive wear, evening dresses, and ethnic outfits.',
    pricePerMeter: 850,
    minOrderQty: 20,
    image: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: '3',
    title: 'Heavy Denim Twill Fabric',
    category: 'Denim',
    description: 'Durable 14oz cotton twill denim designed for jackets, jeans, and rugged outerwear.',
    pricePerMeter: 420,
    minOrderQty: 100,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: '4',
    title: 'Pure French Linen Material',
    category: 'Linen',
    description: 'Softened, breathable pure linen fabric perfect for summer clothing and high-end upholstery.',
    pricePerMeter: 600,
    minOrderQty: 30,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800'
  }
];
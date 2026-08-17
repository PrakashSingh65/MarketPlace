import React, { useState, useEffect } from 'react';
import { 
  Search, 
  User, 
  ChevronDown, 
  ShoppingCart, 
  Shirt, 
  Smartphone, 
  Tv, 
  Home as HomeIcon, 
  Sparkles, 
  ShoppingBag, 
  Dumbbell, 
  Armchair, 
  BookOpen, 
  Bike, 
  X, 
  ChevronRight, 
  Zap, 
  Rocket, 
  Diamond, 
  ArrowRight, 
  Laptop,
  Package,
  Heart,
  Store,
  Gift,
  CreditCard,
  Bell,
  Headphones,
  TrendingUp,
  Download
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Sub-categories Mapping
const CATEGORY_MAP = {
  Fashion: ["Men's Wear", "Women's Wear", "Kids Wear", "Footwear"],
  Mobiles: ["iPhone", "Vivo", "OPPO", "POCO", "Redmi", "Samsung", "realme"],
  Electronics: ["Laptops", "Headphones", "Smartwatches", "Monitors"],
  Beauty: ["Skincare", "Makeup", "Haircare"],
  Home: ["Furniture", "Decor", "Kitchen"],
  Appliances: ["TVs", "Refrigerators", "Washing Machines"],
  Sports: ["Fitness", "Outdoor Games", "Gym Gear"],
  Furniture: ["Beds", "Sofas", "Tables"],
  Books: ["Fiction", "Non-Fiction", "Academic"],
  "2 Wheelers": ["Electric Scooters", "Bikes"]
};

// 1. NEON HERO SECTION COMPONENT
function InlineHeroSection() {
  return (
    <section className="relative bg-[#070714] text-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-3xl border border-purple-900/40 my-4 max-w-7xl mx-auto shadow-[0_0_50px_rgba(112,0,255,0.2)]">
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-orange-500/20 via-purple-600/30 to-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-orange-600/20 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-600/20 rounded-full blur-[90px] pointer-events-none" />

      {/* Grid Container */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-5 justify-between">
          <div className="flex-1 bg-[#0f0c1b]/80 backdrop-blur-md rounded-2xl p-5 border border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.25)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition duration-300">
            <span className="text-[10px] font-extrabold tracking-widest text-orange-400 uppercase bg-orange-950/80 border border-orange-500/30 px-2 py-0.5 rounded-full">
              Innovate. Design.
            </span>
            <h3 className="text-xl font-black mt-3 bg-gradient-to-r from-orange-200 to-amber-400 bg-clip-text text-transparent">
              Inspire.
            </h3>
            <p className="text-xs text-slate-400 mt-2">Next-gen UI elements and cosmic design aesthetics.</p>
            <button className="mt-4 px-4 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-xs shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:scale-105 transition flex items-center gap-1">
              Explore <ArrowRight size={12} />
            </button>
          </div>

          <div className="flex-1 bg-[#0f0c1b]/80 backdrop-blur-md rounded-2xl p-5 border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition duration-300">
            <h3 className="text-lg font-extrabold text-blue-300">We Create <br /><span className="text-cyan-400">Digital Magic</span></h3>
            <p className="text-xs text-slate-400 mt-1">High-performance React components with cyber glow.</p>
            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 w-3/4 rounded-full animate-pulse" />
            </div>
          </div>

          <div className="hidden sm:flex lg:flex bg-[#0f0c1b]/80 backdrop-blur-md rounded-2xl p-4 border border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.2)] items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-950/60 border border-pink-500/40 text-pink-400">
              <Smartphone size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-pink-200">Mobile Ready</p>
              <p className="text-[10px] text-slate-400">Ultra responsive layouts</p>
            </div>
          </div>
        </div>

        {/* CENTER MAIN HERO */}
        <div className="lg:col-span-6 bg-[#0a0817]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-orange-500/60 shadow-[0_0_40px_rgba(249,115,22,0.3)] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_#ef4444]" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_#eab308]" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_#22c55e]" />
            </div>
            <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/30">
              <Sparkles size={13} className="text-orange-400" /> Cyber Edition 2026
            </div>
          </div>

          <div className="space-y-5 my-auto">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Build Stunning <br />
              <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                Web Experiences
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-md leading-relaxed">
              Elevate your e-commerce ecosystem with cosmic aesthetics, ultra-fast rendering, and interactive neon component libraries.
            </p>

            <div className="pt-2">
              <Link 
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(249,115,22,0.6)] hover:scale-105 transition duration-300"
              >
                Get Started Now <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-800/80">
            <div className="bg-slate-900/60 border border-orange-500/30 rounded-xl p-2.5 flex items-center gap-2">
              <Zap size={18} className="text-orange-400" />
              <div>
                <p className="text-[10px] text-slate-400">Speed</p>
                <p className="text-xs font-bold text-white">Ultra Fast</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-purple-500/30 rounded-xl p-2.5 flex items-center gap-2">
              <Diamond size={18} className="text-purple-400" />
              <div>
                <p className="text-[10px] text-slate-400">Design</p>
                <p className="text-xs font-bold text-white">Premium UI</p>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-cyan-500/30 rounded-xl p-2.5 flex items-center gap-2">
              <Rocket size={18} className="text-cyan-400" />
              <div>
                <p className="text-[10px] text-slate-400">Deploy</p>
                <p className="text-xs font-bold text-white">Instant</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-5 justify-between">
          <div className="flex-1 bg-[#0f0c1b]/80 backdrop-blur-md rounded-2xl p-5 border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-purple-500/30">
                <p className="text-lg font-black text-orange-400">120+</p>
                <p className="text-[9px] text-slate-400 uppercase">Ui Kits</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-purple-500/30">
                <p className="text-lg font-black text-purple-400">2.5K</p>
                <p className="text-[9px] text-slate-400 uppercase">Users</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-purple-500/30">
                <p className="text-lg font-black text-pink-400">98%</p>
                <p className="text-[9px] text-slate-400 uppercase">Score</p>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-[#0f0c1b]/80 backdrop-blur-md rounded-2xl p-5 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <div className="h-20 bg-slate-900/80 rounded-xl mb-3 border border-cyan-500/20 flex items-center justify-center">
              <p className="text-xs font-bold text-cyan-300">⚡ 60 FPS Smooth Render</p>
            </div>
            <h4 className="text-sm font-bold text-slate-200">Crafted for Performance</h4>
            <button className="mt-2 w-full py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              View Benchmarks
            </button>
          </div>

          <div className="hidden sm:flex lg:flex bg-[#0f0c1b]/80 backdrop-blur-md rounded-2xl p-4 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-400">
              <Laptop size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-200">Desktop Optimized</p>
              <p className="text-[10px] text-slate-400">Seamless Dashboard UI</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// 2. MAIN HOME PAGE COMPONENT
export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('For You');
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const categories = [
    { name: 'For You', icon: ShoppingBag },
    { name: 'Fashion', icon: Shirt },
    { name: 'Mobiles', icon: Smartphone },
    { name: 'Electronics', icon: Tv },
    { name: 'Beauty', icon: Sparkles },
    { name: 'Home', icon: HomeIcon },
    { name: 'Appliances', icon: Tv },
    { name: 'Sports', icon: Dumbbell },
    { name: 'Furniture', icon: Armchair },
    { name: 'Books', icon: BookOpen },
    { name: '2 Wheelers', icon: Bike },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/products`);
        if (res.ok) {
          const data = await res.json();
          setProducts(Array.isArray(data) ? data : data.products || []);
        }
      } catch (error) {
        console.error("Products fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiUrl]);

  const handleSubCategoryClick = (category, sub) => {
    setHoveredCategory(null);
    navigate(`/products?category=${category.toLowerCase()}&subCategory=${encodeURIComponent(sub)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    setUser(null);
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  const filteredProducts = products.filter((product) => {
    const titleMatch = (product.title || product.name || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    const categoryMatch =
      selectedCategory === 'For You' ||
      (product.category || '').toLowerCase() === selectedCategory.toLowerCase();

    return titleMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-[#070714] text-slate-100 pb-12 font-sans">
      
      {/* HEADER NAVBAR */}
      <header className="bg-[#0c0a1d]/90 backdrop-blur-md sticky top-0 z-50 border-b border-purple-900/40 shadow-lg px-4 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <Link to="/" className="bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-black italic text-xl px-3 py-1 rounded-lg flex items-center gap-1 shadow-[0_0_15px_rgba(249,115,22,0.4)]">
              <span>LeloBhai</span>
            </Link>
            <div className="hidden sm:flex items-center bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-semibold text-purple-300 cursor-pointer transition">
              <span>✈️ Travel</span>
            </div>
          </div>

          <div className="relative w-full md:max-w-2xl">
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for Products, Brands and More"
              className="w-full bg-[#130f26] border border-purple-900/50 focus:border-orange-500 focus:bg-[#191433] rounded-xl pl-10 pr-10 py-2 text-sm text-slate-100 placeholder-slate-400 outline-none transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            
            {/* USER ACCOUNT / LOGIN DROPDOWN (FLIPKART STYLE) */}
            <div 
              className="relative py-2"
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-200 hover:text-orange-400">
                <User size={18} className="text-orange-400" /> 
                {user ? (user.name || 'Account') : 'Login'} 
                <ChevronDown size={14} className={`transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* DROPDOWN MENU */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full bg-[#0f0c1b] border border-purple-900/60 rounded-2xl shadow-2xl w-60 py-3 z-50 mt-1 backdrop-blur-xl divide-y divide-purple-900/30 text-slate-200">
                  
                  {/* Top Signup / Profile Header */}
                  <div className="px-4 pb-2.5 flex items-center justify-between">
                    {!user ? (
                      <p className="text-xs text-slate-400">
                        New customer?{' '}
                        <Link to="/signup" className="text-orange-400 font-bold hover:underline">
                          Sign Up
                        </Link>
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400">
                        Logged in as <span className="text-orange-400 font-bold">{user.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Menu Options List */}
                  <div className="py-2 space-y-0.5">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-orange-400 transition">
                      <User size={16} className="text-purple-400" /> My Profile
                    </Link>

                    <Link to="/plus-zone" className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-amber-400 transition">
                      <Sparkles size={16} className="text-amber-400" /> LeloBhai Plus Zone
                    </Link>

                    <Link to="/orders" className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-orange-400 transition">
                      <Package size={16} className="text-orange-400" /> Orders
                    </Link>

                    <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-pink-400 transition">
                      <Heart size={16} className="text-pink-500" /> Wishlist
                    </Link>

                    <Link to="/supplier-dashboard" className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-cyan-400 transition">
                      <Store size={16} className="text-cyan-400" /> Become a Seller
                    </Link>

                    <Link to="/rewards" className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-yellow-400 transition">
                      <Gift size={16} className="text-yellow-400" /> Rewards
                    </Link>

                    <Link to="/gift-cards" className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-blue-400 transition">
                      <CreditCard size={16} className="text-blue-400" /> Gift Cards
                    </Link>

                    <Link to="/notifications" className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-orange-400 transition">
                      <Bell size={16} className="text-orange-400" /> Notification Preferences
                    </Link>

                    <Link to="/customer-care" className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-green-400 transition">
                      <Headphones size={16} className="text-green-400" /> 24x7 Customer Care
                    </Link>

                    <Link to="/advertise" className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-indigo-400 transition">
                      <TrendingUp size={16} className="text-indigo-400" /> Advertise
                    </Link>

                    <Link to="/download-app" className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-teal-400 transition">
                      <Download size={16} className="text-teal-400" /> Download App
                    </Link>
                  </div>

                  {/* Logout Button if Logged In */}
                  {user && (
                    <div className="pt-2">
                      <button 
                        onClick={handleLogout} 
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-xs text-red-400 font-bold hover:bg-red-950/30 transition"
                      >
                        <X size={16} className="text-red-400" /> Logout
                      </button>
                    </div>
                  )}

                </div>
              )}
            </div>

            <Link to="/cart" className="flex items-center gap-1 font-semibold text-slate-200 hover:text-cyan-400 relative">
              <ShoppingCart size={18} /> Cart
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full absolute -top-2 -right-3 shadow-[0_0_8px_#ef4444]">
                8
              </span>
            </Link>
          </div>

        </div>
      </header>

      {/* CATEGORIES BAR */}
      <div className="bg-[#0a0817] border-b border-purple-900/30 overflow-visible">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between min-w-max gap-4 sm:gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.name;
            const hasSub = CATEGORY_MAP[cat.name];

            return (
              <div 
                key={idx}
                className="relative group"
                onMouseEnter={() => setHoveredCategory(cat.name)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <button
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex flex-col items-center gap-1 transition cursor-pointer ${
                    isActive ? 'border-b-2 border-orange-500 pb-1 text-orange-400 font-bold' : 'text-slate-300 hover:text-cyan-400'
                  }`}
                >
                  <div className="p-1">
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-medium">
                    {cat.name}
                  </span>
                </button>

                {hoveredCategory === cat.name && hasSub && (
                  <div className="absolute top-full left-0 bg-[#0f0c1b] border border-purple-900/60 rounded-xl shadow-2xl py-2 min-w-[170px] z-50 mt-1">
                    {hasSub.map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        onClick={() => handleSubCategoryClick(cat.name, sub)}
                        className="px-4 py-2 text-xs font-medium text-slate-300 hover:bg-purple-900/40 hover:text-orange-400 cursor-pointer transition"
                      >
                        {sub}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* HERO SECTION */}
      <InlineHeroSection />

      {/* PRODUCTS SECTION */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 space-y-6 mt-6">
        <div className="bg-[#0a0817] border border-orange-500/40 rounded-3xl p-5 sm:p-6 shadow-[0_0_30px_rgba(249,115,22,0.2)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-lg sm:text-xl font-bold">
              {user ? `${user.name || 'User'}, still looking for these?` : 'Featured Products'}
            </h2>
            <Link to="/products" className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition shadow-[0_0_12px_rgba(249,115,22,0.5)]">
              <ChevronRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10 text-slate-400 font-medium">Loading products...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {filteredProducts.slice(0, 5).map((item) => (
                <Link 
                  to={`/product/${item._id || item.id}`} 
                  key={item._id || item.id} 
                  className="bg-[#0f0c1b] border border-purple-900/40 rounded-2xl p-4 shadow hover:border-orange-500/60 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition duration-300 flex flex-col items-center group cursor-pointer"
                >
                  <div className="h-32 w-full bg-slate-900/60 rounded-xl overflow-hidden mb-3 flex items-center justify-center p-2">
                    <img 
                      src={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400'} 
                      alt={item.title || item.name} 
                      className="h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm text-center line-clamp-1">{item.title || item.name}</h4>
                  <p className="text-xs text-cyan-400 font-semibold mt-1">View Store</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-[#0f0c1b] rounded-2xl p-8 text-center border border-purple-900/40">
              <p className="text-slate-400 font-medium">No products found!</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('For You'); }}
                className="mt-3 text-xs bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
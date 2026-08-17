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
  TrendingUp,
  Zap,
  Award
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

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search, Category & Hover States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('For You');
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

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

  // Auth & Products Load
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
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-12 font-sans">
      
      {/* 1. TOP HEADER */}
      <header className="bg-white sticky top-0 z-50 border-b border-slate-200 shadow-sm px-4 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <Link to="/" className="bg-yellow-400 text-blue-900 font-extrabold italic text-xl px-3 py-1 rounded flex items-center gap-1 shadow-sm">
              <span>LeloBhai</span>
            </Link>
            <div className="hidden sm:flex items-center bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full text-xs font-semibold text-slate-700 cursor-pointer transition">
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
              className="w-full bg-blue-50/60 border border-transparent focus:border-blue-400 focus:bg-white rounded-lg pl-10 pr-10 py-2 text-sm text-slate-800 outline-none transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <div className="flex flex-col text-xs cursor-pointer leading-tight">
              <span className="text-slate-400">Location not set</span>
              <span className="text-blue-600 font-bold hover:underline">Select delivery location &gt;</span>
            </div>

            {user ? (
              <div 
                className="relative"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-blue-600">
                  <User size={18} /> {user.name || 'User'} <ChevronDown size={14} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full bg-white border border-slate-200 rounded-xl shadow-xl w-48 py-2 z-50 mt-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">My Profile</Link>
                    <Link to="/supplier-dashboard" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Seller Dashboard</Link>
                    <hr className="my-1 border-slate-100" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-blue-600 text-white font-bold px-6 py-1.5 rounded hover:bg-blue-700 transition text-sm">
                Login
              </Link>
            )}

            <div className="relative" onMouseLeave={() => setIsMoreOpen(false)}>
              <button
                onMouseEnter={() => setIsMoreOpen(true)}
                className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-blue-600 py-1"
              >
                More <ChevronDown size={14} />
              </button>

              {isMoreOpen && (
                <div className="absolute right-0 w-52 bg-white border border-slate-200 shadow-xl rounded-md py-2 text-slate-700 text-sm z-50">
                  <Link to="/orders" className="block px-4 py-2 hover:bg-slate-100">📦 Orders</Link>
                  <Link to="/wishlist" className="block px-4 py-2 hover:bg-slate-100">❤️ Wishlist</Link>
                  <Link to="/lelobhai-zone" className="block px-4 py-2 hover:bg-slate-100">✨ LeloBhai Zone</Link>
                  <Link to="/supplier-dashboard" className="block px-4 py-2 hover:bg-slate-100">🏪 Become a Seller</Link>
                  <Link to="/customer-care" className="block px-4 py-2 hover:bg-slate-100">🎧 Customer Care</Link>
                </div>
              )}
            </div>

            <Link to="/cart" className="flex items-center gap-1 font-semibold text-slate-700 hover:text-blue-600 relative">
              <ShoppingCart size={18} /> Cart
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full absolute -top-2 -right-3">
                8
              </span>
            </Link>
          </div>

        </div>
      </header>

      {/* 2. CATEGORIES BAR */}
      <div className="bg-white border-b border-slate-200 shadow-sm overflow-visible">
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
                    isActive ? 'border-b-2 border-blue-600 pb-1 text-blue-600 font-bold' : 'text-slate-700 hover:text-blue-600'
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
                  <div className="absolute top-full left-0 bg-white border border-slate-200 rounded-lg shadow-xl py-2 min-w-[170px] z-50 mt-1">
                    {hasSub.map((sub, sIdx) => (
                      <div
                        key={sIdx}
                        onClick={() => handleSubCategoryClick(cat.name, sub)}
                        className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-blue-600 cursor-pointer transition"
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

      {/* 3. HERO SECTION (INLINE EMBEDDED) */}
      <section className="bg-slate-950 text-white py-12 px-4 relative overflow-hidden my-4 max-w-7xl mx-auto rounded-3xl border border-slate-800 shadow-2xl">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-semibold">
              <Zap size={14} className="animate-pulse" /> Exclusive Deals Live Now
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Elevate Your <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                Shopping Style
              </span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base max-w-lg leading-relaxed">
              Discover top-rated tech, premium fashion, and home essentials with ultra-fast delivery and unbeatable offers.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link 
                to="/products" 
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:opacity-90 transition transform hover:-translate-y-0.5"
              >
                Shop Trends
              </Link>
              <Link 
                to="/lelobhai-zone" 
                className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-bold text-sm hover:bg-slate-800 transition"
              >
                Explore Deals
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-cyan-400" />
                <div>
                  <p className="text-xs text-slate-400">Best Prices</p>
                  <p className="text-sm font-bold text-white">Guaranteed</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award size={18} className="text-indigo-400" />
                <div>
                  <p className="text-xs text-slate-400">Top Brands</p>
                  <p className="text-sm font-bold text-white">100% Authentic</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-sky-400" />
                <div>
                  <p className="text-xs text-slate-400">Express Delivery</p>
                  <p className="text-sm font-bold text-white">Same Day</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold text-slate-400">🔥 Trending Choice</span>
                <span className="text-xs bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded-md font-bold">30% OFF</span>
              </div>
              <div className="h-48 bg-slate-900/80 rounded-xl flex items-center justify-center p-4">
                <img 
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" 
                  alt="Hero Promo Product" 
                  className="h-full object-contain hover:scale-105 transition duration-500"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Wireless Noise-Canceling Headphones</h3>
                <p className="text-xs text-slate-400 mt-1">Immersive sound experience with 40h battery life.</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-lg font-bold text-cyan-400">₹2,999</span>
                  <span className="text-xs text-slate-500 line-through ml-2">₹4,999</span>
                </div>
                <Link to="/products" className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1">
                  Grab Deal <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 space-y-6 mt-4">

        {/* 4. PROMO BANNERS */}
        {!searchQuery && selectedCategory === 'For You' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-5 flex flex-col justify-between h-44 shadow-sm">
              <div>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-bold uppercase">AD</span>
                <h2 className="text-2xl font-black mt-1">ZEAL 2.0</h2>
                <p className="text-sm text-slate-300 font-bold">From ₹4,999</p>
              </div>
              <span className="text-xs text-slate-400">1.85" AMOLED | 60 Hz refresh rate</span>
            </div>

            <div className="bg-amber-100 text-slate-800 rounded-xl p-5 flex flex-col justify-between h-44 shadow-sm">
              <div>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold uppercase">AD</span>
                <h2 className="text-2xl font-bold mt-1">The CTM Ritual</h2>
                <p className="text-sm text-slate-600">Restore your skin health</p>
              </div>
              <button className="bg-slate-900 text-white px-4 py-1.5 rounded-md text-xs font-bold w-max">Shop now</button>
            </div>

            <div className="bg-purple-100 text-purple-900 rounded-xl p-5 flex flex-col justify-between h-44 shadow-sm">
              <div>
                <h2 className="text-2xl font-bold mt-2">Sulfate-free frizz</h2>
                <p className="text-sm text-purple-700">Nourishing smoothness all day</p>
              </div>
              <button className="bg-purple-700 text-white px-4 py-1.5 rounded-md text-xs font-bold w-max">Shop now</button>
            </div>
          </div>
        )}

        {/* 5. RECOMMENDATION SECTION */}
        <div className="bg-orange-500 rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-lg sm:text-xl font-bold">
              {user ? `${user.name || 'User'}, still looking for these?` : 'Still looking for these?'}
            </h2>
            <Link to="/products" className="bg-white text-orange-600 p-2 rounded-full hover:bg-orange-50 transition shadow">
              <ChevronRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10 text-white font-medium">Loading products...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {filteredProducts.slice(0, 5).map((item) => (
                <Link 
                  to={`/product/${item._id || item.id}`} 
                  key={item._id || item.id} 
                  className="bg-white rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col items-center group cursor-pointer"
                >
                  <div className="h-32 w-full bg-slate-50 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                    <img 
                      src={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400'} 
                      alt={item.title || item.name} 
                      className="h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm text-center line-clamp-1">{item.title || item.name}</h4>
                  <p className="text-xs text-blue-600 font-semibold mt-1">View Store</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center">
              <p className="text-slate-600 font-medium">Koi product nahi mila!</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('For You'); }}
                className="mt-3 text-xs bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                Reset Search & Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
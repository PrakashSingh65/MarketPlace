import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  User, 
  ChevronDown, 
  ShoppingCart, 
  ArrowRight,
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
  X
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
  
  // 🔍 Search, Category & Hover States
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

  // Handle SubCategory Click
  const handleSubCategoryClick = (category, sub) => {
    setHoveredCategory(null);
    navigate(`/products?category=${category.toLowerCase()}&subCategory=${encodeURIComponent(sub)}`);
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    setUser(null);
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  // Live Filter Logic
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
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-12">
      
      {/* 1. TOP HEADER SECTION */}
      <header className="bg-white sticky top-0 z-50 border-b border-slate-200 shadow-sm px-4 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <Link to="/" className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200">
              <span className="bg-yellow-400 font-bold text-slate-900 px-4 py-1.5 rounded-full text-xs shadow-sm flex items-center gap-1">
                🛒 TexMarket
              </span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:max-w-2xl">
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for Products, Brands and More"
              className="w-full bg-sky-50/50 border border-sky-200 rounded-lg pl-10 pr-10 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
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

          {/* User Auth & Actions */}
          <div className="hidden lg:flex items-center gap-6">
            {user ? (
              <div 
                className="relative"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                  <User size={18} /> Hi, {user.name || 'Account'} <ChevronDown size={14} />
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
              <Link to="/login" className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-indigo-600">
                <User size={18} /> Login <ChevronDown size={14} />
              </Link>
            )}

            <Link to="/cart" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-indigo-600">
              <ShoppingCart size={18} /> Cart
            </Link>
          </div>

        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 space-y-4 mt-3">

        {/* 2. CATEGORIES HOVER BAR WITH FLIPKART STYLE DROPDOWN */}
        <div className="bg-white rounded-xl shadow-sm p-3 border border-slate-200/80 overflow-visible relative">
          <div className="flex items-center justify-between min-w-max gap-4 sm:gap-6 px-2">
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
                    className={`flex flex-col items-center gap-1.5 transition cursor-pointer ${
                      isActive ? 'border-b-2 border-indigo-600 pb-1' : ''
                    }`}
                  >
                    <div className={`p-2 rounded-xl transition ${
                      isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-600 group-hover:bg-slate-100 group-hover:text-indigo-600'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <span className={`text-[11px] font-medium ${isActive ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}>
                      {cat.name}
                    </span>
                  </button>

                  {/* Sub-Category Dropdown */}
                  {hoveredCategory === cat.name && hasSub && (
                    <div className="absolute top-full left-0 bg-white border border-slate-200 rounded-lg shadow-xl py-2 min-w-[170px] z-50 mt-1">
                      {hasSub.map((sub, sIdx) => (
                        <div
                          key={sIdx}
                          onClick={() => handleSubCategoryClick(cat.name, sub)}
                          className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-indigo-600 cursor-pointer transition"
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

        {/* 3. PROMO BANNERS */}
        {!searchQuery && selectedCategory === 'For You' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-sky-100 to-indigo-100 rounded-2xl p-5 border border-sky-200 relative overflow-hidden flex justify-between items-center min-h-[160px]">
              <div>
                <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">Freedom Sale</span>
                <h3 className="text-xl font-black text-slate-900 mt-2">NOTHING (R)</h3>
                <p className="text-sm font-bold text-slate-700">Phone (2a) <br/><span className="text-base text-indigo-700">From ₹23,999*</span></p>
              </div>
              <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300" alt="Phone" className="w-24 h-32 object-cover rounded-lg shadow-md rotate-6" />
            </div>

            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-5 border border-purple-200 relative overflow-hidden flex justify-between items-center min-h-[160px]">
              <div>
                <span className="bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">Sale is Live</span>
                <h3 className="text-xl font-black text-slate-900 mt-2">vivo T3 5G</h3>
                <p className="text-sm font-bold text-slate-700">44W Fast Charge <br/><span className="text-base text-purple-700">Just ₹15,999*</span></p>
              </div>
              <img src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300" alt="Vivo Phone" className="w-24 h-32 object-cover rounded-lg shadow-md -rotate-3" />
            </div>

            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-5 border border-amber-200 relative overflow-hidden flex justify-between items-center min-h-[160px]">
              <div>
                <span className="bg-amber-600 text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">Exclusive</span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Smart TVs</h3>
                <p className="text-sm font-bold text-slate-700">4K Ultra HD <br/><span className="text-base text-amber-800">Just ₹9,119*</span></p>
              </div>
              <img src="https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300" alt="Smart TV" className="w-28 h-28 object-cover rounded-lg shadow-md" />
            </div>
          </div>
        )}

        {/* 4. DYNAMIC PRODUCTS DISPLAY SECTION */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              {searchQuery 
                ? `Search Results for "${searchQuery}"` 
                : selectedCategory === 'For You' 
                  ? 'Best Deals on Marketplace' 
                  : `${selectedCategory} Products`}
            </h2>
            <Link to="/products" className="bg-black text-white p-2 rounded-full hover:bg-slate-800 transition">
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10 text-slate-500 font-medium">Loading products...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((item) => (
                <Link 
                  to={`/product/${item._id || item.id}`} 
                  key={item._id || item.id} 
                  className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between group cursor-pointer"
                >
                  <div className="aspect-square bg-slate-50 rounded-lg overflow-hidden mb-3">
                    <img 
                      src={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400'} 
                      alt={item.title || item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-slate-800 text-sm line-clamp-1">{item.title || item.name}</h4>
                    <p className="text-emerald-600 font-bold text-xs mt-1">₹{item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
              <p className="text-slate-600 font-medium">Koi product nahi mila!</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('For You'); }}
                className="mt-3 text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
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
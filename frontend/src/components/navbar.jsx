import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function Navbar() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem('token');

  const currentCategory = searchParams.get('category')?.toLowerCase() || 'for you';

  // Dynamic Cart Items Count Sync
  useEffect(() => {
    if (!token) {
      setCartCount(0);
      return;
    }

    const updateCartCount = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCartCount(Array.isArray(parsedCart) ? parsedCart.length : 0);
        } catch {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, [token]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryClick = (categoryLabel) => {
    const formattedCategory = categoryLabel.toLowerCase();
    if (formattedCategory === 'for you') {
      navigate('/');
    } else {
      navigate(`/products?category=${encodeURIComponent(formattedCategory)}`);
    }
  };

  const categories = [
    { icon: "🎁", label: "For You" },
    { icon: "👕", label: "Fashion" },
    { icon: "📱", label: "Mobiles" },
    { icon: "💻", label: "Electronics" },
    { icon: "💄", label: "Beauty" },
    { icon: "🛋️", label: "Home" },
    { icon: "📺", label: "Appliances" },
    { icon: "🧸", label: "Toys & More" },
    { icon: "🥣", label: "Food & Health" },
    { icon: "🛵", label: "2 Wheelers" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 text-gray-800 text-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4 md:gap-6">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            className="bg-yellow-400 text-blue-900 font-extrabold italic text-xl px-3 py-1 rounded flex items-center gap-1 shadow-sm hover:opacity-95 transition"
          >
            <span>LeloBhai</span>
          </Link>

          <div 
            onClick={() => navigate('/travel')}
            className="hidden md:flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-xs cursor-pointer font-medium text-gray-700 transition"
          >
            <span>✈️ Travel</span>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for Products, Brands and More"
            className="w-full bg-blue-50/60 border border-transparent focus:border-blue-400 focus:bg-white text-gray-900 pl-10 pr-10 py-2 rounded-md outline-none text-sm transition placeholder-gray-500"
          />
          <button type="submit" className="absolute left-3 top-2.5 text-gray-400 text-base">
            🔍
          </button>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden lg:flex flex-col text-xs cursor-pointer leading-tight">
            <span className="text-gray-400">Location not set</span>
            <span className="text-blue-600 font-bold hover:underline">Select delivery location &gt;</span>
          </div>

          {!token ? (
            <Link 
              to="/login" 
              className="bg-blue-600 text-white font-bold px-6 py-1.5 rounded hover:bg-blue-700 transition"
            >
              Login
            </Link>
          ) : (
            <Link 
              to="/profile" 
              className="flex items-center gap-1 font-semibold text-gray-700 hover:text-blue-600 transition"
            >
              👤 Profile <span className="text-xs">▾</span>
            </Link>
          )}

          {/* More Dropdown */}
          <div className="relative" onMouseLeave={() => setIsMoreOpen(false)}>
            <button
              onMouseEnter={() => setIsMoreOpen(true)}
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className="flex items-center gap-1 font-medium text-gray-700 hover:text-blue-600 py-2 transition"
            >
              More <span className="text-xs">▾</span>
            </button>

            {isMoreOpen && (
              <div className="absolute right-0 w-56 bg-white border border-gray-200 shadow-xl rounded-md py-2 text-gray-700 text-sm z-50">
                {!token && (
                  <div className="px-4 py-2 border-b border-gray-100 text-xs text-gray-500">
                    New customer?{' '}
                    <Link to="/register" className="text-blue-600 font-bold hover:underline">
                      Sign Up
                    </Link>
                  </div>
                )}
                <Link to="/orders" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition">📦 Orders</Link>
                <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition">❤️ Wishlist</Link>
                <Link to="/customer-care" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition">🎧 Customer Care</Link>
              </div>
            )}
          </div>

          {/* Dynamic Cart Icon */}
          <Link to="/cart" className="flex items-center gap-1 font-semibold text-gray-700 hover:text-blue-600 relative transition">
            🛒 Cart
            {token && cartCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full absolute -top-2 -right-3">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Category Sub-Bar */}
      <div className="border-t border-gray-100 bg-white overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6 min-w-max text-xs text-gray-700 font-medium">
          {categories.map((cat, idx) => {
            const isActive = currentCategory === cat.label.toLowerCase();

            return (
              <button
                key={idx}
                onClick={() => handleCategoryClick(cat.label)}
                className={`flex flex-col items-center gap-1 cursor-pointer transition focus:outline-none group ${
                  isActive 
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1 font-bold' 
                    : 'hover:text-blue-600'
                }`}
              >
                <span className="text-lg group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
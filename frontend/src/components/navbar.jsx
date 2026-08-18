import React, { useState, useEffect } from 'react';
import { 
  Search, User, ChevronDown, ShoppingCart, X, Package, 
  Heart, Store, Gift, CreditCard, Bell, Headphones, TrendingUp, Download, Sparkles 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ searchQuery, setSearchQuery }) {
  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    setUser(null);
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="bg-[#0c0a1d]/90 backdrop-blur-md sticky top-0 z-50 border-b border-purple-900/40 shadow-lg px-4 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand Logo & Travel Tag */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <Link to="/" className="bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-black italic text-xl px-3 py-1 rounded-lg flex items-center gap-1 shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            <span>LeloBhai</span>
          </Link>
          <div className="hidden sm:flex items-center bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-semibold text-purple-300 cursor-pointer transition">
            <span>✈️ Travel</span>
          </div>
        </div>

        {/* Search Input */}
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
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Right Menu Options */}
        <div className="hidden lg:flex items-center gap-6">
          
          {/* User Account / Login Dropdown */}
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

            {/* Dropdown Options */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full bg-[#0f0c1b] border border-purple-900/60 rounded-2xl shadow-2xl w-60 py-3 z-50 mt-1 backdrop-blur-xl divide-y divide-purple-900/30 text-slate-200">
                <div className="px-4 pb-2.5 flex items-center justify-between">
                  {!user ? (
                    <p className="text-xs text-slate-400">
                      New customer? <Link to="/signup" className="text-orange-400 font-bold hover:underline">Sign Up</Link>
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Logged in as <span className="text-orange-400 font-bold">{user.name}</span>
                    </p>
                  )}
                </div>

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

                {user && (
                  <div className="pt-2">
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-xs text-red-400 font-bold hover:bg-red-950/30 transition">
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
  );
}
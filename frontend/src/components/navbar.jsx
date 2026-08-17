import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="text-2xl font-extrabold text-indigo-500 tracking-wide">
          LeloBhai
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-lg flex items-center">
          <input
            type="text"
            placeholder="Search for Products, Brands and More"
            className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-l-md text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-r-md text-sm font-semibold transition">
            Search
          </button>
        </div>

        {/* Right Menu Links */}
        <div className="flex items-center gap-6 text-sm font-medium">
          {!token ? (
            <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-md text-white transition">
              Login
            </Link>
          ) : (
            <Link to="/profile" className="hover:text-indigo-400 transition">
              My Account
            </Link>
          )}

          {/* More Dropdown */}
          <div className="relative" onMouseLeave={() => setIsDropdownOpen(false)}>
            <button
              onMouseEnter={() => setIsDropdownOpen(true)}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 hover:text-indigo-400 py-2 transition"
            >
              More <span>▾</span>
            </button>

            {isDropdownOpen && (
              <div 
                className="absolute right-0 w-56 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-2 z-50 text-slate-200 text-sm"
                onMouseEnter={() => setIsDropdownOpen(true)}
              >
                <div className="px-4 py-2 border-b border-slate-800 text-xs text-slate-400">
                  New customer?{' '}
                  <Link to="/register" className="text-indigo-400 font-bold hover:underline">
                    Sign Up
                  </Link>
                </div>

                <Link to="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 transition">
                  👤 My Profile
                </Link>
                <Link to="/lelobhai-zone" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 transition">
                  ✨ LeloBhai Plus Zone
                </Link>
                <Link to="/orders" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 transition">
                  📦 Orders
                </Link>
                <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 transition">
                  ❤️ Wishlist
                </Link>
                <Link to="/supplier-dashboard" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 transition">
                  🏪 Become a Seller
                </Link>
                <Link to="/rewards" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 transition">
                  🎁 Rewards
                </Link>
                <Link to="/gift-cards" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 transition">
                  💳 Gift Cards
                </Link>
                <Link to="/notifications" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 transition">
                  🔔 Notification Preferences
                </Link>
                <Link to="/customer-care" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 transition">
                  🎧 24x7 Customer Care
                </Link>
                <Link to="/advertise" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 transition">
                  📺 Advertise
                </Link>
                <Link to="/download-app" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 transition">
                  📲 Download App
                </Link>
              </div>
            )}
          </div>

          <Link to="/cart" className="hover:text-indigo-400 transition">
            🛒 Cart
          </Link>
        </div>
      </div>
    </header>
  );
}
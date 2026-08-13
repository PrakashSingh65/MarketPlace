import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, ShieldCheck } from 'lucide-react';
import { CartContext } from '../context/cartContext';
import { AuthContext } from '../context/AuthContext'; // Agar AuthContext configured hai

export default function Navbar() {
  const { totalItems } = useContext(CartContext) || { totalItems: 0 };
  const { token, logout } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <ShoppingBag size={22} />
            </div>
            <div>
              <span className="text-xl font-black text-indigo-950 tracking-tight">
                TexMarket<span className="text-indigo-600">.b2b</span>
              </span>
              <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase -mt-1">
                Verified Textile Hub
              </p>
            </div>
          </Link>

          {/* Navigation Links (Categories aur How it Works yahan se hata diye gaye hain) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/marketplace"
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
            >
              Marketplace
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-4">
            {/* Supplier Portal Button */}
            <Link
              to="/supplier-dashboard"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full hover:bg-indigo-100 transition"
            >
              <ShieldCheck size={16} /> Supplier Portal
            </Link>

            {/* Cart Icon & Badge */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-700 hover:text-indigo-600 transition rounded-xl hover:bg-slate-100"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Profile / Auth State */}
            {token ? (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm font-medium text-rose-600 hover:text-rose-700 transition cursor-pointer"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3 py-1.5 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-slate-900 hover:bg-indigo-600 px-4 py-2 rounded-xl transition shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
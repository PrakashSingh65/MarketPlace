import { useState, useContext } from "react";
import {
  ShoppingBag,
  Menu,
  X,
  User,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/cartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <ShoppingBag size={22} />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight block">
                TexMarket<span className="text-indigo-600">.b2b</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block -mt-1">
                Verified Textile Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-slate-600 text-sm">
            <Link
              to="/marketplace"
              className="text-slate-900 font-semibold hover:text-indigo-600 transition"
            >
              Marketplace
            </Link>
            <a href="#categories" className="hover:text-indigo-600 transition">
              Categories
            </a>
            <a
              href="#how-it-works"
              className="hover:text-indigo-600 transition"
            >
              How it Works
            </a>
            <div className="h-4 w-px bg-slate-200"></div>
            <Link
              to="/supplier-dashboard"
              className="text-indigo-600 bg-indigo-50/80 hover:bg-indigo-100 px-4 py-2 rounded-full font-semibold border border-indigo-100 transition flex items-center gap-1.5"
            >
              <ShieldCheck size={16} /> Supplier Portal
            </Link>

            {/* 🔒 CART ICON: Sirf tabhi dikhega jab user Logged In hoga */}
            {user && (
              <Link
                to="/cart"
                className="relative text-slate-600 hover:text-indigo-600 p-2 transition"
                title="View Cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* Action Buttons (Right Side) */}
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 px-3 py-2 text-sm font-semibold transition"
              >
                <User size={18} /> {user.name || "Profile"}
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 hover:bg-rose-50 px-3 py-2 rounded-xl text-sm font-semibold transition"
                title="Logout"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 px-4 py-2 text-sm font-semibold transition"
              >
                <User size={18} /> Sign In
              </Link>
              <Link
                to="/register"
                className="bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-indigo-200 transition duration-200"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile me bhi Cart icon tabhi dikhega jab logged in ho */}
            {user && (
              <Link to="/cart" className="relative text-slate-600 p-2">
                <ShoppingBag size={22} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 p-2 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <Link
            to="/marketplace"
            onClick={() => setIsOpen(false)}
            className="block text-slate-800 font-semibold py-1"
          >
            Marketplace
          </Link>
          <a
            href="#categories"
            onClick={() => setIsOpen(false)}
            className="block text-slate-600 py-1"
          >
            Categories
          </a>
          <Link
            to="/supplier-dashboard"
            onClick={() => setIsOpen(false)}
            className="block text-indigo-600 font-semibold py-1"
          >
            Supplier Portal
          </Link>

          {/* Mobile Drawer - Conditional Cart Link */}
          {user && (
            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="block text-slate-700 font-semibold py-1 flex items-center justify-between"
            >
              <span>Shopping Cart</span>
              <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full font-bold">
                {totalItems} Items
              </span>
            </Link>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 text-slate-700 font-semibold rounded-xl border flex items-center justify-center gap-2"
                >
                  <User size={18} /> My Profile
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full text-center py-2.5 bg-rose-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 text-slate-700 font-semibold rounded-xl border"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 bg-indigo-600 text-white font-semibold rounded-xl"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
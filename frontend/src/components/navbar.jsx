import { useState, useContext } from "react";
import {
  ShoppingBag,
  Menu,
  X,
  User,
  ArrowRight,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {CartContext} from "../context/CartContext";

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
              to="/"
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
          </div>

          {/* Action Button */}
          {user ? (
            <div>
              <button
                onClick={logout}
                className="text-slate-400 hover:text-red-400 p-2 transition"
                title="Logout"
              >
                <LogOut size={16} />
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
                sign up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
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
          <Link to="/" className="block text-slate-800 font-semibold py-1">
            Marketplace
          </Link>
          <a href="#categories" className="block text-slate-600 py-1">
            Categories
          </a>
          <Link
            to="/supplier-dashboard"
            className="block text-indigo-600 font-semibold py-1"
          >
            Supplier Portal
          </Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <Link
              to="/login"
              className="w-full text-center py-2.5 text-slate-700 font-semibold rounded-xl border"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="w-full text-center py-2.5 bg-indigo-600 text-white font-semibold rounded-xl"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

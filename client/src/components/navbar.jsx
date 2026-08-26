import React, { useState } from "react";
import {
  User,
  ChevronDown,
  Package,
  Heart,
  Store,
  Gift,
  CreditCard,
  Bell,
  Headphones,
  TrendingUp,
  Download,
  Sparkles,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useSignOut } from "../api/authApi"; // adjust path
import { logout } from "../redux/slice/authSlice";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutateAsync: signOut } = useSignOut();

  const handleLogout = async () => {
    try {
      await signOut();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 w-full px-4 py-3">
      {/* 1. Left: Logo & Travel Button */}
      <div className="flex items-center gap-3 shrink-0">
        <Link
          to="/"
          className="bg-linear-to-r from-orange-500 to-amber-400 text-slate-950 font-black italic text-xl px-3 py-1 rounded-lg flex items-center gap-1 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
        >
          <span>LeloBhai</span>
        </Link>
        <div className="hidden sm:flex items-center bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-semibold text-purple-300 cursor-pointer transition">
          <span>✈️ Travel</span>
        </div>
      </div>

      {/* 2. Middle: SearchBar */}
      <div className="flex-1 max-w-2xl px-2">
        <SearchBar />
      </div>

      {/* 3. Right: User Menu */}
      <div className="flex items-center gap-6 shrink-0">
        <div
          className="relative py-2"
          onMouseEnter={() => setIsUserMenuOpen(true)}
          onMouseLeave={() => setIsUserMenuOpen(false)}
        >
          <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-200 hover:text-orange-400">
            <User size={18} className="text-orange-400" />
            <span>{isAuthenticated ? user?.name || "Account" : "Login"}</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                isUserMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-full bg-[#0f0c1b] border border-purple-900/60 rounded-2xl shadow-2xl w-60 py-3 z-50 mt-1 backdrop-blur-xl divide-y divide-purple-900/30 text-slate-200">
              <div className="px-4 pb-2.5 flex items-center justify-between">
                {!isAuthenticated ? (
                  <p className="text-xs text-slate-400">
                    New customer?{" "}
                    <Link
                      to="/register"
                      className="text-orange-400 font-bold hover:underline"
                    >
                      Sign Up
                    </Link>
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 truncate">
                    Logged in as{" "}
                    <span className="text-orange-400 font-bold">
                      {user?.name}
                    </span>
                  </p>
                )}
              </div>

              <div className="py-2 space-y-0.5">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-orange-400 transition"
                >
                  <User size={16} className="text-purple-400" /> My Profile
                </Link>
                <Link
                  to="/plus-zone"
                  className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-amber-400 transition"
                >
                  <Sparkles size={16} className="text-amber-400" /> LeloBhai Plus Zone
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-orange-400 transition"
                >
                  <Package size={16} className="text-orange-400" /> Orders
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-pink-400 transition"
                >
                  <Heart size={16} className="text-pink-500" /> Wishlist
                </Link>
                <Link
                  to="/supplier-dashboard"
                  className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-cyan-400 transition"
                >
                  <Store size={16} className="text-cyan-400" /> Become a Seller
                </Link>
              </div>

              {isAuthenticated && (
                <div className="pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-xs text-red-400 font-bold hover:bg-red-950/30 transition"
                  >
                    <LogOut size={16} className="text-red-400" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
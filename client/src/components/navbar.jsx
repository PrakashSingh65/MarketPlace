import { useState } from "react";
import {
  User,
  ChevronDown,
  Package,
  Heart,
  Store,
  Sparkles,
  LogOut,
  ShoppingCart,
  Layers,
  Bot,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useSignOut } from "../api/authApi";
import { logout } from "../redux/slice/authSlice";
import SearchBar from "./SearchBar";

import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function Navbar() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Cart Count from Redux state: itemCount or items array length
  const cartItemCount = useSelector((state) => state.cart?.itemCount ?? 0);
  const cartItems = useSelector((state) => state.cart?.items || []);
  const totalCartCount = cartItemCount > 0 ? cartItemCount : cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync: signOut } = useSignOut();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("userInfo");
      dispatch(logout());
      queryClient.setQueryData(["user"], null);
      queryClient.removeQueries({ queryKey: ["user"] });
      setIsUserMenuOpen(false);
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  const closeMenu = () => setIsUserMenuOpen(false);

  const handleUserClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      setIsUserMenuOpen((prev) => !prev);
    }
  };

  return (
    <nav className="relative z-50 bg-[#0a0718] border-b border-purple-900/50 text-slate-200 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4 w-full px-3 sm:px-6 py-3">
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/"
            className="bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 text-slate-950 font-black italic text-xl sm:text-2xl px-3 py-1 rounded-xl flex items-center gap-1 shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-105 transition"
          >
            <span>LeloBhai</span>
          </Link>
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold">
            <Link
              to="/marketplace"
              className="bg-purple-950/60 hover:bg-purple-900/70 border border-purple-500/30 px-3 py-1.5 rounded-full text-purple-300 hover:text-white transition flex items-center gap-1"
            >
              <span>Marketplace</span>
            </Link>
            <Link
              to="/categories"
              className="bg-purple-950/60 hover:bg-purple-900/70 border border-purple-500/30 px-3 py-1.5 rounded-full text-purple-300 hover:text-white transition flex items-center gap-1"
            >
              <Layers size={13} className="text-amber-400" />
              <span>Categories</span>
            </Link>
            <Link
              to="/plus-zone"
              className="bg-gradient-to-r from-purple-900/40 to-orange-950/40 hover:border-orange-500/50 border border-purple-500/30 px-3 py-1.5 rounded-full text-amber-300 transition flex items-center gap-1"
            >
              <Sparkles size={13} className="text-orange-400" />
              <span>Plus Zone</span>
            </Link>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-assistant'))}
              className="bg-gradient-to-r from-orange-500/20 to-purple-600/20 hover:from-orange-500/30 hover:to-purple-600/30 border border-orange-500/40 hover:border-orange-400 px-3 py-1.5 rounded-full text-orange-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Ask AI Assistant anything about fabrics and platform"
            >
              <Bot size={13} className="text-orange-400 animate-pulse" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>

        <div className="flex-1 max-w-2xl px-2">
          <SearchBar />
        </div>

        <div className="flex items-center gap-6 shrink-0 relative">
          {/* User Account Dropdown Menu */}
          <div
            className="relative py-2"
            onMouseEnter={() => setIsUserMenuOpen(true)}
            onMouseLeave={() => setIsUserMenuOpen(false)}
          >
            <button 
              onClick={handleUserClick}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-200 hover:text-orange-400 cursor-pointer"
            >
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
                        onClick={closeMenu}
                        className="text-orange-400 font-bold hover:underline"
                      >
                        Sign Up
                      </Link>
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 truncate">
                      Logged in as{" "}
                      <span className="text-orange-400 font-bold block truncate">
                        {user?.name || user?.email}
                      </span>
                    </p>
                  )}
                </div>

                <div className="py-2 space-y-0.5">
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-orange-400 transition"
                  >
                    <User size={16} className="text-purple-400" /> My Profile
                  </Link>
                  <Link
                    to="/plus-zone"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-amber-400 transition"
                  >
                    <Sparkles size={16} className="text-amber-400" /> LeloBhai Plus Zone
                  </Link>
                  <Link
                    to="/orders"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-orange-400 transition"
                  >
                    <Package size={16} className="text-orange-400" /> Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-pink-400 transition"
                  >
                    <Heart size={16} className="text-pink-500" /> Wishlist
                  </Link>
                  <Link
                    to="/supplier-dashboard"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-2 text-xs hover:bg-purple-900/40 hover:text-cyan-400 transition"
                  >
                    <Store size={16} className="text-cyan-400" /> Become a Seller
                  </Link>
                </div>

                {isAuthenticated ? (
                  <div className="pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-3 px-4 py-2 text-xs text-red-400 font-bold hover:bg-red-950/30 transition cursor-pointer"
                    >
                      <LogOut size={16} className="text-red-400" /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 px-3">
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="w-full text-center block bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold py-1.5 rounded-lg text-xs transition"
                    >
                      Login
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart Icon Link Section */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 text-slate-200 hover:text-orange-400 transition py-2"
          >
            <div className="relative">
              <ShoppingCart size={22} className="text-orange-400" />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {totalCartCount > 9 ? "9+" : totalCartCount}
                </span>
              )}
            </div>
            <span className="hidden md:inline text-sm font-semibold">Cart</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
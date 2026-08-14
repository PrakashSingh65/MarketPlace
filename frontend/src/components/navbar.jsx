import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, ShoppingCart, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isSupplier = user?.role?.toUpperCase() === 'SUPPLIER';

  return (
    <nav className="bg-slate-900 border-b border-slate-800 py-3 px-6 flex items-center justify-between text-white">
      <Link to="/" className="text-xl font-bold text-indigo-400">
        Marketplace
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium">
        <Link to="/marketplace" className="hover:text-indigo-400 transition">Marketplace</Link>
        <Link to="/cart" className="hover:text-indigo-400 transition flex items-center gap-1">
          <ShoppingCart size={16} /> Cart
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            {/* Dashboard Link Based on Role */}
            <Link
              to={isSupplier ? "/supplier-dashboard" : "/buyer-dashboard"}
              className="bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-indigo-600 hover:text-white transition"
            >
              <LayoutDashboard size={14} />
              {isSupplier ? "Supplier Panel" : "Buyer Panel"}
            </Link>

            <span className="text-xs text-slate-400">
              {user.name || user.email}
            </span>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="hover:text-indigo-400 transition">Login</Link>
            <Link to="/register" className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg text-xs font-bold transition">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
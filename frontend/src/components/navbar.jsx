import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User, ShoppingCart } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
            <span className="text-xs bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-indigo-300">
              {user.name || user.email} ({user.role || 'USER'})
            </span>
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
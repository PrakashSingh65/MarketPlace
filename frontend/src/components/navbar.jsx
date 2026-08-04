import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingBag, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold flex items-center gap-2 text-indigo-400">
        <ShoppingBag /> TexMarket B2B
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-indigo-300 transition">Marketplace</Link>

        {user ? (
          <>
            <div className="flex items-center gap-3 bg-slate-800 px-3 py-1.5 rounded-lg">
              <User size={18} />
              <span className="text-sm">{user.name}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-sm transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-indigo-300">Login</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
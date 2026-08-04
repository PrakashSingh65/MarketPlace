import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Shield, LogOut, ArrowLeft, Building } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Default fallback user if context is loading
  const currentUser = user || {
    name: 'Buyer User',
    email: 'buyer@example.com',
    role: 'BUYER',
    company: 'Textile Traders Co.'
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white mb-6 transition">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-slate-800">
          <div className="w-20 h-20 bg-indigo-600/20 border-2 border-indigo-500 text-indigo-400 rounded-full flex items-center justify-center text-3xl font-extrabold mb-3 shadow-inner">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'B'}
          </div>
          <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
          <span className="text-[10px] uppercase font-bold bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full mt-1.5 border border-indigo-500/20">
            {currentUser.role || 'BUYER'} ACCOUNT
          </span>
        </div>

        {/* Profile Details List */}
        <div className="py-6 space-y-4 text-xs">
          <div className="flex items-center gap-3 p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
            <Mail size={18} className="text-indigo-400" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Email Address</span>
              <span className="text-slate-200 font-semibold">{currentUser.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
            <Building size={18} className="text-purple-400" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Business / Company</span>
              <span className="text-slate-200 font-semibold">{currentUser.company || 'Direct Buyer'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
            <Shield size={18} className="text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Account Status</span>
              <span className="text-emerald-400 font-semibold">Verified Member</span>
            </div>
          </div>
        </div>

        {/* Logout Action */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 py-3 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg"
        >
          <LogOut size={16} /> Logout Account
        </button>

      </div>
    </div>
  );
}
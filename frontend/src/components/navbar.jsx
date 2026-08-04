import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingBag, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const NavLinks = ({ mobile }) => (
    <>
      <Link 
        to="/" 
        className={`${mobile ? 'block py-3 text-lg' : 'px-1 py-2'} relative font-medium transition-colors ${isActive('/') ? 'text-white' : 'text-slate-300 hover:text-white'}`}
        onClick={() => mobile && setMobileMenuOpen(false)}
      >
        Home
        {!mobile && isActive('/') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full"></span>}
      </Link>
      <Link 
        to="/marketplace" 
        className={`${mobile ? 'block py-3 text-lg' : 'px-1 py-2'} relative font-medium transition-colors ${isActive('/marketplace') ? 'text-white' : 'text-slate-300 hover:text-white'}`}
        onClick={() => mobile && setMobileMenuOpen(false)}
      >
        Marketplace
        {!mobile && isActive('/marketplace') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full"></span>}
      </Link>
      {user?.role === 'SUPPLIER' && (
        <Link 
          to="/supplier-dashboard" 
          className={`${mobile ? 'block py-3 text-lg' : 'px-1 py-2'} relative font-medium transition-colors ${isActive('/supplier-dashboard') ? 'text-white' : 'text-slate-300 hover:text-white'}`}
          onClick={() => mobile && setMobileMenuOpen(false)}
        >
          Dashboard
          {!mobile && isActive('/supplier-dashboard') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full"></span>}
        </Link>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-2 rounded-xl shadow-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                TexMarket B2B
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              <NavLinks />
            </div>
            
            <div className="flex items-center gap-4 border-l border-slate-700 pl-6">
              {user ? (
                <>
                  <div className="px-4 py-1.5 bg-slate-800 rounded-full border border-slate-700">
                    <span className="text-sm font-medium text-slate-200">{user.name}</span>
                  </div>
                  <button 
                    onClick={logout}
                    className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-md transition-all hover:shadow-indigo-500/25"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm md:hidden">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-slate-900 border-l border-slate-800 shadow-2xl animate-slide-in-right flex flex-col">
            <div className="p-4 flex justify-end">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="px-6 py-4 flex flex-col gap-2 border-b border-slate-800">
              <NavLinks mobile />
            </div>

            <div className="px-6 py-6 flex flex-col gap-4">
              {user ? (
                <>
                  <div className="px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-center">
                    <span className="text-sm font-medium text-slate-200">{user.name}</span>
                  </div>
                  <button 
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="w-full py-3 text-sm font-medium text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center text-sm font-medium text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl shadow-md"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
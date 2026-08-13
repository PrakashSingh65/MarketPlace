import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext'; // Apne AuthContext path ke hisaab se check karein

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useContext(AuthContext) || {}; // Context fallback

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      // Save Token & User Data in LocalStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      }

      // Sync with Context if available
      if (login) {
        login(data.token, data.user);
      }

      // Redirect based on user role or default to marketplace/home
      if (data.user?.role === 'SUPPLIER') {
        navigate('/supplier-dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.message || 'Connection failed. Please check backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        {/* Header Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 text-indigo-400">
            <Lock size={28} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-1">Welcome Back</h2>
        <p className="text-xs text-slate-400 text-center mb-6">
          Sign in to your TexMarket account
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-slate-500" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-slate-500" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 mt-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-xs text-center text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:underline font-semibold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
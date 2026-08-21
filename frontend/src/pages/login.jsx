import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // AuthContext ke updated login function ko use kar rahe hain
      const res = await login({
        email: formData.email.trim(),
        password: formData.password
      });

      const userData = res?.user || res;
      const role = userData?.role?.toUpperCase();

      // Role-Based Redirection Logic
      if (role === 'SUPPLIER') {
        navigate('/supplier-dashboard');
      } else {
        navigate('/marketplace'); // ya '/buyer-dashboard'
      }
    } catch (err) {
      console.error("Login Error:", err);
      setErrorMsg(err.message || 'Invalid Email or Password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-md space-y-5 shadow-2xl">
        <h2 className="text-2xl font-bold text-white text-center">Sign In to Your Account</h2>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition text-sm disabled:opacity-50 mt-2 shadow-lg shadow-indigo-600/20"
        >
          {loading ? 'Logging in...' : 'Sign In'}
        </button>

        <p className="text-xs text-center text-slate-400 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:underline font-semibold">
            Register Here
          </Link>
        </p>
      </form>
    </div>
  );
}
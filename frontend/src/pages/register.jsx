import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, Eye, EyeOff, AlertCircle, ShoppingCart, Store, User, Loader2 } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('BUYER');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      navigate('/login');
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h1>
          <p className="text-slate-500">Join India's largest B2B textile marketplace</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-start gap-3 animate-fade-in border border-red-100">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="mb-2">
            <label className="block text-sm font-medium text-slate-700 mb-3">I want to...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('BUYER')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  role === 'BUYER'
                    ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <ShoppingCart className={`w-6 h-6 mb-2 ${role === 'BUYER' ? 'text-indigo-600' : 'text-slate-500'}`} />
                <div className={`font-semibold ${role === 'BUYER' ? 'text-indigo-900' : 'text-slate-700'}`}>Buyer</div>
                <div className="text-xs text-slate-500 mt-1">Purchase fabrics wholesale</div>
              </button>
              
              <button
                type="button"
                onClick={() => setRole('SUPPLIER')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  role === 'SUPPLIER'
                    ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Store className={`w-6 h-6 mb-2 ${role === 'SUPPLIER' ? 'text-indigo-600' : 'text-slate-500'}`} />
                <div className={`font-semibold ${role === 'SUPPLIER' ? 'text-indigo-900' : 'text-slate-700'}`}>Supplier</div>
                <div className="text-xs text-slate-500 mt-1">Sell your fabrics</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 text-white rounded-xl font-medium shadow-md shadow-indigo-200 transition-all disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
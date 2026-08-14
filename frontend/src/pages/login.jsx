import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login';
    const payload = isSignup ? { name, email, password } : { email, password };

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert(isSignup ? 'Registration successful!' : 'Login successful!');
        navigate('/');
      } else {
        alert(data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error(err);
      alert('Backend server error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 w-full max-w-md">
        <h2 className="text-2xl font-black text-slate-900 text-center mb-2">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-xs text-slate-500 text-center mb-6">TexMarket Portal</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 p-2.5 border rounded-lg text-sm bg-slate-50 focus:bg-white"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2.5 border rounded-lg text-sm bg-slate-50 focus:bg-white"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2.5 border rounded-lg text-sm bg-slate-50 focus:bg-white"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg hover:bg-indigo-700 transition text-sm"
          >
            {isSignup ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div className="text-center mt-4">
          <button 
            onClick={() => setIsSignup(!isSignup)} 
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            {isSignup ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
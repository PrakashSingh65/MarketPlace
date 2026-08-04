import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'BUYER',
    companyName: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border w-96">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Register on TexMarket</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full p-2 border rounded-md focus:outline-indigo-600"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full p-2 border rounded-md focus:outline-indigo-600"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            className="w-full p-2 border rounded-md focus:outline-indigo-600"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Account Type</label>
          <select
            name="role"
            className="w-full p-2 border rounded-md focus:outline-indigo-600"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="BUYER">Buyer (Khariddar)</option>
            <option value="SUPPLIER">Supplier (Bechne wala)</option>
          </select>
        </div>

        {formData.role === 'SUPPLIER' && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              name="companyName"
              required
              className="w-full p-2 border rounded-md focus:outline-indigo-600"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>
        )}

        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition">
          Register
        </button>

        <p className="text-sm text-center mt-4 text-slate-600">
          Already have an account? <Link to="/login" className="text-indigo-600 font-semibold">Login</Link>
        </p>
      </form>
    </div>
  );
}
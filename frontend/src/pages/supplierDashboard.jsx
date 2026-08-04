import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function SupplierDashboard() {
  const { token, user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Cotton',
    pricePerMeter: '',
    minOrderQty: ''
  });

  
  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Product added successfully!');
      setFormData({ title: '', description: '', category: 'Cotton', pricePerMeter: '', minOrderQty: '' });
      fetchMyProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add product');
    }
  };

  return (
    <div className="py-6 space-y-8">
      <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold">Supplier Dashboard</h1>
        <p className="text-indigo-200 mt-1">Welcome, {user?.name}! Add and manage your fabric catalog.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Add Product Form */}
        <div className="bg-white p-6 rounded-xl shadow border md:col-span-1">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Add New Textile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fabric Title</label>
              <input
                type="text"
                name="title"
                required
                className="w-full p-2 border rounded-md focus:outline-indigo-600"
                placeholder="e.g. Premium Silk Material"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                rows="3"
                required
                className="w-full p-2 border rounded-md focus:outline-indigo-600"
                placeholder="Fabric weight, thread count, texture details..."
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                name="category"
                className="w-full p-2 border rounded-md focus:outline-indigo-600"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Cotton">Cotton</option>
                <option value="Silk">Silk</option>
                <option value="Polyester">Polyester</option>
                <option value="Denim">Denim</option>
                <option value="Linen">Linen</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price / Meter (₹)</label>
              <input
                type="number"
                name="pricePerMeter"
                required
                className="w-full p-2 border rounded-md focus:outline-indigo-600"
                value={formData.pricePerMeter}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Minimum Order Qty (Meters)</label>
              <input
                type="number"
                name="minOrderQty"
                required
                className="w-full p-2 border rounded-md focus:outline-indigo-600"
                value={formData.minOrderQty}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-md font-semibold transition">
              + Publish Fabric Listing
            </button>
          </form>
        </div>

        {/* Product List */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Your Published Listings</h2>
          {products.length === 0 ? (
            <p className="text-slate-500">No products added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((item) => (
                <div key={item._id} className="bg-white p-4 rounded-lg border shadow-sm">
                  <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-slate-800 text-lg mt-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm my-2">{item.description}</p>
                  <div className="text-sm font-medium text-slate-700 space-y-1">
                    <p>Price: <span className="text-emerald-600">₹{item.pricePerMeter} / m</span></p>
                    <p>Min Order: {item.minOrderQty} meters</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
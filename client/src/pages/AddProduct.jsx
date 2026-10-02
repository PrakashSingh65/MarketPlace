import { useState } from 'react';
import { axiosClient } from '../api/axiosClient';

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cotton',
    price: '',
    material: '',
    image: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.name.trim(),
        name: formData.name.trim(),
        category: formData.category.trim().toLowerCase(),
        price: Number(formData.price),
        composition: formData.material.trim(),
        image: formData.image.trim(),
        description: formData.description.trim(),
      };
      const res = await axiosClient.post('/product', payload);
      if (res.status === 201 || res.status === 200 || res.data) {
        alert('Product successfully added!');
        setFormData({ name: '', category: 'Cotton', price: '', material: '', image: '', description: '' });
      }
    } catch (err) {
      console.error('Error adding product:', err);
      const msg = err.response?.data?.message || 'Failed to add product';
      alert(msg);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-6 bg-slate-900 text-white rounded-2xl border border-slate-800">
      <h2 className="text-2xl font-bold mb-6">Add New Fabric Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold mb-1">Product Title</label>
          <input 
            type="text" 
            required 
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Category</label>
            <select 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Cotton">Cotton</option>
              <option value="Silk">Silk</option>
              <option value="Denim">Denim</option>
              <option value="Polyester">Polyester</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Price (₹/meter)</label>
            <input 
              type="number" 
              required 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Image URL</label>
          <input 
            type="text" 
            placeholder="https://..."
            required 
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-sm"
            value={formData.image}
            onChange={(e) => setFormData({...formData, image: e.target.value})}
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-xl transition"
        >
          Publish Product
        </button>
      </form>
    </div>
  );
}
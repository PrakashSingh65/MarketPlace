import React, { useState } from 'react';

export default function AddProductModal({ isOpen, onClose, onProductAdded }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    stock: '',
    description: '',
    imageUrl: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Backend API Call to Save Product
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Product successfully added!');
        setFormData({ name: '', category: 'Electronics', price: '', stock: '', description: '', imageUrl: '' });
        if (onProductAdded) onProductAdded();
        onClose();
      } else {
        alert('Failed to add product. Please check details.');
      }
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        
        <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
          <h2 className="text-lg font-bold text-white">Add New Product</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Product Name */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Product Title / Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Wireless Bluetooth Headphones"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-blue-500"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-blue-500"
              >
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home">Home & Kitchen</option>
                <option value="Beauty">Beauty & Health</option>
                <option value="Appliances">Appliances</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Price (₹)</label>
              <input 
                type="number" 
                required
                placeholder="1499"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-blue-500"
              />
            </div>
          </div>

          {/* Stock & Image URL */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Stock Quantity</label>
              <input 
                type="number" 
                required
                placeholder="50"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Image URL</label>
              <input 
                type="url" 
                required
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Product Description</label>
            <textarea 
              rows="3"
              placeholder="Enter item specs and details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-blue-500"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
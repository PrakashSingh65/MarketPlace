import { useState, useEffect } from 'react';

// Categories aur unki Sub-Categories Ka Mapping Structure
const CATEGORY_MAP = {
  mobiles: ['iPhone', 'Vivo', 'OPPO', 'POCO', 'Redmi', 'Samsung', 'realme', 'Nothing', 'Google', 'Motorola'],
  fashion: ["Men's Wear", "Women's Wear", "Kids Wear", 'Footwear'],
  electronics: ['Laptops', 'Headphones', 'Smartwatches', 'Monitors'],
  beauty: ['Skincare', 'Makeup', 'Haircare'],
  home: ['Furniture', 'Decor', 'Kitchen'],
  appliances: ['TVs', 'Refrigerators', 'Washing Machines'],
  toys: ['Action Figures', 'Board Games'],
  food: ['Snacks', 'Beverages'],
  auto: ['Car Accessories', 'Bike Accessories'],
  sports: ['Fitness Gear', 'Outdoor Sports'],
  furniture: ['Living Room', 'Bedroom'],
  books: ['Fiction', 'Non-Fiction'],
  '2wheelers': ['Electric Scooters', 'Bikes']
};

export default function SupplierDashboard() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('mobiles');
  const [subCategory, setSubCategory] = useState(CATEGORY_MAP['mobiles'][0] || '');
  const [price, setPrice] = useState('');
  const [moq, setMoq] = useState('50');
  const [stock, setStock] = useState('50');
  const [gsm, setGsm] = useState('');
  const [composition, setComposition] = useState('');
  const [colors, setColors] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetchProducts();
  }, []);

  // Category change hone par Sub-Category update karne ke liye
  const handleCategoryChange = (e) => {
    const selectedCat = e.target.value;
    setCategory(selectedCat);
    const subList = CATEGORY_MAP[selectedCat] || [];
    setSubCategory(subList.length > 0 ? subList[0] : '');
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('mobiles');
    setSubCategory(CATEGORY_MAP['mobiles'][0] || '');
    setPrice('');
    setMoq('50');
    setStock('50');
    setGsm('');
    setComposition('');
    setColors('');
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('price', price);
      formData.append('pricePerMeter', price);
      formData.append('moq', moq);
      formData.append('stock', stock);
      formData.append('stockMeters', stock);
      if (gsm) formData.append('gsm', gsm);
      if (composition) formData.append('composition', composition);
      if (colors) {
        colors
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean)
          .forEach((c) => formData.append('colors', c));
      }
      if (imageFile) formData.append('image', imageFile);

      const res = await fetch(`${apiUrl}/api/products`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchProducts();
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const labelStyle = { fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' };
  const inputStyle = { width: '100%', padding: '8px', borderRadius: '8px', background: '#020617', border: '1px solid #334155', color: '#fff', boxSizing: 'border-box' };

  return (
    <div style={{ padding: '24px', backgroundColor: '#020617', color: '#fff', minHeight: '100vh' }}>

      {/* Top Header & ADD BUTTON */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Supplier Dashboard</h1>
          <p style={{ color: '#94a3b8', fontSize: '12px' }}>Manage your catalog and uploads</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: '#4f46e5',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          + Add New Product
        </button>
      </div>

      {/* PRODUCTS DISPLAY GRID */}
      <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '16px', border: '1px solid #1e293b' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>Active Products ({products.length})</h3>

        {products.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '12px', textAlign: 'center', padding: '20px' }}>
            No products added yet. Click "+ Add New Product" button above.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {products.map((p) => (
              <div key={p._id} style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                <img
                  src={(p.images && p.images[0]) || p.image || 'https://via.placeholder.com/150'}
                  alt={p.title}
                  style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <p style={{ fontWeight: 'bold', fontSize: '13px', marginTop: '8px' }}>{p.title}</p>
                <div style={{ display: 'flex', gap: '4px', margin: '4px 0' }}>
                  <span style={{ fontSize: '9px', backgroundColor: '#312e81', color: '#c7d2fe', padding: '2px 6px', borderRadius: '4px' }}>
                    {p.category}
                  </span>
                  {p.subCategory && (
                    <span style={{ fontSize: '9px', backgroundColor: '#1e293b', color: '#94a3b8', padding: '2px 6px', borderRadius: '4px' }}>
                      {p.subCategory}
                    </span>
                  )}
                </div>
                {p.description && (
                  <p style={{ color: '#64748b', fontSize: '11px', margin: '2px 0' }}>
                    {p.description.length > 60 ? `${p.description.slice(0, 60)}...` : p.description}
                  </p>
                )}
                <p style={{ color: '#818cf8', fontSize: '11px' }}>
                  ₹{p.pricePerMeter ?? p.price}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* POPUP UPLOAD MODAL */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
          overflowY: 'auto', padding: '24px 0'
        }}>
          <div style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '16px', width: '380px', border: '1px solid #334155', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '14px' }}>Upload Product</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* IMAGE INPUT & PREVIEW */}
              <div style={{ border: '2px dashed #334155', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                <input type="file" accept="image/*" required onChange={handleImageChange} />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" style={{ height: '80px', marginTop: '8px', borderRadius: '6px', objectFit: 'cover' }} />
                )}
              </div>

              <div>
                <label style={labelStyle}>Product Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. iPhone 15 Pro / Cotton Blue Shirt"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of the product"
                  rows={2}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {/* CATEGORY & SUBCATEGORY DROPDOWNS */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Category</label>
                  <select
                    value={category}
                    onChange={handleCategoryChange}
                    style={inputStyle}
                  >
                    {Object.keys(CATEGORY_MAP).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Sub-Category</label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    style={inputStyle}
                    disabled={!CATEGORY_MAP[category] || CATEGORY_MAP[category].length === 0}
                  >
                    {(CATEGORY_MAP[category] || []).map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="999"
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="50"
                    style={inputStyle}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{ backgroundColor: '#4f46e5', color: '#fff', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}
              >
                {submitting ? 'Uploading...' : 'Upload Product'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
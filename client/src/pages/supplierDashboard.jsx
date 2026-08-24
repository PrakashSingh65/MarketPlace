import { useState, useEffect } from 'react';

const CATEGORY_MAP = {
  fashion: ["Men's Wear", "Women's Wear", "Kids Wear", "Footwear"],
  mobiles: ["iPhone", "Vivo", "OPPO", "POCO", "Redmi", "Samsung", "realme", "Nothing", "Google", "Motorola"],
  electronics: ["Laptops", "Headphones", "Smartwatches", "Monitors"],
  beauty: ["Skincare", "Makeup", "Haircare"],
  home: ["Furniture", "Decor", "Kitchen"],
  appliances: ["TVs", "Refrigerators", "Washing Machines"],
  toys: ["Action Figures", "Board Games"],
  food: ["Snacks", "Beverages"],
  auto: ["Car Accessories", "Bike Accessories"],
  sports: ["Fitness Gear", "Outdoor Sports"],
  furniture: ["Living Room", "Bedroom"],
  books: ["Fiction", "Non-Fiction"],
  "2wheelers": ["Electric Scooters", "Bikes"]
};

export default function SupplierDashboard() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('fashion');
  const [subCategory, setSubCategory] = useState(CATEGORY_MAP['fashion'][0] || '');
  const [price, setPrice] = useState('');
  const [moq, setMoq] = useState('50');
  const [stock, setStock] = useState('50');
  const [gsm, setGsm] = useState('');
  const [composition, setComposition] = useState('');
  const [colors, setColors] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/products`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCat = e.target.value;
    setCategory(selectedCat);
    const subList = CATEGORY_MAP[selectedCat] || [];
    setSubCategory(subList.length > 0 ? subList[0] : '');
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
    setCategory('fashion');
    setSubCategory(CATEGORY_MAP['fashion'][0] || '');
    setPrice('');
    setMoq('50');
    setStock('50');
    setGsm('');
    setComposition('');
    setColors('');
    setImageFile(null);
    setImagePreview(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
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

      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${apiUrl}/api/products`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      if (res.ok) {
        alert('Product uploaded successfully!');
        handleCloseModal();
        fetchProducts();
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(errData.message || 'Upload failed. Please check input values.');
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Product Delete Functionality
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiUrl}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((item) => (item._id || item.id) !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const labelStyle = { fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' };
  const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#020617', border: '1px solid #334155', color: '#fff', boxSizing: 'border-box', outline: 'none' };

  return (
    <div style={{ padding: '24px', backgroundColor: '#020617', color: '#fff', minHeight: '100vh' }}>

      {/* Header Bar */}
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

      {/* Active Products Catalog */}
      <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '16px', border: '1px solid #1e293b' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>Active Products ({products.length})</h3>

        {products.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '12px', textAlign: 'center', padding: '20px' }}>
            No products added yet. Click "+ Add New Product" button above.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {products.map((p) => {
              const productId = p._id || p.id;
              return (
                <div key={productId} style={{ backgroundColor: '#020617', padding: '12px', borderRadius: '12px', border: '1px solid #1e293b', position: 'relative' }}>
                  
                  {/* Delete Icon */}
                  <button
                    onClick={() => handleDeleteProduct(productId)}
                    title="Delete Product"
                    style={{
                      position: 'absolute',
                      top: '18px',
                      right: '18px',
                      background: 'rgba(239, 68, 68, 0.8)',
                      border: 'none',
                      color: '#fff',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ✕
                  </button>

                  <img
                    src={(p.images && p.images[0]) || p.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="100%" height="100%" fill="%230f172a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="14">No Image</text></svg>'}
                    alt={p.title}
                    style={{ width: '100%', height: '130px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <p style={{ fontWeight: 'bold', fontSize: '13px', marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
                  
                  <div style={{ display: 'flex', gap: '4px', margin: '4px 0', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '9px', backgroundColor: '#312e81', color: '#c7d2fe', padding: '2px 6px', borderRadius: '4px' }}>
                      {p.category}
                    </span>
                    {p.subCategory && (
                      <span style={{ fontSize: '9px', backgroundColor: '#1e293b', color: '#94a3b8', padding: '2px 6px', borderRadius: '4px' }}>
                        {p.subCategory}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <p style={{ color: '#818cf8', fontSize: '13px', fontWeight: 'bold' }}>
                      ₹{p.pricePerMeter ?? p.price}
                    </p>
                    {p.stock && (
                      <span style={{ fontSize: '10px', color: '#64748b' }}>Stock: {p.stock}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '420px', border: '1px solid #334155', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '16px' }}>Upload Product</h3>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              <div style={{ border: '2px dashed #334155', padding: '16px', borderRadius: '12px', textAlign: 'center', backgroundColor: '#020617' }}>
                <input type="file" accept="image/*" required onChange={handleImageChange} style={{ fontSize: '12px', color: '#94a3b8' }} />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" style={{ height: '80px', marginTop: '10px', borderRadius: '6px', objectFit: 'cover' }} />
                )}
              </div>

              <div>
                <label style={labelStyle}>Product Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Denim Fabric / Cotton Shirts"
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

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Category</label>
                  <select value={category} onChange={handleCategoryChange} style={inputStyle}>
                    {Object.keys(CATEGORY_MAP).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Sub-Category</label>
                  <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} style={inputStyle}>
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
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="499"
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="50"
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>MOQ</label>
                  <input
                    type="number"
                    min="1"
                    value={moq}
                    onChange={(e) => setMoq(e.target.value)}
                    placeholder="50"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>GSM (Optional)</label>
                  <input
                    type="text"
                    value={gsm}
                    onChange={(e) => setGsm(e.target.value)}
                    placeholder="e.g. 220"
                    style={inputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Composition (Optional)</label>
                  <input
                    type="text"
                    value={composition}
                    onChange={(e) => setComposition(e.target.value)}
                    placeholder="100% Cotton"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Colors (comma-separated)</label>
                <input
                  type="text"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  placeholder="Red, Blue, Black"
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  backgroundColor: submitting ? '#312e81' : '#4f46e5',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  marginTop: '8px'
                }}
              >
                {submitting ? 'Uploading Product...' : 'Upload Product'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
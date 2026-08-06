import { useState, useEffect } from 'react';

export default function SupplierDashboard() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Cotton');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('price', price);
      if (imageFile) formData.append('image', imageFile);

      const res = await fetch(`${apiUrl}/api/products`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setIsModalOpen(false);
        setTitle('');
        setPrice('');
        setImageFile(null);
        setImagePreview(null);
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

  return (
    <div style={{ padding: '24px', backgroundColor: '#020617', color: '#fff', minHeight: '100vh' }}>
      
      {/* Top Header & ADD BUTTON */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Supplier Dashboard</h1>
          <p style={{ color: '#94a3b8', fontSize: '12px' }}>Manage your catalog and uploads</p>
        </div>

        {/* ADD FABRIC BUTTON */}
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
          + Add New Fabric
        </button>
      </div>

      {/* PRODUCTS DISPLAY GRID */}
      <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '16px', border: '1px solid #1e293b' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 'bold' }}>Active Fabric Products ({products.length})</h3>

        {products.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '12px', textAlign: 'center', padding: '20px' }}>
            No products added yet. Click "+ Add New Fabric" button above.
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
                <p style={{ color: '#818cf8', fontSize: '11px' }}>₹{p.price} / meter</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* POPUP UPLOAD MODAL */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '16px', width: '380px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: 'bold', fontSize: '14px' }}>Upload Fabric Image</h3>
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
                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Fabric Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Pure Cotton"
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', background: '#020617', border: '1px solid #334155', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8' }}>Price per Meter (₹)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="250"
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', background: '#020617', border: '1px solid #334155', color: '#fff' }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{ backgroundColor: '#4f46e5', color: '#fff', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}
              >
                {submitting ? 'Uploading to Cloudinary...' : 'Upload Product'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
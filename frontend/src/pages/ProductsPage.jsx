import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const category = searchParams.get('category');
  const subCategory = searchParams.get('subCategory');
  const keyword = searchParams.get('keyword');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchFilteredProducts();
  }, [category, subCategory, keyword]);

  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      let queryParams = new URLSearchParams();
      if (category) queryParams.append('category', category);
      if (subCategory) queryParams.append('subCategory', subCategory);
      if (keyword) queryParams.append('keyword', keyword);

      const res = await fetch(`${apiUrl}/api/products?${queryParams.toString()}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
        {keyword ? `Search Results for "${keyword}"` : category ? category.toUpperCase() : 'All Products'}
        {subCategory && ` > ${subCategory}`}
      </h2>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {products.map((p) => (
            <div key={p._id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', background: '#fff' }}>
              <img
                src={(p.images && p.images[0]) || p.image || 'https://via.placeholder.com/150'}
                alt={p.title}
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <h4 style={{ fontSize: '15px', fontWeight: '600', marginTop: '10px' }}>{p.title}</h4>
              <p style={{ color: '#2563eb', fontWeight: 'bold', marginTop: '4px' }}>₹{p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
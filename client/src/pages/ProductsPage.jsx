import { useSearchParams } from 'react-router-dom';
import { useGetProducts } from '../api/productApi';

export default function ProductsPage() {
  const [searchParams] = useSearchParams();

  const category = searchParams.get('category');
  const subCategory = searchParams.get('subCategory');
  const keyword = searchParams.get('keyword');

  const filters = {
    ...(category && { category }),
    ...(subCategory && { subCategory }),
    ...(keyword && { keyword }),
  };

  const { data, isLoading: loading } = useGetProducts(filters);
  const products = Array.isArray(data) ? data : data?.products || [];

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
            <div key={p._id || p.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', background: '#fff' }}>
              <img
                src={(p.images && p.images[0]) || p.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="100%" height="100%" fill="%230f172a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="14">No Image</text></svg>'}
                alt={p.title || p.name}
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <h4 style={{ fontSize: '15px', fontWeight: '600', marginTop: '10px' }}>{p.title || p.name}</h4>
              <p style={{ color: '#2563eb', fontWeight: 'bold', marginTop: '4px' }}>₹{p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
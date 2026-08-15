import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();

  const category = searchParams.get('category');
  const subCategory = searchParams.get('subCategory');

  useEffect(() => {
    fetchFilteredProducts();
  }, [category, subCategory]);

  const fetchFilteredProducts = async () => {
    try {
      let url = '/api/products?';
      if (category) url += `category=${category}&`;
      if (subCategory) url += `subCategory=${encodeURIComponent(subCategory)}`;

      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>
        {category ? category.toUpperCase() : 'All Products'} 
        {subCategory && ` > ${subCategory}`}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {products.map((p) => (
          <div key={p._id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
            <img src={p.image} alt={p.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <h4>{p.title}</h4>
            <p>₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
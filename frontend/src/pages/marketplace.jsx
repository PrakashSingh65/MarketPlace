import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Marketplace() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">B2B Textile Marketplace</h1>
      
      {products.length === 0 ? (
        <p className="text-slate-500">Abhi koi products list nahi hue hain.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((item) => (
            <div key={item._id} className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2 text-indigo-900">{item.title}</h3>
              <p className="text-slate-600 text-sm mb-4">{item.description}</p>
              
              <div className="space-y-1 text-sm text-slate-700">
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Price:</strong> ₹{item.pricePerMeter} / meter</p>
                <p><strong>Min Order Quantity:</strong> {item.minOrderQty} meters</p>
              </div>

              <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-semibold transition">
                Inquire / Place Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
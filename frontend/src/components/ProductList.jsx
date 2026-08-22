import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

const API_BASE_URL = 'http://localhost:5000/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.get(`${API_BASE_URL}/products`, {
        params: { search, category },
      });
      setProducts(data.products || data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search fabric, composition, or GSM..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="cotton">Cotton</option>
          <option value="polyester">Polyester</option>
          <option value="silk">Silk</option>
          <option value="denim">Denim</option>
        </select>
      </div>

      {/* States Handling */}
      {loading && <div className="text-center py-12 text-lg text-gray-600">Loading products...</div>}
      {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6">{error}</div>}

      {/* Products Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8">
              No products found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
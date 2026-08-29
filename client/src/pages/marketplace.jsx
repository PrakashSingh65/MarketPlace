import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useCart from '../hooks/useCart';
import { useGetProducts } from '../api/productApi';
import { setCategoryFilter, setSearchKeyword } from '../redux/slice/productSlice';

export default function Marketplace({ selectedCategory }) {
  const { addToCart } = useCart();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // URL Query param se search text read karein
  const searchQuery = searchParams.get('q') || '';

  // 1. URL search text aur props filter ko Redux state mein sync karein
  useEffect(() => {
    dispatch(setSearchKeyword(searchQuery));
  }, [searchQuery, dispatch]);

  useEffect(() => {
    const categoryToSet =
      !selectedCategory || selectedCategory === 'For You' ? '' : selectedCategory;
    dispatch(setCategoryFilter(categoryToSet));
  }, [selectedCategory, dispatch]);

  // 2. Redux state se active filters nikalein
  const filters = useSelector((state) => state.productUI.filters);

  // 3. TanStack Query hook se Backend API se dynamic product data fetch karein
  const { data, isLoading, isError, error } = useGetProducts(filters);

  // Safely extract products array from API response
  const products = data?.products || (Array.isArray(data) ? data : []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-white">
        <p className="text-lg">Loading products from backend...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-red-400">
        <p className="text-lg">Error loading products: {error?.message || 'Something went wrong'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Marketplace</h1>
          {filters.keyword && (
            <p className="text-sm text-amber-400 mt-1">
              Search results for: <span className="font-semibold text-white">"{filters.keyword}"</span>
            </p>
          )}
        </div>
        <span className="text-xs text-purple-300">
          Showing {products.length} items
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => {
            const productId = product._id || product.id;
            const itemPrice = product.price ?? product.pricePerMeter ?? 0;

            return (
              <div
                key={productId}
                className="bg-purple-950/40 border border-purple-900/40 rounded-xl overflow-hidden shadow-lg hover:border-orange-500/50 transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <img
                    src={product.image || product.images?.[0]}
                    alt={product.title || product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-base text-slate-100 line-clamp-2">
                      {product.title || product.name}
                    </h3>
                    <p className="text-xs text-purple-300 mt-1 capitalize">
                      Category: {product.category}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex justify-between items-center mt-2">
                  <span className="font-bold text-orange-400 text-lg">
                    ₹{itemPrice.toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs px-3 py-2 rounded-lg transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-16 bg-purple-950/20 border border-purple-900/20 rounded-xl">
            <p className="text-slate-400 text-base">
              No products found {filters.keyword && <span>matching <span className="text-white font-semibold">"{filters.keyword}"</span></span>}
            </p>
            <p className="text-xs text-purple-400 mt-2">
              Try searching for a different item or clear your search filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
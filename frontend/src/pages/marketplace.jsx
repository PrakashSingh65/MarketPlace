import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, ChevronDown } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import ProductCard, { categoryColors } from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import InquiryModal from '../components/InquiryModal';

const CATEGORIES = ['Cotton', 'Silk', 'Polyester', 'Wool', 'Linen', 'Denim'];

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, token } = useContext(AuthContext);

  const initialCategory = searchParams.get('category') || 'All';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price-asc' | 'price-desc'

  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Sync category with URL
    const newParams = new URLSearchParams(searchParams);
    if (selectedCategory !== 'All') {
      newParams.set('category', selectedCategory);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams, { replace: true });
  }, [selectedCategory, searchParams, setSearchParams]);

  useEffect(() => {
    let debounceTimer;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const queryParams = new URLSearchParams();
        
        if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);
        if (searchTerm) queryParams.append('search', searchTerm);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);

        const response = await fetch(`${baseUrl}/products?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedCategory, minPrice, maxPrice]);

  const sortedProducts = useMemo(() => {
    const productsCopy = [...products];
    switch (sortBy) {
      case 'price-asc':
        return productsCopy.sort((a, b) => a.pricePerMeter - b.pricePerMeter);
      case 'price-desc':
        return productsCopy.sort((a, b) => b.pricePerMeter - a.pricePerMeter);
      case 'newest':
      default:
        return productsCopy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [products, sortBy]);

  const handleInquiry = (product) => {
    setSelectedProduct(product);
    setIsInquiryOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Textile Marketplace</h1>
        <p className="text-lg text-slate-500 mt-2">Browse wholesale fabrics from top suppliers.</p>
        <p className="text-sm font-medium text-indigo-600 mt-1">{products.length} {products.length === 1 ? 'result' : 'results'}</p>
      </header>

      <div className="flex flex-col gap-6 mb-8">
        {/* Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-shadow text-slate-900 placeholder-slate-400 outline-none"
            placeholder="Search fabrics, materials, suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          
          {/* Categories */}
          <div className="flex overflow-x-auto pb-2 lg:pb-0 gap-2 hide-scrollbar">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'All' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All
            </button>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Price Range */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-shadow"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                placeholder="Max ₹"
                className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-shadow"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-lg py-2 pl-4 pr-10 shadow-sm text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-600 outline-none transition-shadow cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-8 bg-red-50 text-red-600 rounded-xl border border-red-100">
          Error loading products: {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onInquiry={() => handleInquiry(product)} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-slate-200 shadow-sm animate-slide-up">
          <div className="bg-indigo-50 p-4 rounded-full mb-4">
            <Package className="h-12 w-12 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
          <p className="text-slate-500 mb-6 max-w-md">Try adjusting your filters or search term to find what you're looking for.</p>
          <button 
            onClick={clearFilters}
            className="px-6 py-2.5 bg-white border border-indigo-200 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-colors shadow-sm"
          >
            Clear Filters
          </button>
        </div>
      )}

      <InquiryModal 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)} 
        product={selectedProduct} 
      />
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
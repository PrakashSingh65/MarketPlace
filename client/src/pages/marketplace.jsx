import React from 'react';
import { useSearchParams } from 'react-router-dom';
import useCart from '../hooks/useCart';

export default function Marketplace({ selectedCategory }) {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  // Expanded Product Inventory for All Searches
  const products = [
    {
      id: 1,
      name: 'Gaming Laptop RTX 4060 (16GB RAM, 512GB SSD)',
      category: 'Electronics',
      price: 65999,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 2,
      name: 'Ultra Slim Laptop i5 12th Gen',
      category: 'Electronics',
      price: 45999,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 3,
      name: 'Apple MacBook Air M2',
      category: 'Electronics',
      price: 89900,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 4,
      name: 'Smartphone 5G (8GB RAM, 128GB)',
      category: 'Mobiles',
      price: 18999,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 5,
      name: 'Wireless Noise Cancelling Headphones',
      category: 'Electronics',
      price: 2999,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 6,
      name: 'Smart Fitness Band',
      category: 'Mobiles',
      price: 1999,
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 7,
      name: 'Premium Cotton Fabric',
      category: 'Fashion',
      price: 499,
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 8,
      name: 'Men Regular Fit Denim Jacket',
      category: 'Fashion',
      price: 1299,
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 9,
      name: 'Sports Wear T-Shirt',
      category: 'Sports',
      price: 799,
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 10,
      name: 'Running Sports Shoes',
      category: 'Sports',
      price: 1499,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 11,
      name: 'Luxury Skincare Glow Serum',
      category: 'Beauty',
      price: 899,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 12,
      name: 'Automatic Coffee Maker Machine',
      category: 'Appliances',
      price: 4500,
      image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&auto=format&fit=crop&q=60'
    }
  ];

  // Smart Search & Category Filter Logic
  const filteredProducts = products.filter((product) => {
    const term = searchQuery.toLowerCase().trim();

    // Matches Name, Category, or Price in Search
    const matchesSearch =
      !term ||
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term);

    // Navigation Category Tab Filter
    const matchesCategory =
      !selectedCategory ||
      selectedCategory === 'For You' ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Marketplace</h1>
          {searchQuery && (
            <p className="text-sm text-amber-400 mt-1">
              Search results for: <span className="font-semibold text-white">"{searchQuery}"</span>
            </p>
          )}
        </div>
        <span className="text-xs text-purple-300">
          Showing {filteredProducts.length} items
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-purple-950/40 border border-purple-900/40 rounded-xl overflow-hidden shadow-lg hover:border-orange-500/50 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-base text-slate-100 line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-purple-300 mt-1">Category: {product.category}</p>
                </div>
              </div>

              <div className="p-4 pt-0 flex justify-between items-center mt-2">
                <span className="font-bold text-orange-400 text-lg">₹{product.price.toLocaleString('en-IN')}</span>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs px-3 py-2 rounded-lg transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-purple-950/20 border border-purple-900/20 rounded-xl">
            <p className="text-slate-400 text-base">
              No products found matching <span className="text-white font-semibold">"{searchQuery}"</span>
            </p>
            <p className="text-xs text-purple-400 mt-2">
              Try searching for "laptop", "mobile", "shoes", or "fashion"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
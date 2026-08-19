import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Marketplace({ selectedCategory }) {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const { addToCart } = useCart();

  const products = [
    {
      id: 1,
      name: 'Premium Cotton Fabric',
      category: 'Fashion',
      price: 499,
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 2,
      name: 'Sports Wear T-Shirt',
      category: 'Sports',
      price: 799,
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 3,
      name: 'Running Sports Shoes',
      category: 'Sports',
      price: 1499,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 4,
      name: 'Smart Fitness Band',
      category: 'Mobiles',
      price: 1999,
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&auto=format&fit=crop&q=60'
    }
  ];

  const filteredProducts = products.filter((product) => {
    const term = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !term ||
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term);

    const matchesCategory =
      !selectedCategory ||
      selectedCategory === 'For You' ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        {searchQuery && (
          <p className="text-sm text-amber-400 mt-1">
            Search results for: <span className="font-semibold text-white">"{searchQuery}"</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="bg-purple-950/40 border border-purple-900/40 rounded-xl overflow-hidden shadow-lg hover:border-orange-500/50 transition">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-base text-slate-100">{product.name}</h3>
                <p className="text-xs text-purple-300 mt-1">Category: {product.category}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-orange-400">₹{product.price}</span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400">
            No products found matching <span className="text-white font-semibold">"{searchQuery}"</span>
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Trash2, ShoppingCart } from 'lucide-react';

export default function MyWishlist() {
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: 'Smart Watch Series 7',
      price: '₹2,999',
      image: 'https://via.placeholder.com/100',
    },
  ]);

  const removeItem = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-gray-800 border-b pb-2">My Wishlist ({wishlist.length})</h2>
      {wishlist.length === 0 ? (
        <div className="p-4 border border-gray-200 rounded-sm text-xs text-gray-500">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishlist.map((item) => (
            <div key={item.id} className="p-3 border border-gray-200 rounded-sm flex items-center gap-4 bg-white">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-sm" />
              <div className="flex-1">
                <h4 className="font-semibold text-xs text-gray-800">{item.name}</h4>
                <p className="font-bold text-sm text-gray-900 mt-1">{item.price}</p>
                <div className="flex gap-2 mt-2">
                  <button className="flex items-center gap-1 bg-blue-600 text-white text-[10px] px-2.5 py-1 rounded-sm font-bold hover:bg-blue-700">
                    <ShoppingCart size={12} /> Add to Cart
                  </button>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// ProductCard.jsx
import React from 'react';
import { useCart } from '../context/CartContext'; // 👈 CartContext ki jagah useCart import karein

export default function ProductCard({ product }) {
  const { addToCart } = useCart(); // 👈 Direct useCart() call karein

  return (
    <div className="bg-purple-950/40 border border-purple-900/40 rounded-xl overflow-hidden p-4">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg" />
      <h3 className="font-semibold text-white mt-2">{product.name}</h3>
      <p className="text-orange-400 font-bold mt-1">₹{product.price}</p>
      
      <button 
        onClick={() => addToCart(product)}
        className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold py-2 rounded-lg text-sm transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
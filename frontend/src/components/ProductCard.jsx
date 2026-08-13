import React, { useContext } from 'react';
import { ShoppingCart, Send } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext'; // 👈 1. CartContext Import Kiya

// Export Category Colors
export const categoryColors = {
  Cotton: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Silk: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Linen: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Polyester: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Denim: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Wool: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  Default: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export default function ProductCard({ product, onInquiry }) {
  const { token } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext); // 👈 2. Context se addToCart function nikala
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const authToken = token || localStorage.getItem('token');

  // Helper for color swatches
  const swatchFor = (c) => {
    const colorMap = {
      red: '#ef4444',
      blue: '#3b82f6',
      white: '#ffffff',
      black: '#000000',
      green: '#22c55e',
      yellow: '#eab308',
      grey: '#6b7280',
      gray: '#6b7280',
    };
    return colorMap[c?.toLowerCase()] || '#94a3b8';
  };

  // 🛒 Add to Cart Handler (Updated with React Context Support)
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    const productId = product._id || product.id;

    // ⚡ STEP A: Pehle Context State update karein taaki UI/Badge + Cart Page instant update ho jaye
    if (addToCart) {
      addToCart(product);
    } else {
      // Fallback in case context function na mile
      const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingIndex = currentCart.findIndex(
        (item) => (item._id || item.id) === productId
      );

      if (existingIndex > -1) {
        currentCart[existingIndex].quantity =
          (currentCart[existingIndex].quantity || 1) + 1;
      } else {
        currentCart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(currentCart));
    }

    // ⚡ STEP B: Backend Sync (If API Endpoint available)
    try {
      if (authToken) {
        await fetch(`${apiUrl}/api/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            productId: productId,
            quantity: 1,
          }),
        });
      }
      alert('Product Cart me add ho gaya hai! 🛒');
    } catch (err) {
      console.error('API Sync Warning:', err);
      alert('Product Local Cart me add ho gaya hai!');
    }
  };

  // Image Fallback Logic
  const displayImage =
    (product.images && product.images.length > 0 && product.images[0]) ||
    product.image ||
    'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition duration-300">
      <div>
        {/* Product Image */}
        <div className="relative w-full h-48 bg-slate-950 rounded-xl overflow-hidden mb-3">
          <img
            src={displayImage}
            alt={product.title || product.name || 'Fabric'}
            className="w-full h-full object-cover"
          />
          {product.category && (
            <span
              className={`absolute top-2 left-2 text-xs font-semibold px-2.5 py-1 rounded-lg border backdrop-blur-md ${
                categoryColors[product.category] || categoryColors.Default
              }`}
            >
              {product.category}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-white text-base line-clamp-1 mb-1">
          {product.title || product.name || 'Untitled Fabric'}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
          {product.description || 'No description available for this fabric.'}
        </p>

        {/* Colors Swatches */}
        {product.colors && Array.isArray(product.colors) && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            {product.colors.slice(0, 6).map((c, i) => (
              <span
                key={i}
                title={c}
                className="w-4 h-4 rounded-full border border-slate-700 shadow-sm"
                style={{ backgroundColor: swatchFor(c) }}
              />
            ))}
            {product.colors.length > 6 && (
              <span className="text-[11px] text-slate-400 ml-1">
                +{product.colors.length - 6}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Meta Info & Action Buttons */}
      <div className="space-y-2 py-3 border-t border-slate-800 mt-auto">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Price</span>
          <span className="font-bold text-emerald-400 text-base">
            ₹{product.price || 0}
            <span className="text-xs text-slate-400 font-normal">/meter</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          {onInquiry && (
            <button
              onClick={() => onInquiry(product)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 border border-slate-700"
            >
              <Send size={14} /> Send Inquiry
            </button>
          )}

          <button
            onClick={handleAddToCart}
            className={`bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shadow-md shadow-indigo-600/20 ${
              !onInquiry ? 'col-span-2' : ''
            }`}
          >
            <ShoppingCart size={14} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
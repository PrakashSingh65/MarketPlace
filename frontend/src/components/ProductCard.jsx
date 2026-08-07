import { Package, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

export const categoryColors = {
  Cotton: 'bg-blue-50 text-blue-700 border-blue-200',
  Silk: 'bg-purple-50 text-purple-700 border-purple-200',
  Polyester: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  Wool: 'bg-amber-50 text-amber-700 border-amber-200',
  Linen: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Denim: 'bg-indigo-100 text-indigo-800 border-indigo-200',
};

export const categoryGradients = {
  Cotton: 'from-blue-400 to-blue-600',
  Silk: 'from-purple-400 to-purple-600',
  Polyester: 'from-cyan-400 to-cyan-600',
  Wool: 'from-amber-400 to-amber-600',
  Linen: 'from-emerald-400 to-emerald-600',
  Denim: 'from-indigo-400 to-indigo-600',
};

// Rough hex swatches for common fabric color names, with a neutral fallback
const swatchMap = {
  red: '#ef4444', navy: '#1e3a8a', blue: '#3b82f6', white: '#f8fafc',
  black: '#0f172a', green: '#22c55e', yellow: '#eab308', pink: '#ec4899',
  purple: '#a855f7', grey: '#94a3b8', gray: '#94a3b8', beige: '#e7d8c9',
  brown: '#92400e', orange: '#f97316', maroon: '#7f1d1d', cream: '#fdf6e3',
  gold: '#ca8a04', silver: '#cbd5e1', teal: '#14b8a6', olive: '#65a30d',
};
const swatchFor = (name) => swatchMap[name?.toLowerCase().trim()] || '#94a3b8';

export default function ProductCard({ product, onInquiry }) {
  const colorClass = categoryColors[product.category] || 'bg-slate-50 text-slate-700 border-slate-200';
  const gradientClass = categoryGradients[product.category] || 'from-slate-400 to-slate-600';

  // Support either a single `image` field or an `images` array
  const imageUrl = product.image || (Array.isArray(product.images) ? product.images[0] : null);
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = imageUrl && !imgFailed;

  const displayPrice = product.pricePerMeter ?? product.price;
  const displayStock = product.stockMeters ?? product.stock;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col">
      {/* Header: real image if available, otherwise gradient + icon placeholder */}
      <div className={`h-36 relative flex items-center justify-center overflow-hidden ${showImage ? 'bg-slate-100' : `bg-gradient-to-br ${gradientClass}`}`}>
        {showImage ? (
          <img
            src={imageUrl}
            alt={product.title}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <>
            <Package className="text-white/20 group-hover:text-white/40 transition-all duration-500 group-hover:scale-110" size={56} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
          </>
        )}

        {/* Overlay a subtle scrim behind badges when there's a photo, so text stays legible */}
        {showImage && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent pointer-events-none" />
        )}

        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${colorClass} bg-white/90 backdrop-blur-sm`}>
          {product.category}
        </span>
        <span className="absolute top-3 right-3 text-xs font-bold text-white bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
          ₹{displayPrice}/m
        </span>

        {/* Extra image count badge if there are more photos */}
        {Array.isArray(product.images) && product.images.length > 1 && (
          <span className="absolute bottom-3 right-3 text-[11px] font-semibold text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
            +{product.images.length - 1} more
          </span>
        )}

        {/* Low/out of stock badge */}
        {displayStock !== undefined && displayStock <= 0 ? (
          <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-white bg-rose-500/90 px-2 py-0.5 rounded-full">
            Out of stock
          </span>
        ) : displayStock !== undefined && displayStock < 20 ? (
          <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-white bg-amber-500/90 px-2 py-0.5 rounded-full">
            Low stock
          </span>
        ) : null}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1 group-hover:text-indigo-700 transition-colors">
          {product.title}
        </h3>
        <p className="text-slate-500 text-sm mb-3 line-clamp-2">
          {product.description || 'Premium quality fabric for your business needs.'}
        </p>

        {/* GSM / composition tags */}
        {(product.gsm || product.composition) && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {product.gsm && (
              <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                {product.gsm} GSM
              </span>
            )}
            {product.composition && (
              <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                {product.composition}
              </span>
            )}
          </div>
        )}

        {/* Color swatches */}
        {Array.isArray(product.colors) && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mb-4">
            {product.colors.slice(0, 6).map((c, i) => (
              <span
                key={i}
                title={c}
                className="w-4 h-4 rounded-full border border-slate-200 shadow-sm"
                style={{ backgroundColor: swatchFor(c) }}
              />
            ))}
            {product.colors.length > 6 && (
              <span className="text-[11px] text-slate-400 ml-1">+{product.colors.length - 6}</span>
            )}
          </div>
        )}

        {/* Meta info */}
        <div className="space-y-2 mb-4 py-3 border-t border-slate-100 mt-auto">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Price</span>
            <span className="font-bold text-emerald-600 text-base">
              ₹{displayPrice}<span className="text-xs text-slate-400 font-normal">/meter</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">MOQ</span>
            <span className="font-semibold text-slate-700">{product.moq ?? 50} meters</span>
          </div>
          {displayStock !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">In stock</span>
              <span className="font-semibold text-slate-700">{displayStock} meters</span>
            </div>
          )}
        </div>

        {/* Supplier */}
        {product.supplierId && (
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
              <UserIcon size={12} className="text-indigo-600" />
            </div>
            <span>{product.supplierId.profileDetails?.businessName || product.supplierId.name}</span>
          </div>
        )}

        {/* Action button */}
        {onInquiry && (
          <button
            onClick={() => onInquiry(product)}
            disabled={displayStock !== undefined && displayStock <= 0}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30"
          >
            {displayStock !== undefined && displayStock <= 0 ? 'Out of Stock' : 'Send Inquiry'}
          </button>
        )}
      </div>
    </div>
  );
}
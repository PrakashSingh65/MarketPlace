import { Package, User as UserIcon } from 'lucide-react';

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

export default function ProductCard({ product, onInquiry }) {
  const colorClass = categoryColors[product.category] || 'bg-slate-50 text-slate-700 border-slate-200';
  const gradientClass = categoryGradients[product.category] || 'from-slate-400 to-slate-600';

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col">
      {/* Gradient header with category icon */}
      <div className={`h-36 bg-gradient-to-br ${gradientClass} relative flex items-center justify-center overflow-hidden`}>
        <Package className="text-white/20 group-hover:text-white/40 transition-all duration-500 group-hover:scale-110" size={56} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${colorClass} bg-white/90 backdrop-blur-sm`}>
          {product.category}
        </span>
        <span className="absolute top-3 right-3 text-xs font-bold text-white bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
          ₹{product.pricePerMeter}/m
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1 group-hover:text-indigo-700 transition-colors">
          {product.title}
        </h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">
          {product.description || 'Premium quality fabric for your business needs.'}
        </p>

        {/* Meta info */}
        <div className="space-y-2 mb-4 py-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Price</span>
            <span className="font-bold text-emerald-600 text-base">
              ₹{product.pricePerMeter}<span className="text-xs text-slate-400 font-normal">/meter</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">MOQ</span>
            <span className="font-semibold text-slate-700">{product.moq || 50} meters</span>
          </div>
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
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30"
          >
            Send Inquiry
          </button>
        )}
      </div>
    </div>
  );
}

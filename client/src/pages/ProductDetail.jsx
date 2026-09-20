import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShoppingCart, ShieldCheck, Truck, Sparkles, 
  Package, Tag, Palette, Heart 
} from 'lucide-react';
import toast from 'react-hot-toast';
import InquiryModal from '../components/InquiryModal';
import ProductDetailsWithReviews from '../components/ProductDetailsWithReviews';
import useCart from '../hooks/useCart';
import { useGetProductById } from '../api/productApi';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data: product, isLoading: loading } = useGetProductById(id);
  const [selectedColor, setSelectedColor] = useState('');
  const [added, setAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const availableColors = ['#1E293B', '#2563EB', '#059669', '#DC2626', '#D97706'];

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAdded(true);
      toast.success(`${product.title || 'Product'} added to cart!`);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    try {
      const saved = JSON.parse(localStorage.getItem('user_wishlist') || '[]');
      const exists = saved.some((item) => item._id === product._id);
      if (exists) {
        toast.error('Already in your wishlist');
        return;
      }
      const updated = [
        ...saved,
        {
          _id: product._id,
          title: product.title || product.name,
          category: product.category,
          price: product.price || product.pricePerMeter,
          moq: product.moq,
          image: product.image,
        }
      ];
      localStorage.setItem('user_wishlist', JSON.stringify(updated));
      toast.success('Saved to wishlist!');
    } catch {
      toast.error('Could not save to wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#070714] flex flex-col items-center justify-center text-white gap-3">
        <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">Loading textile specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-[#070714] flex flex-col items-center justify-center text-white gap-4 p-4">
        <p className="text-slate-300">Fabric product not found.</p>
        <button
          onClick={() => navigate('/marketplace')}
          className="bg-orange-500 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-bold"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const fallbackImg = 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="min-h-screen bg-[#070714] text-slate-100 font-sans pb-16">
      {/* Top Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold transition cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Catalog
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 pt-4">
        {/* 1. PRODUCT IMAGES */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0f0c1b] border border-purple-900/40 rounded-3xl overflow-hidden aspect-square relative shadow-2xl flex items-center justify-center group">
            <img 
              src={product.image || product.imageUrl || fallbackImg} 
              alt={product.title || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 bg-[#070714]/80 backdrop-blur-md border border-purple-500/30 text-orange-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {product.category || 'Fabric'}
            </div>
            {product.gsm && (
              <div className="absolute bottom-4 left-4 bg-purple-950/90 backdrop-blur-md border border-purple-700/50 text-purple-200 px-3 py-1 rounded-xl text-xs font-mono font-bold">
                {product.gsm} GSM Spec
              </div>
            )}
          </div>
        </div>

        {/* 2. PRODUCT INFORMATION */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
                <Tag size={14} /> Verified Mill Direct
              </div>
              <button
                onClick={handleAddToWishlist}
                className="p-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/40 text-pink-400 transition flex items-center gap-1.5 text-xs cursor-pointer"
              >
                <Heart size={16} /> Save to Wishlist
              </button>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {product.title || product.name}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
              {product.description || 'Premium industrial grade textile fabric manufactured with high-tensile yarns suitable for apparel and industrial garment manufacturing.'}
            </p>
          </div>

          {/* Pricing & Stock Grid */}
          <div className="p-6 bg-[#0f0c1b] border border-purple-900/40 rounded-2xl grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Wholesale Rate</span>
              <div className="text-2xl font-black text-orange-400 mt-1">
                ₹{product.price || product.pricePerMeter || 0} <span className="text-xs text-slate-400 font-normal">/ meter</span>
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Minimum Order (MOQ)</span>
              <div className="text-base font-bold text-white mt-1">
                {product.moq || 50} meters
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Stock Status</span>
              <div className="text-base font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                <Package size={16} />
                {product.stock || 50} m Available
              </div>
            </div>
          </div>

          {/* Fabric Specifications Table */}
          {(product.composition || product.gsm || product.width || product.weaveType) && (
            <div className="bg-[#0f0c1b]/60 border border-purple-900/30 rounded-2xl p-4 text-xs space-y-2">
              <h4 className="font-bold text-slate-200">Fabric Specifications</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-400">
                {product.composition && <div><span className="block text-[10px] text-slate-500">Composition</span><strong className="text-white">{product.composition}</strong></div>}
                {product.gsm && <div><span className="block text-[10px] text-slate-500">Weight</span><strong className="text-white">{product.gsm} GSM</strong></div>}
                {product.width && <div><span className="block text-[10px] text-slate-500">Width</span><strong className="text-white">{product.width}</strong></div>}
                {product.weaveType && <div><span className="block text-[10px] text-slate-500">Weave</span><strong className="text-white">{product.weaveType}</strong></div>}
              </div>
            </div>
          )}

          {/* Available Colors Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Palette size={14} /> Available Color Swatches
            </label>
            <div className="flex items-center gap-3 pt-1">
              {availableColors.map((hex, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(hex)}
                  style={{ backgroundColor: hex }}
                  className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                    selectedColor === hex ? 'border-orange-400 scale-110 shadow-lg' : 'border-purple-900 hover:scale-105'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 border py-3.5 rounded-2xl font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                  added 
                    ? 'bg-emerald-600 border-emerald-500 text-white' 
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 hover:from-orange-600 hover:to-amber-600 border-transparent shadow-orange-500/20'
                }`}
              >
                <ShoppingCart size={16} /> {added ? 'Added to Cart!' : 'Add to Cart (Wholesale)'}
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 py-3.5 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles size={16} className="text-orange-400" /> Request Custom Mill Quote
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 px-1">
              <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-400" /> Bureau Veritas Quality Tested</span>
              <span className="flex items-center gap-1"><Truck size={14} className="text-cyan-400" /> Pan-India Freight Logistics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Buyer Reviews & Ratings */}
      <ProductDetailsWithReviews productId={product._id} />

      {/* Inquiry Modal */}
      {isModalOpen && (
        <InquiryModal
          product={product}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
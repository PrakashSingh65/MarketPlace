import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, ShoppingCart, ShieldCheck, Truck, Sparkles, 
  Layers, Package, Tag, Palette 
} from 'lucide-react';
import InquiryModal from '../components/InquiryModal';
import { CartContext, useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // CartContext support (Direct Context or useCart Hook fallback)
  const cartCtx = useContext(CartContext);
  const cartHook = useCart ? useCart() : null;
  const addToCart = cartCtx?.addToCart || cartHook?.addToCart;

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  // Default color options if backend doesn't provide them
  const availableColors = ['#1E293B', '#2563EB', '#059669', '#DC2626', '#D97706'];

  useEffect(() => {
    // Try fetching product by ID from backend, fallback to standard catalog item if offline
    axios.get(`http://localhost:5000/api/fabrics/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback Product Data for UI Evaluation
        setProduct({
          _id: id,
          title: 'Premium Organic Cotton Fabric',
          category: 'Cotton',
          description: 'High-grade, breathable 100% organic combed cotton suitable for apparel, home textiles, and custom garments. Features vibrant color fastness, soft hand-feel, and exceptional durability.',
          pricePerMeter: 280,
          price: 280,
          minOrderQty: 50,
          stockAvailable: 12500,
          specifications: {
            GSM: '180-200 GSM',
            Weave: 'Plain Weave',
            Width: '58 Inches (147 cm)',
            Composition: '100% Organic Cotton',
            Shrinkage: 'Less than 2%'
          },
          image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800'
        });
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } else {
      alert('Cart Service unavailable');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-sm">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      
      {/* Top Breadcrumb & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold transition"
        >
          <ArrowLeft size={16} /> Back to Marketplace
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
        
        {/* 1. PRODUCT IMAGES & GALLERY */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden aspect-square relative shadow-2xl flex items-center justify-center group">
            <img 
              src={product.image || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800'} 
              alt={product.title || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {product.category || 'Fabric'}
            </div>
          </div>
        </div>

        {/* 2. PRODUCT INFORMATION & BUYER EVALUATION */}
        <div className="space-y-6">
          
          {/* Header & Category */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
              <Tag size={14} /> Verified Supplier Item
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{product.title || product.name}</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">{product.description}</p>
          </div>

          {/* Pricing & Stock Grid */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl grid grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Wholesale Price</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                ₹{product.pricePerMeter || product.price} <span className="text-xs text-slate-400 font-normal">/ meter</span>
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Available Stock</span>
              <div className="text-lg font-bold text-white mt-1 flex items-center gap-1.5">
                <Package size={16} className="text-indigo-400" />
                {product.stockAvailable || '10,000+'} meters
              </div>
            </div>
          </div>

          {/* Available Colors Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Palette size={14} /> Available Colors
            </label>
            <div className="flex items-center gap-3 pt-1">
              {availableColors.map((hex, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(hex)}
                  style={{ backgroundColor: hex }}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    selectedColor === hex ? 'border-indigo-400 scale-110 shadow-lg' : 'border-slate-800 hover:scale-105'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Specifications Table */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={14} /> Product Specifications
            </h3>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-xs space-y-2.5">
              {Object.entries(product.specifications || {
                GSM: '180-200 GSM',
                Weave: 'Plain Weave',
                Width: '58 Inches',
                Composition: '100% Organic Cotton'
              }).map(([key, val]) => (
                <div key={key} className="flex justify-between py-1 border-b border-slate-800/50 last:border-0">
                  <span className="text-slate-400 font-medium">{key}</span>
                  <span className="text-slate-100 font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons: Add to Cart & Request Bulk Quote */}
          <div className="pt-4 space-y-3">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 border py-3.5 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                  added 
                    ? 'bg-emerald-600 border-emerald-500 text-white' 
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-white'
                }`}
              >
                <ShoppingCart size={16} /> {added ? 'Added to Cart!' : 'Add to Cart'}
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-2xl font-bold text-xs transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                <Sparkles size={16} /> Request Bulk Quote
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 px-1">
              <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-400" /> Verified Mill Quality</span>
              <span className="flex items-center gap-1"><Truck size={14} className="text-indigo-400" /> Direct Mill Logistics</span>
            </div>
          </div>

        </div>
      </div>

      {/* Inquiry Modal */}
      {InquiryModal && (
        <InquiryModal
          product={product}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
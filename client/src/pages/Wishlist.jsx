import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import useCart from '../hooks/useCart';

const sampleWishlist = [
  {
    _id: 'sample-wish-1',
    title: '100% Combed Cotton Single Jersey (180 GSM)',
    category: 'Cotton',
    price: 240,
    moq: 50,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800',
    inStock: true
  },
  {
    _id: 'sample-wish-2',
    title: 'Indigo Dyed Selvedge Denim 13.5 Oz',
    category: 'Denim',
    price: 480,
    moq: 100,
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&q=80&w=800',
    inStock: true
  }
];

export default function Wishlist() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('user_wishlist');
      if (saved) return JSON.parse(saved);
      localStorage.setItem('user_wishlist', JSON.stringify(sampleWishlist));
      return sampleWishlist;
    } catch {
      return sampleWishlist;
    }
  });

  const handleRemove = (id) => {
    const updated = wishlist.filter((item) => item._id !== id);
    setWishlist(updated);
    localStorage.setItem('user_wishlist', JSON.stringify(updated));
    toast.success('Removed from wishlist');
  };

  const handleMoveToCart = (item) => {
    addToCart(item);
  };

  return (
    <div className="min-h-screen bg-[#070714] text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-900/40 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-purple-400 font-semibold mb-1">
              <button onClick={() => navigate(-1)} className="hover:underline flex items-center gap-1">
                <ArrowLeft size={14} /> Back
              </button>
              <span>/</span>
              <span>Buyer Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
              <Heart className="text-pink-500 fill-pink-500" size={26} /> My Saved Wishlist
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Keep track of favorite fabric weaves, yarn specs, and mills for upcoming manufacturing runs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/marketplace"
              className="text-xs font-semibold px-4 py-2 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 rounded-xl transition flex items-center gap-1.5"
            >
              Explore More Fabrics <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-[#0f0c1b]/80 border border-purple-900/40 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-xl">
            <div className="w-16 h-16 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <Heart size={32} />
            </div>
            <h2 className="text-xl font-black text-white">Your Wishlist is Empty</h2>
            <p className="text-xs text-slate-400">
              Bookmark textiles in the marketplace to review sample swatches and order bulk rolls later.
            </p>
            <Link
              to="/marketplace"
              className="inline-block w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold py-3 rounded-xl text-xs transition shadow-lg shadow-orange-500/20"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div
                key={item._id}
                className="bg-[#0f0c1b]/90 border border-purple-900/40 rounded-2xl overflow-hidden shadow-xl hover:border-orange-500/40 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 w-full bg-slate-900 relative overflow-hidden">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-[#070714]/80 backdrop-blur-md border border-purple-500/30 text-orange-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {item.category || 'Textile'}
                    </span>
                    <button
                      onClick={() => handleRemove(item._id)}
                      title="Remove"
                      className="absolute top-3 right-3 bg-red-950/80 hover:bg-red-900 text-red-400 p-2 rounded-xl border border-red-500/30 transition cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-slate-100 line-clamp-2">{item.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>MOQ: {item.moq || 50} m</span>
                      <span>•</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <ShieldCheck size={12} /> Verified Mill
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-purple-900/30 flex items-center justify-between gap-3 mt-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Wholesale Rate</span>
                    <span className="text-lg font-black text-orange-400">₹{item.price} <span className="text-xs text-slate-400 font-normal">/ meter</span></span>
                  </div>
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
                  >
                    <ShoppingCart size={14} /> Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

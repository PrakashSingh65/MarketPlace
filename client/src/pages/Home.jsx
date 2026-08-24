import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Smartphone, Sparkles, Zap, Diamond, Rocket, Laptop } from 'lucide-react';

// HERO SECTION COMPONENT
function InlineHeroSection() {
  return (
    <section className="relative bg-[#070714] text-white py-12 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-3xl border border-purple-900/40 my-4 max-w-7xl mx-auto shadow-[0_0_50px_rgba(112,0,255,0.2)]">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-orange-500/20 via-purple-600/30 to-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-5 justify-between">
          <div className="flex-1 bg-[#0f0c1b]/80 backdrop-blur-md rounded-2xl p-5 border border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.25)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition duration-300">
            <span className="text-[10px] font-extrabold tracking-widest text-orange-400 uppercase bg-orange-950/80 border border-orange-500/30 px-2 py-0.5 rounded-full">
              Innovate. Design.
            </span>
            <h3 className="text-xl font-black mt-3 bg-gradient-to-r from-orange-200 to-amber-400 bg-clip-text text-transparent">
              Inspire.
            </h3>
            <p className="text-xs text-slate-400 mt-2">Next-gen UI elements and cosmic design aesthetics.</p>
            <button className="mt-4 px-4 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-xs shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:scale-105 transition flex items-center gap-1">
              Explore <ArrowRight size={12} />
            </button>
          </div>

          <div className="flex-1 bg-[#0f0c1b]/80 backdrop-blur-md rounded-2xl p-5 border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.25)]">
            <h3 className="text-lg font-extrabold text-blue-300">We Create <br /><span className="text-cyan-400">Digital Magic</span></h3>
            <p className="text-xs text-slate-400 mt-1">High-performance React components with cyber glow.</p>
            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 w-3/4 rounded-full animate-pulse" />
            </div>
          </div>

          <div className="hidden sm:flex lg:flex bg-[#0f0c1b]/80 backdrop-blur-md rounded-2xl p-4 border border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.2)] items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-950/60 border border-pink-500/40 text-pink-400">
              <Smartphone size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-pink-200">Mobile Ready</p>
              <p className="text-[10px] text-slate-400">Ultra responsive layouts</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-[#0a0817]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-orange-500/60 shadow-[0_0_40px_rgba(249,115,22,0.3)] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_#ef4444]" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_#eab308]" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_#22c55e]" />
            </div>
            <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/30">
              <Sparkles size={13} className="text-orange-400" /> Cyber Edition 2026
            </div>
          </div>

          <div className="space-y-5 my-auto">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Build Stunning <br />
              <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                Web Experiences
              </span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-md leading-relaxed">
              Elevate your e-commerce ecosystem with cosmic aesthetics, ultra-fast rendering, and interactive neon component libraries.
            </p>
            <div className="pt-2">
              <Link 
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(249,115,22,0.6)] hover:scale-105 transition duration-300"
              >
                Get Started Now <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-800/80">
            <div className="bg-slate-900/60 border border-orange-500/30 rounded-xl p-2.5 flex items-center gap-2">
              <Zap size={18} className="text-orange-400" />
              <div>
                <p className="text-[10px] text-slate-400">Speed</p>
                <p className="text-xs font-bold text-white">Ultra Fast</p>
              </div>
            </div>
            <div className="bg-slate-900/60 border border-purple-500/30 rounded-xl p-2.5 flex items-center gap-2">
              <Diamond size={18} className="text-purple-400" />
              <div>
                <p className="text-[10px] text-slate-400">Design</p>
                <p className="text-xs font-bold text-white">Premium UI</p>
              </div>
            </div>
            <div className="bg-slate-900/60 border border-cyan-500/30 rounded-xl p-2.5 flex items-center gap-2">
              <Rocket size={18} className="text-cyan-400" />
              <div>
                <p className="text-[10px] text-slate-400">Deploy</p>
                <p className="text-xs font-bold text-white">Instant</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-5 justify-between">
          <div className="flex-1 bg-[#0f0c1b]/80 backdrop-blur-md rounded-2xl p-5 border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-slate-900/80 border border-purple-500/30">
                <p className="text-lg font-black text-orange-400">120+</p>
                <p className="text-[9px] text-slate-400 uppercase">Ui Kits</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-purple-500/30">
                <p className="text-lg font-black text-purple-400">2.5K</p>
                <p className="text-[9px] text-slate-400 uppercase">Users</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/80 border border-purple-500/30">
                <p className="text-lg font-black text-pink-400">98%</p>
                <p className="text-[9px] text-slate-400 uppercase">Score</p>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-[#0f0c1b]/80 backdrop-blur-md rounded-2xl p-5 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
            <div className="h-20 bg-slate-900/80 rounded-xl mb-3 border border-cyan-500/20 flex items-center justify-center">
              <p className="text-xs font-bold text-cyan-300">⚡ 60 FPS Smooth Render</p>
            </div>
            <h4 className="text-sm font-bold text-slate-200">Crafted for Performance</h4>
            <button className="mt-2 w-full py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              View Benchmarks
            </button>
          </div>

          <div className="hidden sm:flex lg:flex bg-[#0f0c1b]/80 backdrop-blur-md rounded-2xl p-4 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-400">
              <Laptop size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-200">Desktop Optimized</p>
              <p className="text-[10px] text-slate-400">Seamless Dashboard UI</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// MAIN HOME PAGE (Accepts props passed from App.jsx)
export default function Home({ searchQuery = '', selectedCategory = 'For You' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/products`);
        if (res.ok) {
          const data = await res.json();
          setProducts(Array.isArray(data) ? data : data.products || []);
        }
      } catch (error) {
        console.error("Products fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [apiUrl]);

  const filteredProducts = products.filter((product) => {
    const titleMatch = (product.title || product.name || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    const categoryMatch =
      selectedCategory === 'For You' ||
      (product.category || '').toLowerCase() === selectedCategory.toLowerCase();

    return titleMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-[#070714] text-slate-100 pb-12 font-sans">
      {/* Dynamic Hero Section */}
      <InlineHeroSection />

      {/* Featured Products Section */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 space-y-6 mt-6">
        <div className="bg-[#0a0817] border border-orange-500/40 rounded-3xl p-5 sm:p-6 shadow-[0_0_30px_rgba(249,115,22,0.2)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-lg sm:text-xl font-bold">Featured Products</h2>
            <Link to="/products" className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition shadow-[0_0_12px_rgba(249,115,22,0.5)]">
              <ChevronRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10 text-slate-400 font-medium">Loading products...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {filteredProducts.slice(0, 5).map((item) => (
                <Link 
                  to={`/product/${item._id || item.id}`} 
                  key={item._id || item.id} 
                  className="bg-[#0f0c1b] border border-purple-900/40 rounded-2xl p-4 shadow hover:border-orange-500/60 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition duration-300 flex flex-col items-center group cursor-pointer"
                >
                  <div className="h-32 w-full bg-slate-900/60 rounded-xl overflow-hidden mb-3 flex items-center justify-center p-2">
                    <img 
                      src={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400'} 
                      alt={item.title || item.name} 
                      className="h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm text-center line-clamp-1">{item.title || item.name}</h4>
                  <p className="text-xs text-cyan-400 font-semibold mt-1">View Store</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-[#0f0c1b] rounded-2xl p-8 text-center border border-purple-900/40">
              <p className="text-slate-400 font-medium">No products found!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
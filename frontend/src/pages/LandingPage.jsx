import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Package, Layers, Shield, Droplets, Gem, Wind, Leaf, Shirt, 
  Search, Send, Truck, ArrowRight, CheckCircle2, Sparkles, Star, Award, ChevronRight
} from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/products`);
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data.slice(0, 8));
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { 
      name: 'Cotton', 
      icon: Droplets, 
      desc: 'Organic, Combed & Carded Yarns', 
      image: '/cotton_fabric_1785859945537.jpg',
      color: 'from-blue-600/90 to-slate-900/90',
      badge: 'High Demand'
    },
    { 
      name: 'Silk', 
      icon: Gem, 
      desc: 'Mulberry, Tussar & Raw Silks', 
      image: '/silk_fabric_1785859961505.jpg',
      color: 'from-purple-600/90 to-slate-900/90',
      badge: 'Luxury'
    },
    { 
      name: 'Denim', 
      icon: Shirt, 
      desc: 'Rigid, Stretch & Selvedge Denim', 
      image: '/denim_fabric_1785859976884.jpg',
      color: 'from-indigo-600/90 to-slate-900/90',
      badge: 'Trending'
    },
    { 
      name: 'Polyester', 
      icon: Layers, 
      desc: 'Microfiber, Crepe & Satin Blends', 
      image: '/cotton_fabric_1785859945537.jpg',
      color: 'from-cyan-600/90 to-slate-900/90',
      badge: 'Bulk Ready'
    },
    { 
      name: 'Wool', 
      icon: Wind, 
      desc: 'Merino, Cashmere & Blends', 
      image: '/silk_fabric_1785859961505.jpg',
      color: 'from-amber-600/90 to-slate-900/90',
      badge: 'Winter Special'
    },
    { 
      name: 'Linen', 
      icon: Leaf, 
      desc: 'Pure Flax, Cambric & Cotton Linen', 
      image: '/cotton_fabric_1785859945537.jpg',
      color: 'from-emerald-600/90 to-slate-900/90',
      badge: 'Eco Friendly'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-slate-800">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/textile_hero_bg_1785859871075.jpg" 
            alt="Hero textile texture background" 
            className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_70%)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center flex flex-col items-center">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-semibold mb-8 backdrop-blur-md animate-fade-in shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>India's Next-Gen B2B Textile Ecosystem</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.15] mb-8">
            Source Wholesale Fabrics <br className="hidden sm:block" />
            Directly From <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400">Verified Mills & Mills Direct</span>
          </h1>

          <p className="text-lg sm:text-2xl text-slate-300 max-w-3xl font-light leading-relaxed mb-10">
            Eliminate middlemen. Discover 10,000+ certified textiles, compare bulk pricing, transparent MOQ limits, and trade with verified Indian manufacturers.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link 
              to="/marketplace" 
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Explore Marketplace</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/register" 
              className="px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-500 rounded-2xl font-bold text-lg backdrop-blur-md hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Become a Verified Supplier</span>
            </Link>
          </div>

          {/* Micro Stats Row */}
          <div className="mt-16 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl w-full text-slate-400 text-sm font-medium">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white">500+</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Verified Textile Mills</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white">10,000+</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Fabric Catalogs</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white">₹0</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Brokerage Fee</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white">100%</span>
              <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Trade Assurance</span>
            </div>
          </div>

        </div>
      </section>

      {/* FLOATING HIGHLIGHT STATS BAR */}
      <section className="relative z-20 max-w-6xl mx-auto px-6 -mt-12">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">Best Wholesale Rates</div>
              <div className="text-xs text-slate-400">Direct factory prices</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">Verified Sellers</div>
              <div className="text-xs text-slate-400">GST & Quality audited</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">Flexible MOQ</div>
              <div className="text-xs text-slate-400">From 50m to bulk rolls</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">Quality Guarantee</div>
              <div className="text-xs text-slate-400">Sample testing options</div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION WITH IMAGE CARDS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">Curated Collections</div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Explore Fabric Categories</h2>
          </div>
          <p className="text-slate-400 max-w-md mt-4 md:mt-0 text-sm">
            Browse through specialized textile grades tailored for garment manufacturers, exporters, and retail chains.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div 
                key={cat.name}
                onClick={() => navigate(`/marketplace?category=${cat.name}`)}
                className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-slate-800 hover:border-indigo-500/50 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10"
              >
                {/* Background Image */}
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 filter brightness-90 contrast-110"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-90 group-hover:opacity-95 transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                      {cat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-3xl font-extrabold text-white mb-2 group-hover:translate-x-1 transition-transform">
                      {cat.name}
                    </h3>
                    <p className="text-slate-300 text-sm font-medium mb-4">
                      {cat.desc}
                    </p>

                    <div className="inline-flex items-center gap-2 text-indigo-300 font-bold text-sm group-hover:text-white transition-colors">
                      <span>Browse Products</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED PRODUCTS GRID */}
      <section className="py-20 px-6 bg-slate-900/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Live Inventory</div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Featured Fabric Listings</h2>
            </div>
            <Link 
              to="/marketplace" 
              className="hidden sm:inline-flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
            >
              <span>View All 10,000+ Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-slate-800/50 animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-800/40 rounded-3xl border border-slate-800 text-slate-400">
              No products found in the live catalog right now.
            </div>
          )}

          <div className="mt-10 text-center sm:hidden">
            <Link to="/marketplace" className="inline-flex items-center gap-2 text-indigo-400 font-bold">
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">Simple Workflow</div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">How TexMarket Works</h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Designed specifically for wholesale textile trade. Transparent, direct, and hassle-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group hover:border-indigo-500/40 transition-all">
            <div className="text-7xl font-black text-slate-800 absolute top-4 right-4 pointer-events-none group-hover:text-indigo-950 transition-colors">01</div>
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">1. Discover Fabrics</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Filter fabrics by fiber type, weight (GSM), composition, weave, price per meter, and minimum order quantity.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group hover:border-violet-500/40 transition-all">
            <div className="text-7xl font-black text-slate-800 absolute top-4 right-4 pointer-events-none group-hover:text-violet-950 transition-colors">02</div>
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-6">
              <Send className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">2. Send Direct Inquiry</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Request samples, negotiate customized bulk discounts, and specify delivery requirements directly with the seller.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="text-7xl font-black text-slate-800 absolute top-4 right-4 pointer-events-none group-hover:text-emerald-950 transition-colors">03</div>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">3. Fulfill & Ship</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Finalize payment terms, track dispatch from textile hubs (Surat, Ahmedabad, Tirupur, Kanpur), and receive goods.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="relative rounded-3xl p-10 sm:p-16 overflow-hidden border border-indigo-500/30 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
              Ready to Upgrade Your Textile Sourcing Strategy?
            </h2>
            <p className="text-slate-300 text-lg mb-10 font-light">
              Join India's premier digital textile network. Register as a Buyer to browse wholesale rates, or list your Mill products as a Supplier today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/register" 
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition-all text-center"
              >
                Create Free Account
              </Link>
              <Link 
                to="/marketplace" 
                className="px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl font-bold text-lg backdrop-blur-md transition-all text-center"
              >
                Explore All Products
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

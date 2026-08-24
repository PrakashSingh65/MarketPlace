import React, { useState } from 'react';
import { 
  Search, ShoppingCart, User, ChevronDown, MapPin, 
  ArrowRight 
} from 'lucide-react';

export default function MarketplaceHome() {
  const [searchQuery, setSearchQuery] = useState('');

  // Categories Data
  const categories = [
    { name: 'For You', icon: '🛍️', active: true },
    { name: 'Fashion', icon: '👕' },
    { name: 'Mobiles', icon: '📱' },
    { name: 'Electronics', icon: '💻' },
    { name: 'Beauty', icon: '💄' },
    { name: 'Home', icon: '🛋️' },
    { name: 'Appliances', icon: '📺' },
    { name: 'Toys, Baby...', icon: '🧸' },
    { name: 'Food & H...', icon: '🥫' },
    { name: 'Auto Acc...', icon: '🛞' },
    { name: 'Sports & ...', icon: '🏏' },
    { name: 'Furniture', icon: '🪑' },
    { name: 'Books & ...', icon: '📚' },
    { name: '2 Wheele...', icon: '🛵' }
  ];

  // Featured Banners
  const banners = [
    {
      title: 'Phone (4b)',
      subtitle: 'From ₹30,999*',
      tagline: "Keep everyone's eyes on you",
      bg: 'from-blue-600 to-indigo-900',
      badge: 'FREEDOM SALE',
      brand: 'NOTHING (R)'
    },
    {
      title: 'vivo T5 Lite 44W 5G',
      subtitle: 'Sale is live',
      tagline: '1% to 50% charging in 38 mins*',
      bg: 'from-sky-700 to-slate-900',
      badge: 'FREEDOM SALE',
      brand: 'vivo'
    },
    {
      title: 'Entertainment your way',
      subtitle: 'Just ₹9,119*',
      tagline: 'Multiple easy accessible ports',
      bg: 'from-amber-800 to-zinc-900',
      brand: 'FOXSKY'
    }
  ];

  // Deals Products
  const deals = [
    { id: 1, title: 'Shoe Racks & Storage', image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=300&auto=format&fit=crop&q=60' },
    { id: 2, title: 'Study Tables', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300&auto=format&fit=crop&q=60' },
    { id: 3, title: 'Drawers & Organizers', image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=300&auto=format&fit=crop&q=60' },
    { id: 4, title: 'Home Temples', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&auto=format&fit=crop&q=60' }
  ];

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 font-sans pb-10">
      
      {/* 1. TOP HEADER */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-2.5">
          
          {/* Top Info Strip */}
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <div className="flex items-center gap-2">
              {/* Flipkart updated to Marketplace */}
              <span className="bg-indigo-600 font-bold px-3 py-1 rounded-md text-white flex items-center gap-1 shadow-sm">
                🏬 Marketplace
              </span>
              <button className="bg-slate-100 px-3 py-1 rounded-md hover:bg-slate-200 transition font-medium flex items-center gap-1">
                ✈️ Travel
              </button>
            </div>
            <div className="flex items-center gap-1 text-slate-600">
              <MapPin size={14} />
              <span>Location not set</span>
              <button className="text-indigo-600 font-semibold hover:underline ml-1">
                Select delivery location &gt;
              </button>
            </div>
          </div>

          {/* Search Bar & User Actions */}
          <div className="flex items-center gap-6">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Products, Brands and More"
                className="w-full bg-slate-50 border border-slate-200 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-6 text-sm font-medium text-slate-700">
              <button className="flex items-center gap-1 hover:text-indigo-600">
                <User size={18} />
                Login <ChevronDown size={14} />
              </button>
              <button className="flex items-center gap-1 hover:text-indigo-600">
                More <ChevronDown size={14} />
              </button>
              <button className="flex items-center gap-1.5 hover:text-indigo-600">
                <ShoppingCart size={18} />
                Cart
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* 2. CATEGORIES NAVIGATION */}
      <div className="bg-white border-b border-slate-200 shadow-sm overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6 text-xs font-semibold whitespace-nowrap">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col items-center gap-1 cursor-pointer transition ${
                cat.active ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-4 space-y-6">
        
        {/* 3. PROMOTIONAL BANNERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {banners.map((b, idx) => (
            <div 
              key={idx} 
              className={`bg-gradient-to-r ${b.bg} text-white rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-48 shadow-md`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-black tracking-widest uppercase opacity-80">{b.brand}</span>
                  {b.badge && (
                    <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                      {b.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-extrabold mt-2">{b.title}</h3>
                <p className="text-lg font-bold text-yellow-300 mt-1">{b.subtitle}</p>
              </div>

              <p className="text-xs text-slate-200">{b.tagline}</p>
              <span className="absolute bottom-2 right-2 text-[9px] bg-black/40 px-1.5 py-0.5 rounded text-slate-300">
                AD
              </span>
            </div>
          ))}
        </div>

        {/* 4. BEST DEALS SECTION */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Best Deals on Furniture</h2>
            <button className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition">
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {deals.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group"
              >
                <div className="aspect-square overflow-hidden bg-slate-100">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 text-center">
                  <p className="text-xs font-semibold text-slate-700 truncate">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
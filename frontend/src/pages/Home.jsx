import React from 'react';
import { 
  Search, 
  MapPin, 
  User, 
  ChevronDown, 
  ShoppingCart, 
  ArrowRight,
  Shirt,
  Smartphone,
  Tv,
  Home as HomeIcon,
  Sparkles,
  ShoppingBag,
  Dumbbell,
  Armchair,
  BookOpen,
  Bike
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  // Categories Bar Data
  const categories = [
    { name: 'For You', icon: ShoppingBag, active: true },
    { name: 'Fashion', icon: Shirt },
    { name: 'Mobiles', icon: Smartphone },
    { name: 'Electronics', icon: Tv },
    { name: 'Beauty', icon: Sparkles },
    { name: 'Home', icon: HomeIcon },
    { name: 'Appliances', icon: Tv },
    { name: 'Sports', icon: Dumbbell },
    { name: 'Furniture', icon: Armchair },
    { name: 'Books', icon: BookOpen },
    { name: '2 Wheelers', icon: Bike },
  ];

  // Best Deals Products
  const furnitureDeals = [
    { id: 1, title: 'Shoe Racks', price: 'From ₹499', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400' },
    { id: 2, title: 'Laptop Tables', price: 'From ₹299', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400' },
    { id: 3, title: 'Storage Cabinets', price: 'From ₹799', image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400' },
    { id: 4, title: 'Wooden Temples', price: 'From ₹1,299', image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-12">
      
      {/* 1. TOP HEADER SECTION */}
      <header className="bg-white sticky top-0 z-50 border-b border-slate-200 shadow-sm px-4 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logo & Switcher */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200">
              <button className="bg-yellow-400 font-bold text-slate-900 px-4 py-1.5 rounded-full text-xs shadow-sm flex items-center gap-1">
                <span>🛒</span> TexMarket
              </button>
              <button className="text-slate-600 font-medium px-4 py-1.5 rounded-full text-xs hover:bg-slate-200 transition flex items-center gap-1">
                ✈️ Travel
              </button>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500 md:hidden">
              <MapPin size={14} className="text-slate-700" />
              <span>Select location</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:max-w-2xl">
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search for Products, Brands and More"
              className="w-full bg-sky-50/50 border border-sky-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
          </div>

          {/* Location & Right Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-1 text-xs text-slate-600 font-medium">
              <MapPin size={14} className="text-slate-800" />
              <span>Location not set</span>
              <button className="text-blue-600 font-semibold hover:underline ml-1">
                Select delivery location &gt;
              </button>
            </div>

            <div className="flex items-center gap-5">
              <button className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-indigo-600">
                <User size={18} /> Login <ChevronDown size={14} />
              </button>
              <button className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-indigo-600">
                More <ChevronDown size={14} />
              </button>
              <Link to="/cart" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-indigo-600">
                <ShoppingCart size={18} /> Cart
              </Link>
            </div>
          </div>

        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 space-y-4 mt-3">

        {/* 2. CATEGORIES NAVIGATION BAR */}
        <div className="bg-white rounded-xl shadow-sm p-3 border border-slate-200/80 overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-between min-w-max gap-4 sm:gap-6 px-2">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <button
                  key={idx}
                  className={`flex flex-col items-center gap-1.5 group transition cursor-pointer ${
                    cat.active ? 'border-b-2 border-indigo-600 pb-1' : ''
                  }`}
                >
                  <div className={`p-2 rounded-xl transition ${
                    cat.active ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-600 group-hover:bg-slate-100 group-hover:text-indigo-600'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <span className={`text-[11px] font-medium ${cat.active ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. PROMO BANNERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Banner 1 */}
          <div className="bg-gradient-to-r from-sky-100 to-indigo-100 rounded-2xl p-5 border border-sky-200 relative overflow-hidden flex justify-between items-center min-h-[160px]">
            <div>
              <span className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">Freedom Sale</span>
              <h3 className="text-xl font-black text-slate-900 mt-2">NOTHING (R)</h3>
              <p className="text-sm font-bold text-slate-700">Phone (2a) <br/><span className="text-base text-indigo-700">From ₹23,999*</span></p>
            </div>
            <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300" alt="Phone" className="w-24 h-32 object-cover rounded-lg shadow-md rotate-6" />
          </div>

          {/* Banner 2 */}
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-5 border border-purple-200 relative overflow-hidden flex justify-between items-center min-h-[160px]">
            <div>
              <span className="bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">Sale is Live</span>
              <h3 className="text-xl font-black text-slate-900 mt-2">vivo T3 5G</h3>
              <p className="text-sm font-bold text-slate-700">44W Fast Charge <br/><span className="text-base text-purple-700">Just ₹15,999*</span></p>
            </div>
            <img src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300" alt="Vivo Phone" className="w-24 h-32 object-cover rounded-lg shadow-md -rotate-3" />
          </div>

          {/* Banner 3 */}
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-5 border border-amber-200 relative overflow-hidden flex justify-between items-center min-h-[160px]">
            <div>
              <span className="bg-amber-600 text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">Exclusive</span>
              <h3 className="text-xl font-black text-slate-900 mt-2">Smart TVs</h3>
              <p className="text-sm font-bold text-slate-700">4K Ultra HD <br/><span className="text-base text-amber-800">Just ₹9,119*</span></p>
            </div>
            <img src="https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300" alt="Smart TV" className="w-28 h-28 object-cover rounded-lg shadow-md" />
          </div>

        </div>

        {/* 4. BEST DEALS CAROUSEL SECTION */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              Best Deals on Furniture
            </h2>
            <button className="bg-black text-white p-2 rounded-full hover:bg-slate-800 transition">
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Product Items Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {furnitureDeals.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between group cursor-pointer"
              >
                <div className="aspect-square bg-slate-50 rounded-lg overflow-hidden mb-3">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="text-center">
                  <h4 className="font-semibold text-slate-800 text-sm line-clamp-1">{item.title}</h4>
                  <p className="text-emerald-600 font-bold text-xs mt-1">{item.price}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
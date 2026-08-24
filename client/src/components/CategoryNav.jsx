import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Shirt, 
  Smartphone, 
  Laptop, 
  Sparkles, 
  Lamp, 
  Tv, 
  Baby, 
  Utensils, 
  Bike, 
  Trophy, 
  Armchair, 
  BookOpen, 
  Compass,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const categoriesData = [
  { 
    id: 'for-you', 
    label: 'For You', 
    icon: ShoppingBag,
    subCategories: [] 
  },
  { 
    id: 'mobiles', 
    label: 'Mobiles', 
    icon: Smartphone,
    subCategories: [
      { name: 'iPhone', image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=150' },
      { name: 'Vivo', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=150' },
      { name: 'OPPO', image: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=150' },
      { name: 'POCO', image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=150' },
      { name: 'Redmi', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150' },
      { name: 'Samsung', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=150' },
      { name: 'realme', image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=150' },
      { name: 'Nothing', image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=150' },
      { name: 'Google', image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=150' },
      { name: 'Motorola', image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=150' }
    ]
  },
  { 
    id: 'fashion', 
    label: 'Fashion', 
    icon: Shirt,
    subCategories: [
      { name: "Men's Wear", image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=150' },
      { name: "Women's Wear", image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=150' },
      { name: 'Kids Wear', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=150' },
      { name: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150' }
    ]
  },
  { 
    id: 'electronics', 
    label: 'Electronics', 
    icon: Laptop,
    subCategories: [
      { name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=150' },
      { name: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150' },
      { name: 'Smartwatches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150' },
      { name: 'Monitors', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=150' }
    ]
  },
  { id: 'beauty', label: 'Beauty', icon: Sparkles, subCategories: [] },
  { id: 'home', label: 'Home', icon: Lamp, subCategories: [] },
  { id: 'appliances', label: 'Appliances', icon: Tv, subCategories: [] },
  { id: 'toys', label: 'Toys, ba...', icon: Baby, subCategories: [] },
  { id: 'food', label: 'Food & H...', icon: Utensils, subCategories: [] },
  { id: 'auto', label: 'Auto Acc...', icon: Compass, subCategories: [] },
  { id: 'sports', label: 'Sports & ...', icon: Trophy, subCategories: [] },
  { id: 'furniture', label: 'Furniture', icon: Armchair, subCategories: [] },
  { id: 'books', label: 'Books & ...', icon: BookOpen, subCategories: [] },
  { id: '2wheelers', label: '2 Wheele...', icon: Bike, subCategories: [] }
];

export default function CategoryNav({ onSelectCategory, onSelectSubCategory }) {
  const [activeCategory, setActiveCategory] = useState('for-you');
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleSelect = (cat) => {
    setActiveCategory(cat.id);
    if (onSelectCategory) onSelectCategory(cat.id);

    // Dropdown toggle
    if (cat.subCategories && cat.subCategories.length > 0) {
      setOpenDropdown(openDropdown === cat.id ? null : cat.id);
    } else {
      setOpenDropdown(null);
    }
  };

  const currentCategoryData = categoriesData.find(c => c.id === openDropdown);

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800">
      {/* 1. Main Category Horizontal Navigation */}
      <div className="max-w-7xl mx-auto flex items-center gap-6 overflow-x-auto scrollbar-none scroll-smooth py-3 px-4">
        {categoriesData.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          const hasSub = cat.subCategories && cat.subCategories.length > 0;

          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat)}
              className="flex flex-col items-center gap-1.5 min-w-[64px] group focus:outline-none transition-all cursor-pointer relative"
            >
              {/* Icon Container */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600/30 text-yellow-400 border border-indigo-500/50 shadow-md scale-105'
                    : 'bg-slate-800/80 text-slate-300 group-hover:bg-slate-800 group-hover:text-yellow-400'
                }`}
              >
                <Icon size={22} strokeWidth={1.8} />
              </div>

              {/* Label + Dropdown Icon */}
              <div className="flex items-center gap-0.5">
                <span
                  className={`text-[11px] whitespace-nowrap tracking-tight transition-colors ${
                    isActive
                      ? 'font-bold text-white'
                      : 'font-medium text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </span>
                {hasSub && (
                  openDropdown === cat.id ? (
                    <ChevronUp size={12} className="text-yellow-400" />
                  ) : (
                    <ChevronDown size={12} className="text-slate-400 group-hover:text-white" />
                  )
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Sub-Category Grid Banner (Flipkart Style Sub-menu) */}
      {currentCategoryData && currentCategoryData.subCategories.length > 0 && (
        <div className="bg-slate-950/90 border-t border-slate-800 py-6 px-4 animate-fade-in shadow-2xl">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs text-slate-400 font-semibold mb-4 uppercase tracking-wider">
              Popular in {currentCategoryData.label}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-4">
              {currentCategoryData.subCategories.map((sub, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectSubCategory && onSelectSubCategory(sub.name)}
                  className="flex flex-col items-center gap-2 p-2 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 rounded-xl transition cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-lg bg-slate-950 overflow-hidden p-1 border border-slate-800 group-hover:scale-105 transition">
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-300 group-hover:text-indigo-400 text-center line-clamp-1">
                    {sub.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
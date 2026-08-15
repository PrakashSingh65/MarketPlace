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
  Compass 
} from 'lucide-react';

const categories = [
  { id: 'for-you', label: 'For You', icon: ShoppingBag },
  { id: 'fashion', label: 'Fashion', icon: Shirt },
  { id: 'mobiles', label: 'Mobiles', icon: Smartphone },
  { id: 'electronics', label: 'Electronics', icon: Laptop },
  { id: 'beauty', label: 'Beauty', icon: Sparkles },
  { id: 'home', label: 'Home', icon: Lamp },
  { id: 'appliances', label: 'Appliances', icon: Tv },
  { id: 'toys', label: 'Toys, ba...', icon: Baby },
  { id: 'food', label: 'Food & H...', icon: Utensils },
  { id: 'auto', label: 'Auto Acc...', icon: Compass },
  { id: 'sports', label: 'Sports & ...', icon: Trophy },
  { id: 'furniture', label: 'Furniture', icon: Armchair },
  { id: 'books', label: 'Books & ...', icon: BookOpen },
  { id: '2wheelers', label: '2 Wheele...', icon: Bike },
];

export default function CategoryNav({ onSelectCategory }) {
  const [activeCategory, setActiveCategory] = useState('for-you');

  const handleSelect = (id) => {
    setActiveCategory(id);
    if (onSelectCategory) onSelectCategory(id);
  };

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-6 overflow-x-auto scrollbar-none scroll-smooth">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className="flex flex-col items-center gap-1.5 min-w-[64px] group focus:outline-none transition-all"
            >
              {/* Icon Container */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-500/20 text-yellow-400 border border-sky-400/30 shadow-md scale-105'
                    : 'bg-slate-800/80 text-slate-300 group-hover:bg-slate-800 group-hover:text-yellow-400'
                }`}
              >
                <Icon size={22} strokeWidth={1.8} />
              </div>

              {/* Label */}
              <span
                className={`text-[11px] whitespace-nowrap tracking-tight transition-colors ${
                  isActive
                    ? 'font-bold text-white'
                    : 'font-medium text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shirt, Smartphone, Tv, Home as HomeIcon, Sparkles, 
  ShoppingBag, Dumbbell, Armchair, BookOpen, Bike 
} from 'lucide-react';

const CATEGORY_MAP = {
  Fashion: ["Men's Wear", "Women's Wear", "Kids Wear", "Footwear"],
  Mobiles: ["iPhone", "Vivo", "OPPO", "POCO", "Redmi", "Samsung", "realme"],
  Electronics: ["Laptops", "Headphones", "Smartwatches", "Monitors"],
  Beauty: ["Skincare", "Makeup", "Haircare"],
  Home: ["Furniture", "Decor", "Kitchen"],
  Appliances: ["TVs", "Refrigerators", "Washing Machines"],
  Sports: ["Fitness", "Outdoor Games", "Gym Gear"],
  Furniture: ["Beds", "Sofas", "Tables"],
  Books: ["Fiction", "Non-Fiction", "Academic"],
  "2 Wheelers": ["Electric Scooters", "Bikes"]
};

export default function CategoryBar({ selectedCategory, setSelectedCategory }) {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const navigate = useNavigate();

  const categories = [
    { name: 'For You', icon: ShoppingBag },
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

  const handleSubCategoryClick = (category, sub) => {
    setHoveredCategory(null);
    navigate(`/products?category=${category.toLowerCase()}&subCategory=${encodeURIComponent(sub)}`);
  };

  return (
    <div className="bg-[#0a0817] border-b border-purple-900/30 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between min-w-max gap-4 sm:gap-6">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.name;
          const hasSub = CATEGORY_MAP[cat.name];

          return (
            <div 
              key={idx}
              className="relative group"
              onMouseEnter={() => setHoveredCategory(cat.name)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <button
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex flex-col items-center gap-1 transition cursor-pointer ${
                  isActive ? 'border-b-2 border-orange-500 pb-1 text-orange-400 font-bold' : 'text-slate-300 hover:text-cyan-400'
                }`}
              >
                <div className="p-1">
                  <Icon size={20} />
                </div>
                <span className="text-xs font-medium">
                  {cat.name}
                </span>
              </button>

              {hoveredCategory === cat.name && hasSub && (
                <div className="absolute top-full left-0 bg-[#0f0c1b] border border-purple-900/60 rounded-xl shadow-2xl py-2 min-w-[170px] z-50 mt-1">
                  {hasSub.map((sub, sIdx) => (
                    <div
                      key={sIdx}
                      onClick={() => handleSubCategoryClick(cat.name, sub)}
                      className="px-4 py-2 text-xs font-medium text-slate-300 hover:bg-purple-900/40 hover:text-orange-400 cursor-pointer transition"
                    >
                      {sub}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
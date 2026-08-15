import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORY_MAP = {
  Fashion: ["Men's Wear", "Women's Wear", "Kids Wear", "Footwear"],
  Mobiles: ["iPhone", "Vivo", "OPPO", "POCO", "Redmi", "Samsung", "realme"],
  Electronics: ["Laptops", "Headphones", "Smartwatches", "Monitors"],
  Beauty: ["Skincare", "Makeup", "Haircare"],
  Home: ["Furniture", "Decor", "Kitchen"],
  Appliances: ["TVs", "Refrigerators", "Washing Machines"],
  Toys: ["Action Figures", "Board Games"],
  "Food & Health": ["Snacks", "Beverages"],
  Auto: ["Car Accessories", "Bike Accessories"],
  "2 Wheelers": ["Electric Scooters", "Bikes"]
};

export default function CategoryHeader() {
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();

  const handleSubCategoryClick = (category, subCategory) => {
    setActiveCategory(null);
    navigate(`/products?category=${category.toLowerCase()}&subCategory=${encodeURIComponent(subCategory)}`);
  };

  return (
    <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
      
      {/* Category List Bar */}
      <div style={{ display: 'flex', gap: '24px', padding: '12px 24px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <button 
          onClick={() => navigate('/products')}
          style={{ border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer', color: '#1e293b' }}
        >
          For You
        </button>

        {Object.keys(CATEGORY_MAP).map((cat) => (
          <div
            key={cat}
            onMouseEnter={() => setActiveCategory(cat)}
            onMouseLeave={() => setActiveCategory(null)}
            style={{ position: 'relative', cursor: 'pointer', paddingBottom: '4px' }}
          >
            <span style={{ fontSize: '14px', color: activeCategory === cat ? '#2563eb' : '#334155', fontWeight: '500' }}>
              {cat}
            </span>

            {/* Sub-Category Hover Dropdown Menu */}
            {activeCategory === cat && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: '0',
                  backgroundColor: '#ffffff',
                  boxShadow: '0px 10px 25px rgba(0,0,0,0.15)',
                  borderRadius: '8px',
                  padding: '8px 0',
                  minWidth: '180px',
                  zIndex: 1000,
                  border: '1px solid #e2e8f0'
                }}
              >
                {CATEGORY_MAP[cat].map((sub) => (
                  <div
                    key={sub}
                    onClick={() => handleSubCategoryClick(cat, sub)}
                    style={{
                      padding: '10px 16px',
                      fontSize: '13px',
                      color: '#1e293b',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {sub}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
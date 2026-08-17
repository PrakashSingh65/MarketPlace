import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleSubCategoryClick = (category, subCategory) => {
    setActiveCategory(null);
    navigate(`/products?category=${category.toLowerCase()}&subCategory=${encodeURIComponent(subCategory)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    setUser(null);
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', width: '100%', position: 'sticky', top: 0, zIndex: 1000 }}>
      
      {/* Top Navbar Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', gap: '16px', maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Logo */}
        <h2 
          onClick={() => navigate('/')} 
          style={{ cursor: 'pointer', color: '#2563eb', fontWeight: 'bold', fontSize: '22px', margin: 0 }}
        >
          Store
        </h2>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, maxWidth: '500px' }}>
          <input
            type="text"
            placeholder="Search for Products, Brands and More"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 14px',
              borderRadius: '6px 0 0 6px',
              border: '1px solid #cbd5e1',
              outline: 'none',
              fontSize: '14px'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '0 6px 6px 0',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            Search
          </button>
        </form>

        {/* Auth / Profile Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
          {user ? (
            <div 
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
              style={{ position: 'relative', cursor: 'pointer' }}
            >
              <button 
                style={{
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  color: '#1e293b',
                  cursor: 'pointer'
                }}
              >
                Hi, {user.name || 'Account'} ▾
              </button>

              {isUserMenuOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  backgroundColor: '#fff',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  width: '180px',
                  padding: '6px 0',
                  zIndex: 2000
                }}>
                  <div 
                    onClick={() => navigate('/profile')}
                    style={{ padding: '10px 16px', fontSize: '14px', color: '#334155', cursor: 'pointer' }}
                  >
                    My Profile
                  </div>
                  <div 
                    onClick={() => navigate('/supplier-dashboard')}
                    style={{ padding: '10px 16px', fontSize: '14px', color: '#334155', cursor: 'pointer' }}
                  >
                    Seller Dashboard
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '4px 0' }} />
                  <div 
                    onClick={handleLogout}
                    style={{ padding: '10px 16px', fontSize: '14px', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => navigate('/login')}
                style={{
                  backgroundColor: 'transparent',
                  color: '#2563eb',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #2563eb',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                style={{
                  backgroundColor: '#2563eb',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Sign Up
              </button>
            </div>
          )}

          <button 
            onClick={() => navigate('/cart')}
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', color: '#334155', paddingLeft: '8px' }}
          >
            Cart
          </button>
        </div>

      </div>

      {/* Category Bar with Dropdown Fix */}
      <div style={{ borderTop: '1px solid #f1f5f9', backgroundColor: '#fff', position: 'relative' }}>
        <div style={{ display: 'flex', gap: '24px', padding: '10px 24px', maxWidth: '1280px', margin: '0 auto', overflowX: 'visible', flexWrap: 'wrap' }}>
          
          <span 
            onClick={() => { setActiveCategory(null); navigate('/products'); }}
            style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', color: '#1e293b' }}
          >
            All Categories
          </span>

          {Object.keys(CATEGORY_MAP).map((cat) => (
            <div
              key={cat}
              onMouseEnter={() => setActiveCategory(cat)}
              onMouseLeave={() => setActiveCategory(null)}
              style={{ position: 'relative', cursor: 'pointer', display: 'inline-block' }}
            >
              <span 
                onClick={() => { setActiveCategory(null); navigate(`/products?category=${cat.toLowerCase()}`); }}
                style={{ fontSize: '13px', color: activeCategory === cat ? '#2563eb' : '#475569', fontWeight: '500' }}
              >
                {cat} ▾
              </span>

              {/* Fixed Dropdown Menu */}
              {activeCategory === cat && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  borderRadius: '6px',
                  padding: '8px 0',
                  minWidth: '180px',
                  zIndex: 9999,
                  border: '1px solid #cbd5e1'
                }}>
                  {CATEGORY_MAP[cat].map((sub) => (
                    <div
                      key={sub}
                      onClick={() => handleSubCategoryClick(cat, sub)}
                      style={{
                        padding: '10px 16px',
                        fontSize: '13px',
                        color: '#334155',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
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

    </header>
  );
}
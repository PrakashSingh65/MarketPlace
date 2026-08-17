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
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Invalid user json", err);
      }
    }
  }, []);

  // Universal Navigation Helper with Event Prevention & State Reset
  const handleItemClick = (e, path) => {
    e.stopPropagation();
    setIsLoginMenuOpen(false);
    setIsMoreMenuOpen(false);
    setActiveCategory(null);
    navigate(path);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleSubCategoryClick = (e, category, subCategory) => {
    e.stopPropagation();
    setActiveCategory(null);
    navigate(`/products?category=${category.toLowerCase()}&subCategory=${encodeURIComponent(subCategory)}`);
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    setUser(null);
    setIsLoginMenuOpen(false);
    navigate('/login');
  };

  return (
    <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', width: '100%', position: 'sticky', top: 0, zIndex: 1000 }}>
      
      {/* Top Navbar Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', gap: '16px', maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Logo */}
        <h2 
          onClick={(e) => handleItemClick(e, '/')} 
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

        {/* Right Menu Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', position: 'relative' }}>
          
          {/* Flipkart Style Login / Account Dropdown */}
          <div 
            onMouseEnter={() => setIsLoginMenuOpen(true)}
            onMouseLeave={() => setIsLoginMenuOpen(false)}
            style={{ position: 'relative', cursor: 'pointer', paddingBottom: '4px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '18px' }}>👤</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                {user ? `Hi, ${user.name || 'User'}` : 'Login'}
              </span>
              <span style={{ fontSize: '12px' }}>{isLoginMenuOpen ? '▴' : '▾'}</span>
            </div>

            {isLoginMenuOpen && (
              <div style={{
                position: 'absolute',
                right: '-40px',
                top: '100%',
                backgroundColor: '#ffffff',
                boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                width: '240px',
                padding: '8px 0',
                zIndex: 9999
              }}>
                
                {/* Header: New Customer / Signup Link */}
                <div style={{ 
                  display: 'flex', 
                  justify: 'space-between', 
                  alignItems: 'center', 
                  padding: '10px 16px', 
                  borderBottom: '1px solid #f1f5f9' 
                }}>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                    {user ? 'Logged in' : 'New customer?'}
                  </span>
                  {!user ? (
                    <span 
                      onClick={(e) => handleItemClick(e, '/signup')}
                      style={{ fontSize: '13px', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Sign Up
                    </span>
                  ) : (
                    <span 
                      onClick={handleLogout}
                      style={{ fontSize: '13px', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Logout
                    </span>
                  )}
                </div>

                {/* Dropdown Items List */}
                <div 
                  onClick={(e) => handleItemClick(e, '/profile')}
                  style={{ padding: '10px 16px', fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span>👤</span> <span>My Profile</span>
                </div>

                <div 
                  onClick={(e) => handleItemClick(e, '/plus-zone')}
                  style={{ padding: '10px 16px', fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span>✨</span> <span>Flipkart Plus Zone</span>
                </div>

                <div 
                  onClick={(e) => handleItemClick(e, '/orders')}
                  style={{ padding: '10px 16px', fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span>📦</span> <span>Orders</span>
                </div>

                <div 
                  onClick={(e) => handleItemClick(e, '/wishlist')}
                  style={{ padding: '10px 16px', fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span>❤️</span> <span>Wishlist</span>
                </div>

                <div 
                  onClick={(e) => handleItemClick(e, '/supplier-dashboard')}
                  style={{ padding: '10px 16px', fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span>🏪</span> <span>Become a Seller</span>
                </div>

                <div 
                  onClick={(e) => handleItemClick(e, '/rewards')}
                  style={{ padding: '10px 16px', fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span>🎁</span> <span>Rewards</span>
                </div>

                <div 
                  onClick={(e) => handleItemClick(e, '/gift-cards')}
                  style={{ padding: '10px 16px', fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span>💳</span> <span>Gift Cards</span>
                </div>

                <div 
                  onClick={(e) => handleItemClick(e, '/notifications')}
                  style={{ padding: '10px 16px', fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span>🔔</span> <span>Notification Preferences</span>
                </div>

                <div 
                  onClick={(e) => handleItemClick(e, '/customer-care')}
                  style={{ padding: '10px 16px', fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span>🎧</span> <span>24x7 Customer Care</span>
                </div>

                <div 
                  onClick={(e) => handleItemClick(e, '/advertise')}
                  style={{ padding: '10px 16px', fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span>📺</span> <span>Advertise</span>
                </div>

                <div 
                  onClick={(e) => handleItemClick(e, '/download-app')}
                  style={{ padding: '10px 16px', fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span>📥</span> <span>Download App</span>
                </div>

              </div>
            )}
          </div>

          {/* Flipkart Style 'More' Dropdown */}
          <div 
            onMouseEnter={() => setIsMoreMenuOpen(true)}
            onMouseLeave={() => setIsMoreMenuOpen(false)}
            style={{ position: 'relative', cursor: 'pointer', paddingBottom: '4px' }}
          >
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>
              More {isMoreMenuOpen ? '▴' : '▾'}
            </span>

            {isMoreMenuOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                backgroundColor: '#ffffff',
                boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                width: '210px',
                padding: '8px 0',
                zIndex: 9999
              }}>
                <div 
                  onClick={(e) => handleItemClick(e, '/supplier-dashboard')}
                  style={{ padding: '10px 16px', fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  🛒 <span>Become a Seller</span>
                </div>

                <div 
                  onClick={(e) => handleItemClick(e, '/notifications')}
                  style={{ padding: '10px 16px', fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  🔔 <span>Notification Settings</span>
                </div>

                <div 
                  onClick={(e) => handleItemClick(e, '/customer-care')}
                  style={{ padding: '10px 16px', fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  🎧 <span>24x7 Customer Care</span>
                </div>

                <div 
                  onClick={(e) => handleItemClick(e, '/advertise')}
                  style={{ padding: '10px 16px', fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  📺 <span>Advertise on Store</span>
                </div>
              </div>
            )}
          </div>

          {/* Cart Button */}
          <button 
            onClick={(e) => handleItemClick(e, '/cart')}
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}
          >
            🛒 Cart
          </button>
        </div>

      </div>

      {/* Category Bar */}
      <div style={{ borderTop: '1px solid #f1f5f9', backgroundColor: '#fff', position: 'relative' }}>
        <div style={{ display: 'flex', gap: '24px', padding: '10px 24px', maxWidth: '1280px', margin: '0 auto', overflowX: 'visible', flexWrap: 'wrap' }}>
          
          <span 
            onClick={(e) => handleItemClick(e, '/products')}
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
                onClick={(e) => handleItemClick(e, `/products?category=${cat.toLowerCase()}`)}
                style={{ fontSize: '13px', color: activeCategory === cat ? '#2563eb' : '#475569', fontWeight: '500' }}
              >
                {cat} ▾
              </span>

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
                      onClick={(e) => handleSubCategoryClick(e, cat, sub)}
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
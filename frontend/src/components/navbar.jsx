import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, maxWidth: '500px' }}>
      <input
        type="text"
        placeholder="Search for Products, Brands and More"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 16px',
          borderRadius: '8px 0 0 8px',
          border: '1px solid #cbd5e1',
          outline: 'none'
        }}
      />
      <button
        type="submit"
        style={{
          padding: '10px 16px',
          backgroundColor: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: '0 8px 8px 0',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Search
      </button>
    </form>
  );
}
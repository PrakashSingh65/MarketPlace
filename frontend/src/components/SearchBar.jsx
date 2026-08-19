import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(val.trim())}`);
    } else {
      navigate('/marketplace');
    }
  };

  const handleClear = () => {
    setQuery('');
    navigate('/marketplace');
  };

  return (
    <form onSubmit={handleSearchSubmit} className="relative w-full">
      <div className="relative flex items-center w-full">
        <Search className="absolute left-3.5 text-purple-400 pointer-events-none" size={18} />
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for Products, Brands and More..."
          className="w-full bg-purple-950/40 border border-purple-500/30 rounded-xl pl-10 pr-10 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-orange-500/80 focus:ring-1 focus:ring-orange-500/80 transition"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-slate-400 hover:text-slate-200"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </form>
  );
}
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';

export default function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="flex-1 max-w-2xl mx-2 relative flex items-center"
    >
      <div className="relative w-full flex items-center">
        {/* Search Icon */}
        <button 
          type="submit" 
          className="absolute left-3 text-gray-400 hover:text-white transition-colors focus:outline-none"
          title="Search"
        >
          <Search size={18} />
        </button>

        {/* Input Field */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(e);
            }
          }}
          placeholder="Search for Products, Brands and More"
          className="w-full bg-[#181033] border border-orange-500/60 rounded-full py-2 pl-10 pr-10 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
        />

        {/* Clear Icon */}
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-gray-400 hover:text-white transition-colors focus:outline-none"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </form>
  );
}
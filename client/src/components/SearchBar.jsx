import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SearchBar() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const handleClear = () => {
    setQuery('');
    navigate('/search');
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="relative flex items-center w-full">
        <Search className="absolute left-3.5 text-purple-400 pointer-events-none" size={18} />
        
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            navigate(`/search?q=${encodeURIComponent(e.target.value)}`);
          }}
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
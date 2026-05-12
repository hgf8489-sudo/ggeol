import { useState, useRef, useEffect } from 'react';
import { searchTickers } from '../../api/client.js';

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleChange(e) {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    if (!val.trim()) { setResults([]); setOpen(false); setError(null); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchTickers(val);
        setResults(data);
        setOpen(data.length > 0);
      } catch (err) {
        console.error('[SearchBar] 검색 실패:', err);
        setError(err.message);
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 350);
  }

  function handleSelect(item) {
    setQuery(item.name);
    setOpen(false);
    onSelect(item);
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="종목명 또는 티커 검색 (예: 삼성, AAPL, bitcoin)"
          className="w-full bg-surface-card border border-white/10 rounded-xl px-5 py-4
                     text-white placeholder-white/30 text-lg focus:outline-none
                     focus:border-accent-blue/60 transition-colors"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-accent-blue/40 border-t-accent-blue rounded-full animate-spin" />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-down px-1">{error}</p>
      )}

      {open && results.length > 0 && (
        <ul className="absolute top-full mt-2 w-full bg-surface-card border border-white/10
                       rounded-xl overflow-hidden shadow-2xl z-50 animate-fade-in">
          {results.map((item) => (
            <li
              key={`${item.type}-${item.ticker}`}
              onClick={() => handleSelect(item)}
              className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-hover
                         cursor-pointer transition-colors"
            >
              <div>
                <span className="font-semibold text-white">{item.name}</span>
                <span className="ml-2 text-sm text-white/40 font-mono">{item.ticker}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                item.type === 'crypto'
                  ? 'bg-accent-gold/20 text-accent-gold'
                  : 'bg-accent-blue/20 text-accent-blue'
              }`}>
                {item.type === 'crypto' ? '코인' : '주식'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

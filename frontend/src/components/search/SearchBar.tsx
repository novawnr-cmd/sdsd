'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiClock, FiTrendingUp, FiX } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { useDebounce } from '@/hooks/useDebounce';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface SearchResult {
  _id: string;
  name: { ar: string; en: string };
  slug: string;
  price: number;
  images: string[];
}

export default function SearchBar() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions] = useState<string[]>(['Phone', 'Laptop', 'Shoes', 'Watch', 'Bag']);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      api.get(`/products?search=${debouncedQuery}&limit=5`).then((res) => {
        setResults(res.data.data || []);
      }).catch(() => {});
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
    setQuery('');
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <FiSearch className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-300" size={20} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder={t('common.search') + '...'}
          className="w-full ps-12 pe-4 py-3 bg-gray-100 dark:bg-dark-50 border-0 rounded-xl text-gray-900 dark:text-dark-800 placeholder:text-gray-400 dark:placeholder:text-dark-300 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full bg-white dark:bg-dark-50 rounded-2xl shadow-xl border border-gray-100 dark:border-dark-100 overflow-hidden z-50"
          >
            {results.length > 0 && (
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-400 dark:text-dark-300 px-3 mb-2">{t('search.products')}</p>
                {results.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => handleSearch(item.name[lang])}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-100 transition-colors text-start"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-dark-100 overflow-hidden shrink-0">
                      {item.images[0] && (
                        <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-dark-800 truncate">
                        {item.name[lang]}
                      </p>
                      <p className="text-xs text-primary font-semibold">{item.price} {t('common.currency')}</p>
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => handleSearch(query)}
                  className="w-full text-center py-2 text-sm text-primary hover:text-primary-600 font-medium transition-colors"
                >
                  {t('common.viewAll')} →
                </button>
              </div>
            )}

            {results.length === 0 && query.length < 2 && (
              <div className="p-4 space-y-4">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-400 dark:text-dark-300 flex items-center gap-1">
                        <FiClock size={12} /> {t('search.recentSearches')}
                      </p>
                      <button onClick={clearRecentSearches} className="text-xs text-red-500 hover:text-red-600">
                        {t('search.clearHistory')}
                      </button>
                    </div>
                    {recentSearches.map((search, i) => (
                      <button
                        key={i}
                        onClick={() => { setQuery(search); handleSearch(search); }}
                        className="w-full text-start px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-100 text-sm text-gray-700 dark:text-dark-500 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold text-gray-400 dark:text-dark-300 flex items-center gap-1 mb-2">
                    <FiTrendingUp size={12} /> {t('search.popularSearches')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setQuery(s); handleSearch(s); }}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-dark-100 rounded-lg text-xs text-gray-600 dark:text-dark-400 hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {query.length >= 2 && results.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-sm text-gray-400 dark:text-dark-300">{t('search.noResultsFound', { query })}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

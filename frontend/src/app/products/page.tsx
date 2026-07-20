'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiFilter, FiX, FiGrid, FiList } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { Product, Category } from '@/types';
import api from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

export default function ProductsPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    sortBy: searchParams.get('sort') || 'newest',
  });

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.rating) params.set('rating', filters.rating);
    params.set('sortBy', filters.sortBy);
    params.set('page', page.toString());
    params.set('limit', '12');

    const search = searchParams.get('q');
    if (search) params.set('search', search);

    api.get(`/products?${params.toString()}`).then((res) => {
      setProducts(res.data.data || []);
      setTotalPages(res.data.pages || 1);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [filters, page, searchParams]);

  const sortOptions = [
    { value: 'newest', label: t('common.new') + ' →' },
    { value: 'price_asc', label: t('common.price') + ' ↑' },
    { value: 'price_desc', label: t('common.price') + ' ↓' },
    { value: 'rating', label: t('product.rating') },
    { value: 'bestselling', label: t('home.bestSellers') },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-800">
          {searchParams.get('q') ? t('search.searchingFor', { query: searchParams.get('q') || '' }) : t('product.allProducts')}
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-dark-50 hover:bg-gray-200 dark:hover:bg-dark-100 transition-colors"
          >
            <FiFilter size={20} />
          </button>
          <div className="w-48">
            <Select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              options={sortOptions}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <aside className={`w-64 shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 p-6 space-y-6 sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-dark-800">{t('common.filter')}</h3>
              <button onClick={() => setShowFilters(false)} className="lg:hidden"><FiX size={20} /></button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-500 mb-2">{t('nav.categories')}</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-dark-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">{t('common.all')}</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name.en}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-500 mb-2">{t('common.price')}</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="px-3 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-dark-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="px-3 py-2 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-dark-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-500 mb-2">{t('product.rating')}</label>
              <div className="flex gap-2">
                {[4, 3, 2, 1].map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilters({ ...filters, rating: filters.rating === r.toString() ? '' : r.toString() })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      filters.rating === r.toString()
                        ? 'bg-primary text-dark-DEFAULT'
                        : 'bg-gray-100 dark:bg-dark-100 text-gray-600 dark:text-dark-400'
                    }`}
                  >
                    {r}+ ★
                  </button>
                ))}
              </div>
            </div>

            <Button variant="ghost" fullWidth onClick={() => setFilters({ category: '', minPrice: '', maxPrice: '', rating: '', sortBy: 'newest' })}>
              {t('common.filter')} reset
            </Button>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <ProductGridSkeleton />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 dark:text-dark-300 text-lg">{t('common.noResults')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-medium text-sm transition-all ${
                        page === i + 1
                          ? 'bg-primary text-dark-DEFAULT'
                          : 'bg-gray-100 dark:bg-dark-50 text-gray-600 dark:text-dark-400 hover:bg-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

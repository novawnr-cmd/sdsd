'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Product } from '@/types';
import api from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';

export default function SearchPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      api.get(`/products?search=${query}&limit=20`).then((res) => {
        setProducts(res.data.data || []);
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-800 mb-2">
        {t('search.searchingFor', { query })}
      </h1>
      <p className="text-gray-500 dark:text-dark-300 mb-8">
        {products.length} {t('common.results')}
      </p>

      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400 dark:text-dark-300 mb-2">{t('search.noResultsFound', { query })}</p>
          <p className="text-sm text-gray-400 dark:text-dark-300">{t('search.tryDifferent')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}

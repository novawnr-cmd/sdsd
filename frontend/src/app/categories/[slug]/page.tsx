'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Product, Category } from '@/types';
import api from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';

export default function CategoryDetailPage() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/categories/${slug}`),
      api.get(`/products?category=${slug}&limit=20`),
    ]).then(([catRes, prodRes]) => {
      setCategory(catRes.data.data);
      setProducts(prodRes.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-800 mb-8">
        {category?.name.en || t('nav.categories')}
      </h1>
      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="text-center py-20"><p className="text-gray-400">{t('common.noResults')}</p></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Product } from '@/types';
import api from '@/lib/api';
import ProductCarousel from './ProductCarousel';

export default function TrendingProducts() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get('/products?sortBy=bestselling&limit=10').then((res) => {
      setProducts(res.data.data || []);
    }).catch(() => {});
  }, []);

  if (!products.length) return null;

  return (
    <ProductCarousel
      title={t('home.trending')}
      subtitle={t('home.trendingSubtitle')}
      products={products}
      viewAllHref="/products?sort=bestselling"
      viewAllLabel={t('common.viewAll')}
    />
  );
}

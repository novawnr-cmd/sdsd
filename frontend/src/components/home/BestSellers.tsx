'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Product } from '@/types';
import api from '@/lib/api';
import ProductCarousel from './ProductCarousel';

export default function BestSellers() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get('/products?isBestSeller=true&limit=10').then((res) => {
      setProducts(res.data.data || []);
    }).catch(() => {});
  }, []);

  if (!products.length) return null;

  return (
    <ProductCarousel
      title={t('home.bestSellers')}
      subtitle={t('home.bestSellersSubtitle')}
      products={products}
      viewAllHref="/products?sort=bestselling"
      viewAllLabel={t('common.viewAll')}
    />
  );
}

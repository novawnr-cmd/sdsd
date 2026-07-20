'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { useWishlistStore } from '@/store/wishlistStore';
import ProductCard from '@/components/product/ProductCard';

export default function WishlistPage() {
  const { t } = useLanguage();
  const { items } = useWishlistStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-800 mb-8">{t('nav.wishlist')}</h1>
      {items.length === 0 ? (
        <div className="text-center py-20">
          <FiHeart size={48} className="mx-auto text-gray-300 dark:text-dark-200 mb-4" />
          <p className="text-gray-500 dark:text-dark-300 mb-4">{t('cart.cartEmptyDesc')}</p>
          <Link href="/products" className="text-primary hover:text-primary-600 font-medium">{t('cart.startShopping')}</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

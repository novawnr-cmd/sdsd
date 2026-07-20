'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { cn, formatPrice, calculateDiscount } from '@/lib/utils';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { Product } from '@/types';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { t } = useLanguage();
  const wishlisted = isInWishlist(product._id);
  const discount = calculateDiscount(product.price, product.compareAtPrice || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group relative bg-white dark:bg-dark-50/80 backdrop-blur-sm',
        'rounded-2xl border border-gray-100 dark:border-white/5',
        'shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden',
        className
      )}
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-dark-100">
          <Image
            src={product.images[0] || '/placeholder.png'}
            alt={product.name.en}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />

          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                -{discount}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-primary text-dark-DEFAULT text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                {t('common.new')}
              </span>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(product);
                  toast.success(t('success.cartAdded'));
                }}
                className="flex-1 py-2 bg-primary hover:bg-primary-600 text-dark-DEFAULT font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-1"
              >
                <FiShoppingCart size={14} />
                {t('product.addToCart')}
              </button>
            </div>
          </div>
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product);
          toast.success(wishlisted ? t('success.wishlistRemoved') : t('success.wishlistAdded'));
        }}
        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-dark-50/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-sm"
      >
        {wishlisted ? (
          <FaHeart size={16} className="text-red-500" />
        ) : (
          <FiHeart size={16} className="text-gray-400" />
        )}
      </button>

      <Link href={`/products/${product.slug}`} className="block p-4">
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={cn('w-3.5 h-3.5', i < Math.round(product.rating) ? 'text-primary' : 'text-gray-200 dark:text-dark-100')}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-400 dark:text-dark-300">({product.numReviews})</span>
        </div>

        <h3 className="text-sm font-medium text-gray-900 dark:text-dark-800 line-clamp-2 mb-2 group-hover:text-primary transition-colors min-h-[40px]">
          {product.name.en}
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

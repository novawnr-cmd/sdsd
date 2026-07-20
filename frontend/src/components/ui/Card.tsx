'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { cn, formatPrice, calculateDiscount } from '@/lib/utils';
import { useWishlistStore } from '@/store/wishlistStore';
import { Product } from '@/types';

interface CardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: CardProps) {
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const wishlisted = isInWishlist(product._id);
  const discount = calculateDiscount(product.price, product.compareAtPrice || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group bg-white dark:bg-dark-50/80 backdrop-blur-sm',
        'rounded-2xl border border-gray-100 dark:border-white/5',
        'shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden',
        className
      )}
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-dark-100">
          <Image
            src={product.images[0] || '/placeholder.png'}
            alt={product.name.en}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              -{discount}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="absolute top-3 left-3 bg-primary text-dark-DEFAULT text-xs font-bold px-2.5 py-1 rounded-lg">
              NEW
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className="absolute top-3 left-3 p-2 rounded-full bg-white/80 dark:bg-dark-50/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
        >
          {wishlisted ? (
            <FaHeart size={18} className="text-red-500" />
          ) : (
            <FiHeart size={18} className="text-gray-400 hover:text-red-500" />
          )}
        </button>

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium text-gray-900 dark:text-dark-800 line-clamp-2 mb-2 hover:text-primary transition-colors">
            {product.name.en}
          </h3>
        </Link>

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
          <span className="text-xs text-gray-400 dark:text-dark-300 mr-1">
            ({product.numReviews})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

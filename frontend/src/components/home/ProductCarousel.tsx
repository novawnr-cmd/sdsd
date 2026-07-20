'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types';

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

export default function ProductCarousel({ title, subtitle, products, viewAllHref, viewAllLabel }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-dark-800">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 dark:text-dark-300 mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {viewAllHref && (
            <a href={viewAllHref} className="text-primary hover:text-primary-600 font-medium text-sm transition-colors hidden sm:block">
              {viewAllLabel || 'View All →'}
            </a>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-xl bg-gray-100 dark:bg-dark-50 hover:bg-gray-200 dark:hover:bg-dark-100 transition-colors"
            >
              <FiChevronLeft size={20} className="text-gray-600 dark:text-dark-500" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-xl bg-gray-100 dark:bg-dark-50 hover:bg-gray-200 dark:hover:bg-dark-100 transition-colors"
            >
              <FiChevronRight size={20} className="text-gray-600 dark:text-dark-500" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <motion.div
            key={product._id}
            className="shrink-0 w-[200px] sm:w-[240px] md:w-[260px] snap-start"
            whileHover={{ y: -5 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

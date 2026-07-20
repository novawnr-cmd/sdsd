'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Category } from '@/types';
import api from '@/lib/api';

export default function CategoriesPage() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.data || [])).catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-800 mb-8">{t('categories.allCategories')}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Link href={`/categories/${cat.slug}`} className="group block bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="aspect-video bg-gray-100 dark:bg-dark-100 relative overflow-hidden">
                {cat.image ? (
                  <Image src={cat.image} alt={cat.name.en} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300 dark:text-dark-200">📁</div>
                )}
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-900 dark:text-dark-800 group-hover:text-primary transition-colors">{cat.name.en}</h3>
                <p className="text-sm text-gray-400 dark:text-dark-300 mt-1">{cat.productCount} {t('common.items')}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiGrid, FiSmartphone, FiMonitor, FiWatch, FiHome, FiShoppingBag, FiBook, FiTrendingUp } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { Category } from '@/types';
import api from '@/lib/api';

const defaultCategories: Category[] = [
  { _id: '1', name: { ar: 'إلكترونيات', en: 'Electronics' }, slug: 'electronics', icon: 'smartphone', productCount: 245, isActive: true, createdAt: '' },
  { _id: '2', name: { ar: 'أزياء', en: 'Fashion' }, slug: 'fashion', icon: 'shopping-bag', productCount: 890, isActive: true, createdAt: '' },
  { _id: '3', name: { ar: 'منزل', en: 'Home' }, slug: 'home', icon: 'home', productCount: 567, isActive: true, createdAt: '' },
  { _id: '4', name: { ar: 'ساعات', en: 'Watches' }, slug: 'watches', icon: 'watch', productCount: 123, isActive: true, createdAt: '' },
  { _id: '5', name: { ar: 'أجهزة', en: 'Gadgets' }, slug: 'gadgets', icon: 'monitor', productCount: 334, isActive: true, createdAt: '' },
  { _id: '6', name: { ar: 'كتب', en: 'Books' }, slug: 'books', icon: 'book', productCount: 1200, isActive: true, createdAt: '' },
  { _id: '7', name: { ar: 'رياضة', en: 'Sports' }, slug: 'sports', icon: 'trending', productCount: 445, isActive: true, createdAt: '' },
  { _id: '8', name: { ar: 'كل الأقسام', en: 'All Categories' }, slug: 'categories', icon: 'grid', productCount: 0, isActive: true, createdAt: '' },
];

const iconMap: Record<string, React.ReactNode> = {
  smartphone: <FiSmartphone size={28} />,
  'shopping-bag': <FiShoppingBag size={28} />,
  home: <FiHome size={28} />,
  watch: <FiWatch size={28} />,
  monitor: <FiMonitor size={28} />,
  book: <FiBook size={28} />,
  trending: <FiTrendingUp size={28} />,
  grid: <FiGrid size={28} />,
};

export default function CategoryGrid() {
  const { lang, t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  useEffect(() => {
    api.get('/categories?limit=8').then((res) => {
      if (res.data.data?.length) setCategories(res.data.data);
    }).catch(() => {});
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-dark-800">
          {t('home.shopByCategory')}
        </h2>
        <Link href="/categories" className="text-primary hover:text-primary-600 font-medium text-sm transition-colors">
          {t('common.viewAll')} →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Link
              href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-6 bg-white dark:bg-dark-50/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/5 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              {cat.image ? (
                <div className="w-16 h-16 rounded-2xl overflow-hidden relative">
                  <Image src={cat.image} alt={cat.name[lang]} fill sizes="64px" className="object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-dark-DEFAULT transition-all duration-300">
                  {iconMap[cat.icon || 'grid'] || <FiGrid size={28} />}
                </div>
              )}
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 dark:text-dark-800 text-sm group-hover:text-primary transition-colors">
                  {cat.name[lang]}
                </h3>
                {cat.productCount > 0 && (
                  <p className="text-xs text-gray-400 dark:text-dark-300 mt-1">
                    {cat.productCount} {t('common.items')}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

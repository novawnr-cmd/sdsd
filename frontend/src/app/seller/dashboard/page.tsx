'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiPackage, FiShoppingBag, FiDollarSign, FiStar, FiPlus } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

export default function SellerDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0, averageRating: 0 });

  useEffect(() => {
    api.get('/seller/stats').then((res) => setStats(res.data.data || stats)).catch(() => {});
  }, []);

  const cards = [
    { icon: FiPackage, label: t('seller.totalProducts'), value: stats.totalProducts, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { icon: FiShoppingBag, label: t('seller.totalOrders'), value: stats.totalOrders, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
    { icon: FiDollarSign, label: t('seller.totalRevenue'), value: formatPrice(stats.totalRevenue), color: 'text-primary bg-primary/10' },
    { icon: FiStar, label: t('seller.averageRating'), value: stats.averageRating.toFixed(1), color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-800">{t('seller.sellerDashboard')}</h1>
        <Link href="/seller/products/new"><Button leftIcon={<FiPlus size={18} />}>{t('seller.addProduct')}</Button></Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 p-6"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
              <card.icon size={24} />
            </div>
            <p className="text-sm text-gray-500 dark:text-dark-300 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-dark-800">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: '/seller/products', label: t('seller.myProducts'), icon: FiPackage },
          { href: '/seller/orders', label: t('seller.myOrders'), icon: FiShoppingBag },
          { href: '/seller/coupons', label: t('seller.coupons'), icon: FiDollarSign },
          { href: '/seller/analytics', label: t('seller.analytics'), icon: FiStar },
        ].map((item, i) => (
          <Link key={i} href={item.href} className="flex items-center gap-4 p-6 bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 hover:shadow-md hover:border-primary/20 transition-all">
            <item.icon size={24} className="text-primary" />
            <span className="font-semibold text-gray-900 dark:text-dark-800">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

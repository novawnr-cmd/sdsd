'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiShoppingBag, FiPackage, FiDollarSign, FiClock, FiTrendingUp } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { AdminStats } from '@/types';
import api from '@/lib/api';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0, totalSellers: 0, totalProducts: 0, totalOrders: 0,
    totalRevenue: 0, pendingApprovals: 0, monthlyGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then((res) => setStats(res.data.data || stats)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cards = [
    { icon: FiUsers, label: t('admin.totalUsers'), value: stats.totalUsers, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { icon: FiShoppingBag, label: t('admin.totalSellers'), value: stats.totalSellers, color: 'text-primary bg-primary/10' },
    { icon: FiPackage, label: t('admin.totalProducts'), value: stats.totalProducts, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
    { icon: FiDollarSign, label: t('admin.totalRevenue'), value: formatPrice(stats.totalRevenue), color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
    { icon: FiClock, label: t('admin.pendingApprovals'), value: stats.pendingApprovals, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' },
    { icon: FiTrendingUp, label: t('admin.monthlyGrowth'), value: `${stats.monthlyGrowth}%`, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-dark-DEFAULT">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-800 mb-8">{t('admin.adminDashboard')}</h1>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 p-6">
            <h3 className="font-bold text-gray-900 dark:text-dark-800 mb-4">{t('admin.recentOrders')}</h3>
            <p className="text-gray-400 text-sm text-center py-8">{t('common.loading')}</p>
          </div>
          <div className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 p-6">
            <h3 className="font-bold text-gray-900 dark:text-dark-800 mb-4">{t('admin.topSellers')}</h3>
            <p className="text-gray-400 text-sm text-center py-8">{t('common.loading')}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

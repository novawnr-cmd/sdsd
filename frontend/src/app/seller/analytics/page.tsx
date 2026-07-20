'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function SellerAnalyticsPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    monthlyRevenue: 0, totalRevenue: 0, totalSales: 0, conversionRate: 0,
    revenueChart: [] as { month: string; revenue: number }[],
    topProducts: [] as { name: string; sales: number; revenue: number }[],
  });
  const [period, setPeriod] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/seller/analytics?period=${period}`).then((res) => setStats(res.data.data || stats)).catch(() => {}).finally(() => setLoading(false));
  }, [period]);

  const maxRevenue = Math.max(...(stats.revenueChart.map((d) => d.revenue) || [1]));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-800">{t('seller.analytics')}</h1>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-4 py-2 bg-white dark:bg-dark-50 border border-gray-200 dark:border-dark-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50">
          <option value="7">{t('seller.last7Days')}</option>
          <option value="30">{t('seller.last30Days')}</option>
          <option value="90">{t('seller.thisMonth')}</option>
          <option value="365">{t('seller.thisYear')}</option>
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: t('seller.monthlyRevenue'), value: formatPrice(stats.monthlyRevenue) },
          { label: t('seller.totalRevenue'), value: formatPrice(stats.totalRevenue) },
          { label: t('seller.totalSales'), value: stats.totalSales },
          { label: t('seller.conversionRate'), value: `${stats.conversionRate}%` },
        ].map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 p-6">
            <p className="text-sm text-gray-500 dark:text-dark-300 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-dark-800">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 p-6">
          <h3 className="font-bold text-gray-900 dark:text-dark-800 mb-6">{t('seller.revenueChart')}</h3>
          <div className="flex items-end gap-2 h-48">
            {stats.revenueChart.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="w-full bg-primary/80 rounded-t-lg min-h-[4px]"
                />
                <span className="text-[10px] text-gray-400">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 p-6">
          <h3 className="font-bold text-gray-900 dark:text-dark-800 mb-6">{t('seller.topProducts')}</h3>
          <div className="space-y-4">
            {stats.topProducts.map((product, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 w-6">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-dark-800 truncate">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.sales} {t('common.sales')}</p>
                </div>
                <span className="text-sm font-bold text-primary">{formatPrice(product.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

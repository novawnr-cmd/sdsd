'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiPackage } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { Order } from '@/types';
import api from '@/lib/api';
import Badge from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/lib/utils';

export default function OrdersPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then((res) => setOrders(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statusColor = (status: string) => {
    const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'primary'> = {
      pending: 'warning', confirmed: 'info', processing: 'info', shipped: 'primary', delivered: 'success', cancelled: 'danger', returned: 'danger',
    };
    return map[status] || 'secondary';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-800 mb-8">{t('orders.myOrders')}</h1>
      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-32 bg-gray-100 dark:bg-dark-100 rounded-2xl animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <FiPackage size={48} className="mx-auto text-gray-300 dark:text-dark-200 mb-4" />
          <p className="text-gray-500 dark:text-dark-300 mb-4">{t('orders.noOrders')}</p>
          <Link href="/products" className="text-primary hover:text-primary-600 font-medium">{t('orders.startShopping')}</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/orders/${order._id}`} className="block p-6 bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm text-gray-500 dark:text-dark-300">{order.orderNumber}</p>
                    <p className="text-sm text-gray-400">{formatDate(order.createdAt)}</p>
                  </div>
                  <Badge variant={statusColor(order.orderStatus)}>{t(`orders.${order.orderStatus}`)}</Badge>
                  <span className="font-bold text-primary">{formatPrice(order.total)}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

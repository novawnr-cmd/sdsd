'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Order } from '@/types';
import api from '@/lib/api';
import Badge from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/lib/utils';

export default function SellerOrdersPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/seller/orders').then((res) => setOrders(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statusColor = (status: string): 'success' | 'warning' | 'danger' | 'info' | 'primary' => {
    const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'primary'> = {
      pending: 'warning', confirmed: 'info', processing: 'info', shipped: 'primary', delivered: 'success', cancelled: 'danger', returned: 'danger',
    };
    return map[status] || 'secondary';
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/seller/orders/${orderId}/status`, { status });
      setOrders(orders.map((o) => o._id === orderId ? { ...o, orderStatus: status as Order['orderStatus'] } : o));
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-800 mb-8">{t('seller.myOrders')}</h1>

      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 dark:bg-dark-100 rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-dark-100">
                <tr>
                  <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{t('orders.orderNumber')}</th>
                  <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{t('common.total')}</th>
                  <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{t('orders.orderStatus')}</th>
                  <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{t('orders.orderDate')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-dark-100 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-gray-900 dark:text-dark-800">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-sm font-medium text-primary">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusColor(order.orderStatus)}>{t(`orders.${order.orderStatus}`)}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && <p className="text-center py-12 text-gray-400">{t('orders.noOrders')}</p>}
        </div>
      )}
    </div>
  );
}

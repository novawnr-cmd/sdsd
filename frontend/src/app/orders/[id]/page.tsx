'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Order } from '@/types';
import api from '@/lib/api';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><div className="h-96 bg-gray-100 dark:bg-dark-100 rounded-2xl animate-pulse" /></div>;
  if (!order) return <div className="max-w-4xl mx-auto px-4 py-20 text-center"><p className="text-gray-400">{t('errors.orderNotFound')}</p></div>;

  const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const currentStep = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-800 mb-2">{t('orders.orderDetails')}</h1>
      <p className="text-sm text-gray-500 dark:text-dark-300 mb-8 font-mono">{order.orderNumber}</p>

      <div className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 p-6 mb-6">
        <h3 className="font-bold text-gray-900 dark:text-dark-800 mb-4">{t('orders.orderTimeline')}</h3>
        <div className="flex items-center justify-between mb-4">
          {statusSteps.map((step, i) => (
            <React.Fragment key={step}>
              <div className={`flex flex-col items-center gap-1 ${i <= currentStep ? 'text-primary' : 'text-gray-300 dark:text-dark-200'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= currentStep ? 'bg-primary text-dark-DEFAULT' : 'bg-gray-100 dark:bg-dark-100'}`}>{i + 1}</div>
                <span className="text-[10px] hidden sm:block">{t(`orders.${step}`)}</span>
              </div>
              {i < statusSteps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < currentStep ? 'bg-primary' : 'bg-gray-200 dark:bg-dark-100'}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 p-6">
          <h3 className="font-bold text-gray-900 dark:text-dark-800 mb-3">{t('orders.shippingAddress')}</h3>
          <p className="text-sm text-gray-600 dark:text-dark-400">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
          <p className="text-sm text-gray-600 dark:text-dark-400">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
          <p className="text-sm text-gray-600 dark:text-dark-400">{order.shippingAddress.phone}</p>
        </div>
        <div className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 p-6">
          <h3 className="font-bold text-gray-900 dark:text-dark-800 mb-3">{t('orders.paymentMethod')}</h3>
          <p className="text-sm text-gray-600 dark:text-dark-400 capitalize">{order.paymentMethod}</p>
          <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'} className="mt-2">{t(`orders.${order.paymentStatus}`)}</Badge>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 p-6">
        <h3 className="font-bold text-gray-900 dark:text-dark-800 mb-4">{t('orders.orderItems')}</h3>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 dark:border-dark-100 last:border-0">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-dark-100 relative shrink-0">
                <Image src={item.product.images?.[0] || '/placeholder.png'} alt={item.product.name.en} fill sizes="64px" className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-dark-800 text-sm">{item.product.name.en}</p>
                <p className="text-xs text-gray-400">× {item.quantity}</p>
              </div>
              <span className="font-medium text-gray-900 dark:text-dark-800">{formatPrice(item.total)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 dark:border-dark-100 pt-4 mt-4 space-y-2">
          <div className="flex justify-between text-sm"><span className="text-gray-500">{t('common.subtotal')}</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-gray-500">{t('cart.shippingCost')}</span><span>{formatPrice(order.shippingCost)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-sm"><span className="text-green-600">{t('common.discount')}</span><span className="text-green-600">-{formatPrice(order.discount)}</span></div>}
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100 dark:border-dark-100">
            <span>{t('common.total')}</span>
            <span className="text-primary">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

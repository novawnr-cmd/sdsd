'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiClock } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { Product } from '@/types';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

function CountdownTimer({ endDate }: { endDate: Date }) {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = endDate.getTime() - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  const blocks = [
    { value: timeLeft.days, label: t('home.days') },
    { value: timeLeft.hours, label: t('home.hours') },
    { value: timeLeft.minutes, label: t('home.minutes') },
    { value: timeLeft.seconds, label: t('home.seconds') },
  ];

  return (
    <div className="flex gap-3">
      {blocks.map((block, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-xl bg-primary text-dark-DEFAULT flex items-center justify-center">
            <span className="text-xl font-bold">{String(block.value).padStart(2, '0')}</span>
          </div>
          <span className="text-[10px] text-gray-500 dark:text-dark-300 mt-1">{block.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function FlashDeals() {
  const { t } = useLanguage();
  const { addToCart } = useCartStore();
  const [deals, setDeals] = useState<Product[]>([]);
  const endDate = new Date();
  endDate.setHours(endDate.getHours() + 8);

  useEffect(() => {
    api.get('/products?isFeatured=true&limit=6').then((res) => {
      setDeals(res.data.data || []);
    }).catch(() => {});
  }, []);

  if (!deals.length) return null;

  return (
    <section className="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 dark:from-red-500/5 dark:via-orange-500/5 dark:to-red-500/5 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-500 text-white">
            <FiClock size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-dark-800">
              {t('home.flashDeals')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-dark-300">{t('home.flashDealsSubtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-dark-300">{t('home.endsIn')}</span>
          <CountdownTimer endDate={endDate} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {deals.map((product, i) => {
          const discount = calculateDiscount(product.price, product.compareAtPrice || 0);
          return (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="group bg-white dark:bg-dark-50 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5"
            >
              <Link href={`/products/${product.slug}`}>
                <div className="relative aspect-square bg-gray-50 dark:bg-dark-100">
                  <Image
                    src={product.images[0] || '/placeholder.png'}
                    alt={product.name.en}
                    fill
                    sizes="200px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {discount > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                      -{discount}%
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-2">
                    <div className="w-full bg-gray-300/30 rounded-full h-1.5">
                      <div
                        className="bg-primary rounded-full h-1.5 transition-all"
                        style={{ width: `${Math.min((product.totalSales / 100) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
              <div className="p-3">
                <p className="text-xs text-gray-400 line-clamp-1 mb-1">{product.name.en}</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-primary">{formatPrice(product.price)}</span>
                  {product.compareAtPrice && (
                    <span className="text-[10px] text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
                  )}
                </div>
                <Button
                  size="sm"
                  className="w-full mt-2 text-xs py-1.5"
                  onClick={() => {
                    addToCart(product);
                    toast.success(t('success.cartAdded'));
                  }}
                >
                  {t('product.addToCart')}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

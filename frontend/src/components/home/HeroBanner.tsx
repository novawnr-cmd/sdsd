'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { Banner } from '@/types';
import api from '@/lib/api';

const defaultBanners: Banner[] = [
  {
    _id: '1',
    title: { ar: 'عروض نهاية الموسم', en: 'End of Season Sale' },
    subtitle: { ar: 'خصومات تصل إلى 70%', en: 'Up to 70% Off' },
    image: '/banners/hero1.jpg',
    link: '/deals',
    position: 'hero',
    isActive: true,
    order: 1,
    createdAt: '',
  },
  {
    _id: '2',
    title: { ar: 'منتجات جديدة', en: 'New Arrivals' },
    subtitle: { ar: 'اكتشف أحدث صيحات الموضة', en: 'Discover the Latest Fashion Trends' },
    image: '/banners/hero2.jpg',
    link: '/products?sort=newest',
    position: 'hero',
    isActive: true,
    order: 2,
    createdAt: '',
  },
  {
    _id: '3',
    title: { ar: 'أفضل العلامات التجارية', en: 'Top Brands' },
    subtitle: { ar: 'منتجات أصلية بأسعار مميزة', en: 'Authentic Products at Great Prices' },
    image: '/banners/hero3.jpg',
    link: '/categories',
    position: 'hero',
    isActive: true,
    order: 3,
    createdAt: '',
  },
];

export default function HeroBanner() {
  const { lang, t } = useLanguage();
  const [banners, setBanners] = useState<Banner[]>(defaultBanners);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    api.get('/banners?position=hero').then((res) => {
      if (res.data.data?.length) setBanners(res.data.data);
    }).catch(() => {});
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const banner = banners[current];
  if (!banner) return null;

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={banner._id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <Image
            src={banner.image}
            alt={banner.title[lang]}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 sm:pb-16 px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={banner._id + 'text'}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">
              {banner.title[lang]}
            </h2>
            {banner.subtitle && (
              <p className="text-sm sm:text-lg text-gray-200 mb-6 drop-shadow">
                {banner.subtitle[lang]}
              </p>
            )}
            <Link
              href={banner.link || '/products'}
              className="inline-block px-8 py-3 bg-primary hover:bg-primary-600 text-dark-DEFAULT font-bold rounded-xl transition-all hover:shadow-gold-lg text-sm sm:text-base"
            >
              {t('home.heroCTA')}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-all"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-all"
      >
        <FiChevronRight size={24} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === current ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

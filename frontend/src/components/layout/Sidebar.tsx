'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHome, FiGrid, FiShoppingBag, FiTag, FiHeart, FiShoppingCart, FiUser, FiSettings, FiHelpCircle } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t, dir } = useLanguage();

  const links = [
    { href: '/', icon: FiHome, label: t('nav.home') },
    { href: '/categories', icon: FiGrid, label: t('nav.categories') },
    { href: '/products', icon: FiShoppingBag, label: t('nav.products') },
    { href: '/deals', icon: FiTag, label: t('nav.deals') },
    { href: '/wishlist', icon: FiHeart, label: t('nav.wishlist') },
    { href: '/cart', icon: FiShoppingCart, label: t('nav.cart') },
    { href: '/profile', icon: FiUser, label: t('nav.profile') },
    { href: '/settings', icon: FiSettings, label: t('nav.settings') },
    { href: '/help', icon: FiHelpCircle, label: t('nav.help') },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: dir === 'rtl' ? 300 : -300 }}
            animate={{ x: 0 }}
            exit={{ x: dir === 'rtl' ? 300 : -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'fixed top-0 bottom-0 w-72 bg-white dark:bg-dark-DEFAULT z-50 overflow-y-auto',
              dir === 'rtl' ? 'right-0' : 'left-0'
            )}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-extrabold bg-gradient-to-r from-primary via-primary-300 to-primary bg-clip-text text-transparent">
                  {t('common.appName')}
                </span>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-50 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <nav className="space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-dark-500 hover:bg-gray-50 dark:hover:bg-dark-50 font-medium transition-colors"
                  >
                    <link.icon size={20} />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

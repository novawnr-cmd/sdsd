'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSun, FiMoon, FiGlobe, FiChevronDown } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { cn } from '@/lib/utils';
import SearchBar from '@/components/search/SearchBar';

export default function Navbar() {
  const { lang, t, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { itemCount } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/categories', label: t('nav.categories') },
    { href: '/products', label: t('nav.products') },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/80 dark:bg-dark-DEFAULT/80 backdrop-blur-xl shadow-lg border-b border-gray-100/50 dark:border-white/5'
            : 'bg-white dark:bg-dark-DEFAULT'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-50 transition-colors"
              >
                <FiMenu size={24} className="text-gray-700 dark:text-dark-800" />
              </button>

              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-primary via-primary-300 to-primary bg-clip-text text-transparent">
                  {t('common.appName')}
                </span>
              </Link>
            </div>

            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <SearchBar />
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-50 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <FiSun size={20} className="text-primary" />
                ) : (
                  <FiMoon size={20} className="text-gray-600" />
                )}
              </button>

              <button
                onClick={toggleLanguage}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-50 transition-colors"
              >
                <FiGlobe size={20} className="text-gray-600 dark:text-dark-800" />
                <span className="text-xs font-bold ml-1">{lang === 'ar' ? 'EN' : 'ع'}</span>
              </button>

              <Link
                href="/wishlist"
                className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-50 transition-colors"
              >
                <FiHeart size={20} className="text-gray-600 dark:text-dark-800" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-50 transition-colors"
              >
                <FiShoppingCart size={20} className="text-gray-600 dark:text-dark-800" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-dark-DEFAULT text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>

              <div className="relative">
                {isAuthenticated ? (
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <FiChevronDown size={16} className={cn('text-gray-500 transition-transform', userMenuOpen && 'rotate-180')} />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-600 text-dark-DEFAULT font-semibold rounded-xl transition-all hover:shadow-gold"
                  >
                    <FiUser size={18} />
                    <span className="hidden md:inline text-sm">{t('nav.login')}</span>
                  </Link>
                )}

                <AnimatePresence>
                  {userMenuOpen && isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 end-0 w-64 bg-white dark:bg-dark-50 rounded-2xl shadow-xl border border-gray-100 dark:border-dark-100 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-100 dark:border-dark-100">
                        <p className="font-semibold text-gray-900 dark:text-dark-800">{user?.name}</p>
                        <p className="text-sm text-gray-500 dark:text-dark-300">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-100 transition-colors text-sm text-gray-700 dark:text-dark-500" onClick={() => setUserMenuOpen(false)}>
                          {t('nav.profile')}
                        </Link>
                        <Link href="/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-100 transition-colors text-sm text-gray-700 dark:text-dark-500" onClick={() => setUserMenuOpen(false)}>
                          {t('nav.myOrders')}
                        </Link>
                        {(user?.role === 'seller' || user?.role === 'admin') && (
                          <Link href="/seller/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-100 transition-colors text-sm text-gray-700 dark:text-dark-500" onClick={() => setUserMenuOpen(false)}>
                            {t('nav.dashboard')}
                          </Link>
                        )}
                        {user?.role === 'admin' && (
                          <Link href="/system-admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-100 transition-colors text-sm text-gray-700 dark:text-dark-500" onClick={() => setUserMenuOpen(false)}>
                            {t('nav.adminDashboard')}
                          </Link>
                        )}
                        <hr className="my-2 border-gray-100 dark:border-dark-100" />
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-sm text-red-600"
                        >
                          {t('nav.logout')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 pb-3 border-t border-gray-100 dark:border-dark-100 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 dark:text-dark-400 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/deals" className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
              {t('nav.deals')}
            </Link>
            <Link href="/become-seller" className="text-sm font-medium text-primary hover:text-primary-600 transition-colors">
              {t('nav.becomeSeller')}
            </Link>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: lang === 'ar' ? 300 : -300 }}
              animate={{ x: 0 }}
              exit={{ x: lang === 'ar' ? 300 : -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'fixed top-0 bottom-0 w-80 bg-white dark:bg-dark-DEFAULT z-50 lg:hidden overflow-y-auto',
                lang === 'ar' ? 'right-0' : 'left-0'
              )}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-primary via-primary-300 to-primary bg-clip-text text-transparent">
                    {t('common.appName')}
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-50"
                  >
                    <FiX size={24} className="text-gray-700 dark:text-dark-800" />
                  </button>
                </div>

                <div className="mb-6">
                  <SearchBar />
                </div>

                <nav className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-3 rounded-xl text-gray-700 dark:text-dark-500 hover:bg-gray-50 dark:hover:bg-dark-50 font-medium transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/deals"
                    className="block px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.deals')}
                  </Link>
                  <Link
                    href="/become-seller"
                    className="block px-4 py-3 rounded-xl text-primary hover:bg-primary/10 font-medium transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.becomeSeller')}
                  </Link>
                </nav>

                <hr className="my-6 border-gray-100 dark:border-dark-100" />

                <div className="flex items-center gap-4 px-4">
                  <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-50">
                    {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
                  </button>
                  <button onClick={toggleLanguage} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-50">
                    <FiGlobe size={20} />
                  </button>
                </div>

                {!isAuthenticated && (
                  <div className="mt-6 px-4">
                    <Link
                      href="/login"
                      className="block w-full py-3 bg-primary hover:bg-primary-600 text-dark-DEFAULT font-semibold text-center rounded-xl transition-all hover:shadow-gold"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.login')}
                    </Link>
                    <Link
                      href="/register"
                      className="block w-full py-3 mt-3 border-2 border-primary text-primary hover:bg-primary hover:text-dark-DEFAULT font-semibold text-center rounded-xl transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.register')}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

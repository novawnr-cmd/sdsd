'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiArrowUp } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import toast from 'react-hot-toast';

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success(t('success.saved'));
      setEmail('');
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-gray-900 dark:bg-dark-DEFAULT text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-extrabold bg-gradient-to-r from-primary via-primary-300 to-primary bg-clip-text text-transparent mb-4">
              {t('common.appName')}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              {t('footer.aboutDesc')}
            </p>
            <div className="flex items-center gap-3">
              {[FiFacebook, FiTwitter, FiInstagram, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="p-2.5 rounded-xl bg-gray-800 hover:bg-primary hover:text-dark-DEFAULT transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: t('footer.home') },
                { href: '/products', label: t('footer.products') },
                { href: '/categories', label: t('footer.categories') },
                { href: '/deals', label: t('footer.deals') },
                { href: '/about', label: t('footer.about') },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.customerService')}</h4>
            <ul className="space-y-3">
              {[
                { href: '/help', label: t('footer.helpCenter') },
                { href: '/faq', label: t('footer.faqs') },
                { href: '/shipping', label: t('footer.shippingPolicy') },
                { href: '/returns', label: t('footer.returnPolicy') },
                { href: '/privacy', label: t('footer.privacyPolicy') },
                { href: '/terms', label: t('footer.termsOfService') },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.contactInfo')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin size={18} className="text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">Riyadh, Saudi Arabia</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone size={18} className="text-primary shrink-0" />
                <span className="text-sm text-gray-400">+966 50 000 0000</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail size={18} className="text-primary shrink-0" />
                <span className="text-sm text-gray-400">support@adamshop.com</span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3">{t('footer.newsletter')}</h4>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.emailPlaceholder')}
                  className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder:text-gray-500 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-primary hover:bg-primary-600 text-dark-DEFAULT font-semibold rounded-xl text-sm transition-all hover:shadow-gold"
                >
                  {t('footer.subscribe')}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {t('common.appName')}. {t('footer.allRightsReserved')}
          </p>
          <div className="flex items-center gap-4 text-gray-500">
            <span className="text-sm">{t('footer.securePayments')}</span>
            <div className="flex gap-2">
              {['Visa', 'MC', 'Mada', 'Apple Pay'].map((name) => (
                <span key={name} className="px-2 py-1 bg-gray-800 rounded text-xs font-medium text-gray-400">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <motion.button
        onClick={scrollToTop}
        whileHover={{ y: -3 }}
        className="fixed bottom-6 end-6 p-3 bg-primary hover:bg-primary-600 text-dark-DEFAULT rounded-full shadow-gold hover:shadow-gold-lg transition-all z-40"
      >
        <FiArrowUp size={20} />
      </motion.button>
    </footer>
  );
}

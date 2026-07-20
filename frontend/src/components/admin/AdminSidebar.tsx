'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiGrid, FiUsers, FiShoppingBag, FiPackage, FiTag, FiImage, FiSettings, FiBarChart2 } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

export default function AdminSidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const links = [
    { href: '/system-admin/dashboard', icon: FiGrid, label: t('admin.adminDashboard') },
    { href: '/system-admin/users', icon: FiUsers, label: t('admin.users') },
    { href: '/system-admin/sellers', icon: FiShoppingBag, label: t('admin.sellers') },
    { href: '/system-admin/products', icon: FiPackage, label: t('admin.products') },
    { href: '/system-admin/orders', icon: FiTag, label: t('admin.orders') },
    { href: '/system-admin/categories', icon: FiGrid, label: t('admin.categories') },
    { href: '/system-admin/banners', icon: FiImage, label: t('admin.banners') },
    { href: '/system-admin/reports', icon: FiBarChart2, label: t('admin.reports') },
    { href: '/system-admin/settings', icon: FiSettings, label: t('admin.settings') },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-dark-50 border-s border-gray-100 dark:border-dark-100 min-h-screen p-4 hidden lg:block">
      <div className="mb-6 px-4">
        <span className="text-xl font-extrabold text-gradient">{t('admin.adminDashboard')}</span>
      </div>
      <nav className="space-y-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 dark:text-dark-400 hover:bg-gray-50 dark:hover:bg-dark-100'
              )}
            >
              <link.icon size={20} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

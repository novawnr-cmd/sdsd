'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiStore, FiCheck } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function BecomeSellerPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const benefits = [
    'Create your own online store',
    'List unlimited products',
    'Manage orders and inventory',
    'Access analytics and reports',
    'Accept online payments',
    'Reach customers across Saudi Arabia',
  ];

  const handleApply = async () => {
    if (!user) { router.push('/login'); return; }
    setLoading(true);
    try {
      await api.post('/seller/apply');
      toast.success(t('seller.applicationApproved'));
      router.push('/seller/dashboard');
    } catch {
      toast.error(t('errors.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-primary/10 flex items-center justify-center">
          <FiStore size={40} className="text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-dark-800 mb-4">{t('seller.applyAsSeller')}</h1>
        <p className="text-gray-500 dark:text-dark-300 max-w-2xl mx-auto">
          Start selling to millions of customers. Create your store and reach buyers across Saudi Arabia.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-dark-800 mb-6">Benefits</h3>
          <ul className="space-y-4">
            {benefits.map((benefit, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <FiCheck size={14} className="text-primary" />
                </div>
                <span className="text-gray-600 dark:text-dark-400">{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 rounded-2xl border border-primary/20 p-8 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-dark-800 mb-4">Ready to start?</h3>
          <p className="text-gray-600 dark:text-dark-400 mb-6">
            Join thousands of sellers already growing their business on Adam Shop.
          </p>
          <Button size="lg" onClick={handleApply} isLoading={loading}>
            {t('seller.applyAsSeller')}
          </Button>
        </div>
      </div>
    </div>
  );
}

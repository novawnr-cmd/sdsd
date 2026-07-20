'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiStore, FiPhone, FiMail, FiMapPin, FiImage } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import api from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function CreateStoreForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    city: '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/stores', form);
      toast.success(t('seller.storeCreated'));
      router.push('/seller/dashboard');
    } catch {
      toast.error(t('errors.somethingWrong'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-dark-50/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/5 p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-dark-800">{t('seller.myStore')}</h3>

          <Input
            label={t('seller.storeName') + ' *'}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t('seller.storeNamePlaceholder')}
            icon={<FiStore size={18} />}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-500 mb-1.5">
              {t('seller.storeDescription')}
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder={t('seller.storeDescriptionPlaceholder')}
              className="w-full px-4 py-3 bg-white dark:bg-dark-50 border border-gray-200 dark:border-dark-100 rounded-xl text-gray-900 dark:text-dark-800 placeholder:text-gray-400 dark:placeholder:text-dark-300 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('seller.storePhone') + ' *'}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              icon={<FiPhone size={18} />}
              required
            />
            <Input
              label={t('seller.storeEmail')}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              icon={<FiMail size={18} />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('seller.storeCity') + ' *'}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              icon={<FiMapPin size={18} />}
              required
            />
            <Input
              label={t('seller.storeAddress')}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              icon={<FiMapPin size={18} />}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-dark-50/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/5 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-dark-800 mb-4">{t('seller.storeLogo')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-video bg-gray-100 dark:bg-dark-100 rounded-xl border-2 border-dashed border-gray-300 dark:border-dark-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary transition-colors">
              <FiImage size={32} className="text-gray-400" />
              <span className="text-xs text-gray-400">{t('seller.storeLogo')}</span>
            </div>
            <div className="aspect-video bg-gray-100 dark:bg-dark-100 rounded-xl border-2 border-dashed border-gray-300 dark:border-dark-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary transition-colors">
              <FiImage size={32} className="text-gray-400" />
              <span className="text-xs text-gray-400">{t('seller.storeBanner')}</span>
            </div>
          </div>
        </div>

        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
          {t('seller.createStoreBtn')}
        </Button>
      </form>
    </motion.div>
  );
}

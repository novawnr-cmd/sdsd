'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { useAuthStore } from '@/store/authStore';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const cities = [
  { value: 'riyadh', label: 'الرياض - Riyadh' },
  { value: 'jeddah', label: 'جدة - Jeddah' },
  { value: 'mecca', label: 'مكة - Mecca' },
  { value: 'medina', label: 'المدينة - Medina' },
  { value: 'dammam', label: 'الدمام - Dammam' },
  { value: 'khobar', label: 'الخبر - Khobar' },
  { value: 'abha', label: 'أبها - Abha' },
  { value: 'tabuk', label: 'تبوك - Tabuk' },
];

export default function CompleteProfileModal({ isOpen, onClose }: CompleteProfileModalProps) {
  const { t } = useLanguage();
  const { completeProfile, isLoading } = useAuthStore();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    backupPhone: '',
    email: '',
    city: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name) errs.name = t('errors.requiredField');
    if (!form.phone) errs.phone = t('errors.requiredField');
    else if (!/^\+?[0-9]{10,15}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = t('errors.invalidPhone');
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t('errors.invalidEmail');
    if (!form.city) errs.city = t('errors.requiredField');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await completeProfile(form);
      toast.success(t('auth.profileUpdated'));
      onClose();
    } catch {
      toast.error(t('errors.somethingWrong'));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} title={t('auth.completeProfile')} size="lg">
          <p className="text-sm text-gray-500 dark:text-dark-300 mb-6">{t('auth.completeProfileDesc')}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t('auth.name') + ' *'}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t('auth.namePlaceholder')}
              icon={<FiUser size={18} />}
              error={errors.name}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('auth.phone') + ' *'}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder={t('auth.phonePlaceholder')}
                icon={<FiPhone size={18} />}
                error={errors.phone}
              />
              <Input
                label={t('auth.backupPhone')}
                value={form.backupPhone}
                onChange={(e) => setForm({ ...form, backupPhone: e.target.value })}
                placeholder={t('auth.backupPhonePlaceholder')}
                icon={<FiPhone size={18} />}
              />
            </div>
            <Input
              label={t('auth.email')}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={t('auth.emailPlaceholder')}
              icon={<FiMail size={18} />}
              error={errors.email}
            />
            <Select
              label={t('auth.city') + ' *'}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              options={cities}
              placeholder={t('auth.selectCity')}
              error={errors.city}
            />
            <div className="p-4 bg-gray-50 dark:bg-dark-100 rounded-xl border-2 border-dashed border-gray-300 dark:border-dark-200">
              <div className="flex items-center gap-3 text-gray-400 dark:text-dark-300">
                <FiMapPin size={24} />
                <div>
                  <p className="text-sm font-medium">{t('auth.location')}</p>
                  <p className="text-xs">{t('auth.locationDesc')}</p>
                </div>
              </div>
            </div>
            <Button type="submit" fullWidth isLoading={isLoading} size="lg">
              {t('auth.saveProfile')}
            </Button>
          </form>
        </Modal>
      )}
    </AnimatePresence>
  );
}

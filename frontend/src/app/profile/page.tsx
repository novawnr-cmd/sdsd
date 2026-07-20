'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user, updateProfile, isLoading } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    backupPhone: user?.backupPhone || '',
    city: user?.city || '',
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(form);
      toast.success(t('profile.profileUpdated'));
    } catch {
      toast.error(t('errors.somethingWrong'));
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(t('errors.passwordsNotMatch'));
      return;
    }
    try {
      await updateProfile({ password: passwordForm.newPassword } as never);
      toast.success(t('profile.passwordChanged'));
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      toast.error(t('errors.somethingWrong'));
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-800 mb-8">{t('profile.myProfile')}</h1>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">{user?.name?.charAt(0)?.toUpperCase()}</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-dark-800">{user?.name}</h2>
            <p className="text-sm text-gray-500 dark:text-dark-300">{t('profile.memberSince')} {new Date(user?.createdAt || '').toLocaleDateString()}</p>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <Input label={t('profile.fullName')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} icon={<FiUser size={18} />} />
          <Input label={t('profile.email')} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} icon={<FiMail size={18} />} />
          <Input label={t('profile.phone')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} icon={<FiPhone size={18} />} />
          <Input label={t('profile.backupPhone')} value={form.backupPhone} onChange={(e) => setForm({ ...form, backupPhone: e.target.value })} icon={<FiPhone size={18} />} />
          <Input label={t('profile.city')} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} icon={<FiMapPin size={18} />} />
          <Button type="submit" isLoading={isLoading}>{t('common.save')}</Button>
        </form>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 p-6">
        <h3 className="font-bold text-gray-900 dark:text-dark-800 mb-4 flex items-center gap-2"><FiLock size={20} /> {t('profile.changePassword')}</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input label={t('profile.currentPassword')} type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} icon={<FiLock size={18} />} />
          <Input label={t('profile.newPassword')} type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} icon={<FiLock size={18} />} />
          <Input label={t('profile.confirmNewPassword')} type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} icon={<FiLock size={18} />} />
          <Button type="submit" variant="secondary">{t('profile.updatePassword')}</Button>
        </form>
      </motion.div>
    </div>
  );
}

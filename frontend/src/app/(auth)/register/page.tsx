'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name) errs.name = t('errors.requiredField');
    if (!form.email) errs.email = t('errors.requiredField');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t('errors.invalidEmail');
    if (!form.password) errs.password = t('errors.requiredField');
    else if (form.password.length < 6) errs.password = t('errors.passwordTooShort');
    if (form.password !== form.confirmPassword) errs.confirmPassword = t('errors.passwordsNotMatch');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      toast.success(t('auth.accountCreated'));
      router.push('/');
    } catch {
      toast.error(t('errors.somethingWrong'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-dark-DEFAULT">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-dark-50/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-dark-800 mb-2">{t('auth.register')}</h1>
            <p className="text-gray-500 dark:text-dark-300">{t('auth.registerSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label={t('auth.name') + ' *'}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={t('auth.namePlaceholder')}
              icon={<FiUser size={18} />}
              error={errors.name}
            />
            <Input
              label={t('auth.email') + ' *'}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={t('auth.emailPlaceholder')}
              icon={<FiMail size={18} />}
              error={errors.email}
            />
            <Input
              label={t('auth.phone')}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder={t('auth.phonePlaceholder')}
              icon={<FiPhone size={18} />}
            />
            <Input
              label={t('auth.password') + ' *'}
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={t('auth.passwordPlaceholder')}
              icon={<FiLock size={18} />}
              rightIcon={<button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}</button>}
              error={errors.password}
            />
            <Input
              label={t('auth.confirmPassword') + ' *'}
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder={t('auth.confirmPasswordPlaceholder')}
              icon={<FiLock size={18} />}
              error={errors.confirmPassword}
            />

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-500 dark:text-dark-300">
                {t('auth.agreeTerms')}{' '}
                <Link href="/terms" className="text-primary hover:text-primary-600">{t('auth.terms')}</Link>{' '}
                {t('common.and')}{' '}
                <Link href="/privacy" className="text-primary hover:text-primary-600">{t('auth.privacy')}</Link>
              </span>
            </label>

            <Button type="submit" fullWidth isLoading={isLoading} size="lg" disabled={!agreed}>
              {t('auth.createAccount')}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-dark-100" /></div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-dark-50 text-gray-400">{t('auth.orContinueWith')}</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 dark:border-dark-100 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-100 transition-colors text-sm font-medium text-gray-700 dark:text-dark-500">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" /><path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z" /><path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z" /><path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" /></svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 dark:border-dark-100 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-100 transition-colors text-sm font-medium text-gray-700 dark:text-dark-500">
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                Facebook
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500 dark:text-dark-300">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link href="/login" className="text-primary hover:text-primary-600 font-semibold">{t('auth.login')}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

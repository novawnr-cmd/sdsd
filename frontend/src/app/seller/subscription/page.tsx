'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const plans = [
  { id: 'free', nameKey: 'seller.freePlan', price: 0, features: ['5 Products', 'Basic Analytics', 'Standard Support'] },
  { id: 'basic', nameKey: 'seller.basicPlan', price: 49, features: ['50 Products', 'Advanced Analytics', 'Priority Support', 'Custom Banner'] },
  { id: 'pro', nameKey: 'seller.proPlan', price: 149, features: ['Unlimited Products', 'Full Analytics', '24/7 Support', 'Custom Store', 'SEO Tools', 'Coupons'] },
  { id: 'enterprise', nameKey: 'seller.enterprisePlan', price: 499, features: ['Everything in Pro', 'API Access', 'Dedicated Manager', 'Custom Integrations', 'White Label'] },
];

export default function SubscriptionPage() {
  const { t } = useLanguage();
  const [currentPlan, setCurrentPlan] = useState('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/seller/subscription').then((res) => setCurrentPlan(res.data.data?.plan || 'free')).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async (planId: string) => {
    try {
      await api.post('/seller/subscription', { plan: planId });
      setCurrentPlan(planId);
      toast.success(t('success.subscriptionActivated'));
    } catch {
      toast.error(t('errors.somethingWrong'));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-800 mb-8">{t('seller.subscription')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, i) => {
          const isActive = currentPlan === plan.id;
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                'relative bg-white dark:bg-dark-50/80 rounded-2xl border-2 p-6 transition-all',
                isActive ? 'border-primary shadow-gold' : 'border-gray-100 dark:border-white/5 hover:border-primary/30'
              )}
            >
              {isActive && (
                <span className="absolute -top-3 start-6 bg-primary text-dark-DEFAULT text-xs font-bold px-3 py-1 rounded-full">
                  Current Plan
                </span>
              )}
              <h3 className="text-lg font-bold text-gray-900 dark:text-dark-800 mb-2">{t(plan.nameKey)}</h3>
              <p className="text-3xl font-extrabold text-primary mb-6">
                {plan.price === 0 ? t('common.free') : `${plan.price}$`}
                {plan.price > 0 && <span className="text-sm font-normal text-gray-400">/mo</span>}
              </p>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-600 dark:text-dark-400">
                    <FiCheck size={16} className="text-green-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                fullWidth
                variant={isActive ? 'secondary' : 'primary'}
                disabled={isActive}
                onClick={() => handleUpgrade(plan.id)}
              >
                {isActive ? t('seller.currentPlan') : t('seller.upgradePlan')}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

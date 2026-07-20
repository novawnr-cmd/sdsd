'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCreditCard, FiTruck, FiMapPin } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import AddressPicker from '@/components/checkout/AddressPicker';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { items, total, discount, couponCode, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const shippingCost = total > 200 ? 0 : 25;
  const finalTotal = total - discount + shippingCost;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      await api.post('/orders', {
        items: items.map((item) => ({
          product: item.product._id,
          variant: item.variant?._id,
          quantity: item.quantity,
        })),
        shippingAddress: address,
        paymentMethod,
        couponCode,
        notes,
      });
      clearCart();
      toast.success(t('checkout.orderPlaced'));
      router.push('/orders');
    } catch {
      toast.error(t('errors.somethingWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-800 mb-8">{t('checkout.checkout')}</h1>

      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 ${step >= s ? 'text-primary' : 'text-gray-400 dark:text-dark-300'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-primary text-dark-DEFAULT' : 'bg-gray-100 dark:bg-dark-100'}`}>
                {s}
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                {s === 1 ? t('checkout.shippingAddress') : s === 2 ? t('checkout.paymentMethod') : t('checkout.orderReview')}
              </span>
            </div>
            {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-primary' : 'bg-gray-200 dark:bg-dark-100'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-dark-800 mb-6 flex items-center gap-2"><FiMapPin /> {t('checkout.shippingAddress')}</h3>
              <AddressPicker onSelect={(addr) => { setAddress(addr); setStep(2); }} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-dark-800 mb-6 flex items-center gap-2"><FiCreditCard /> {t('checkout.paymentMethod')}</h3>
              <div className="space-y-3">
                {[
                  { value: 'cod', label: t('checkout.cod'), desc: t('checkout.codDesc'), icon: '💵' },
                  { value: 'online', label: t('checkout.onlinePayment'), desc: t('checkout.onlineDesc'), icon: '💳' },
                  { value: 'wallet', label: t('checkout.walletPayment'), desc: t('checkout.walletDesc'), icon: '👛' },
                ].map((method) => (
                  <button
                    key={method.value}
                    onClick={() => setPaymentMethod(method.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-start transition-all ${paymentMethod === method.value ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-dark-100 hover:border-gray-300'}`}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-dark-800">{method.label}</p>
                      <p className="text-sm text-gray-500 dark:text-dark-300">{method.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="ghost" onClick={() => setStep(1)}>{t('common.back')}</Button>
                <Button onClick={() => setStep(3)}>{t('common.next')}</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-dark-800 mb-6 flex items-center gap-2"><FiTruck /> {t('checkout.orderReview')}</h3>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={`${item.product._id}-${item.variant?._id || ''}`} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-dark-100">
                    <span className="text-sm text-gray-700 dark:text-dark-500">{item.product.name.en} × {item.quantity}</span>
                    <span className="font-medium text-gray-900 dark:text-dark-800">{formatPrice((item.variant?.price || item.product.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-500 mb-1.5">{t('checkout.notes')}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder={t('checkout.notesPlaceholder')}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-dark-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="ghost" onClick={() => setStep(2)}>{t('common.back')}</Button>
                <Button onClick={handlePlaceOrder} isLoading={loading} fullWidth>{t('checkout.placeOrder')}</Button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 p-6 h-fit sticky top-24">
          <h3 className="text-lg font-bold text-gray-900 dark:text-dark-800 mb-4">{t('checkout.orderSummary')}</h3>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('common.subtotal')}</span>
              <span className="font-medium">{formatPrice(total)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">{t('common.discount')}</span>
                <span className="font-medium text-green-600">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('cart.shippingCost')}</span>
              <span className="font-medium">{shippingCost === 0 ? t('common.free') : formatPrice(shippingCost)}</span>
            </div>
          </div>
          <div className="border-t border-gray-100 dark:border-dark-100 pt-4">
            <div className="flex justify-between">
              <span className="font-bold">{t('common.total')}</span>
              <span className="font-bold text-xl text-primary">{formatPrice(finalTotal)}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">{t('checkout.termsAgree')} <span className="text-primary">{t('checkout.termsOfService')}</span> {t('checkout.andText')} <span className="text-primary">{t('checkout.privacyPolicy')}</span></p>
        </div>
      </div>
    </div>
  );
}

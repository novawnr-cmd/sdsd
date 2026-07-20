'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { Coupon } from '@/types';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import { formatPrice, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function SellerCouponsPage() {
  const { t } = useLanguage();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percentage', value: '', minPurchase: '', maxUses: '', expiresAt: '' });

  useEffect(() => {
    api.get('/seller/coupons').then((res) => setCoupons(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/seller/coupons', { ...form, value: parseFloat(form.value), minPurchase: parseFloat(form.minPurchase) || 0, usageLimit: parseInt(form.maxUses) || 0 });
      setCoupons([res.data.data, ...coupons]);
      setShowModal(false);
      setForm({ code: '', type: 'percentage', value: '', minPurchase: '', maxUses: '', expiresAt: '' });
      toast.success(t('seller.couponCreated'));
    } catch {
      toast.error(t('errors.somethingWrong'));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/seller/coupons/${id}`);
      setCoupons(coupons.filter((c) => c._id !== id));
      toast.success(t('seller.couponDeleted'));
    } catch {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-800">{t('seller.coupons')}</h1>
        <Button leftIcon={<FiPlus size={18} />} onClick={() => setShowModal(true)}>{t('seller.createCoupon')}</Button>
      </div>

      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 dark:bg-dark-100 rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-100">
              <tr>
                <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Code</th>
                <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Value</th>
                <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Uses</th>
                <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Expires</th>
                <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-100">
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-gray-50 dark:hover:bg-dark-100 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm font-bold text-primary">{coupon.code}</td>
                  <td className="px-6 py-4 text-sm capitalize text-gray-600 dark:text-dark-400">{coupon.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-dark-800">{coupon.type === 'percentage' ? `${coupon.value}%` : formatPrice(coupon.value)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-dark-400">{coupon.usedCount}/{coupon.usageLimit}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(coupon.expiresAt)}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(coupon._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><FiTrash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {coupons.length === 0 && <p className="text-center py-12 text-gray-400">{t('common.noResults')}</p>}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={t('seller.createCoupon')} size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label={t('seller.couponCode')} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
          <Select label={t('seller.couponType')} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} options={[{ value: 'percentage', label: t('seller.percentageDiscount') }, { value: 'fixed', label: t('seller.fixedDiscount') }]} />
          <Input label={t('seller.couponValue')} type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
          <Input label={t('seller.minPurchase')} type="number" value={form.minPurchase} onChange={(e) => setForm({ ...form, minPurchase: e.target.value })} />
          <Input label={t('seller.maxUses')} type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} />
          <Input label={t('seller.expiryDate')} type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
          <div className="flex gap-3 pt-4">
            <Button type="submit" fullWidth>{t('common.save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

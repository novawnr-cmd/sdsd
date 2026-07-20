'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { Product } from '@/types';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function SellerProductsPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/seller/products').then((res) => setProducts(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(t('seller.deleteProductConfirm'))) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      toast.success(t('seller.productDeleted'));
    } catch {
      toast.error(t('errors.somethingWrong'));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-800">{t('seller.myProducts')}</h1>
        <Link href="/seller/products/new"><Button leftIcon={<FiPlus size={18} />}>{t('seller.addProduct')}</Button></Link>
      </div>

      {loading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 dark:bg-dark-100 rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-dark-100">
                <tr>
                  <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{t('seller.productName')}</th>
                  <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{t('common.price')}</th>
                  <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{t('seller.productQuantity')}</th>
                  <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-start px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{t('common.edit')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-dark-100 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-dark-800 text-sm">{product.name.en}</p>
                      <p className="text-xs text-gray-400">{product.sku}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-primary">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-dark-400">{product.quantity || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/seller/products/${product._id}/edit`} className="p-2 text-gray-400 hover:text-primary transition-colors"><FiEdit2 size={16} /></Link>
                        <a href={`/products/${product.slug}`} className="p-2 text-gray-400 hover:text-blue-500 transition-colors"><FiEye size={16} /></a>
                        <button onClick={() => handleDelete(product._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><FiTrash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && <p className="text-center py-12 text-gray-400">{t('common.noResults')}</p>}
        </div>
      )}
    </div>
  );
}

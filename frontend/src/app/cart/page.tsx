'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { t } = useLanguage();
  const { items, total, itemCount, updateQuantity, removeFromCart, clearCart, couponCode, discount } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-dark-100 flex items-center justify-center">
          <FiShoppingBag size={40} className="text-gray-300 dark:text-dark-200" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-800 mb-2">{t('cart.cartEmpty')}</h2>
        <p className="text-gray-500 dark:text-dark-300 mb-6">{t('cart.cartEmptyDesc')}</p>
        <Link href="/products" className="inline-block">
          <Button size="lg">{t('cart.startShopping')}</Button>
        </Link>
      </div>
    );
  }

  const shippingCost = total > 200 ? 0 : 25;
  const finalTotal = total - discount + shippingCost;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-800 mb-8">{t('cart.shoppingCart')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={`${item.product._id}-${item.variant?._id || ''}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex gap-4 p-4 bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5"
              >
                <Link href={`/products/${item.product.slug}`} className="shrink-0">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 dark:bg-dark-100 relative">
                    <Image src={item.product.images[0] || '/placeholder.png'} alt={item.product.name.en} fill sizes="96px" className="object-cover" />
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.slug}`}>
                    <h3 className="font-medium text-gray-900 dark:text-dark-800 line-clamp-1 hover:text-primary transition-colors">{item.product.name.en}</h3>
                  </Link>
                  {item.variant && (
                    <p className="text-xs text-gray-400 dark:text-dark-300 mt-1">{item.variant.name}</p>
                  )}
                  <p className="text-lg font-bold text-primary mt-2">{formatPrice(item.variant?.price || item.product.price)}</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeFromCart(item.product._id, item.variant?._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                  <div className="flex items-center border border-gray-200 dark:border-dark-100 rounded-lg">
                    <button onClick={() => updateQuantity(item.product._id, item.quantity - 1, item.variant?._id)} className="p-2 hover:bg-gray-50 dark:hover:bg-dark-100 rounded-s-lg"><FiMinus size={14} /></button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product._id, item.quantity + 1, item.variant?._id)} className="p-2 hover:bg-gray-50 dark:hover:bg-dark-100 rounded-e-lg"><FiPlus size={14} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex justify-between items-center pt-4">
            <Link href="/products" className="text-primary hover:text-primary-600 font-medium text-sm">{t('cart.continueShopping')}</Link>
            <Button variant="danger" size="sm" onClick={() => { clearCart(); toast.success(t('cart.cartEmpty')); }}>{t('cart.clearCart')}</Button>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5 p-6 h-fit sticky top-24">
          <h3 className="text-lg font-bold text-gray-900 dark:text-dark-800 mb-4">{t('cart.orderSummary')}</h3>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-dark-300">{t('common.subtotal')} ({itemCount} {t('common.items')})</span>
              <span className="font-medium text-gray-900 dark:text-dark-800">{formatPrice(total)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">{t('common.discount')}</span>
                <span className="font-medium text-green-600">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-dark-300">{t('cart.shippingCost')}</span>
              <span className="font-medium text-gray-900 dark:text-dark-800">
                {shippingCost === 0 ? t('common.free') : formatPrice(shippingCost)}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-dark-100 pt-4 mb-6">
            <div className="flex justify-between">
              <span className="font-bold text-gray-900 dark:text-dark-800">{t('common.total')}</span>
              <span className="font-bold text-xl text-primary">{formatPrice(finalTotal)}</span>
            </div>
          </div>

          <Link href="/checkout">
            <Button fullWidth size="lg">{t('cart.proceedToCheckout')}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

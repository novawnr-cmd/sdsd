'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiShare2, FiTruck, FiShield, FiRotateCcw, FiMinus, FiPlus } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Product } from '@/types';
import api from '@/lib/api';
import ProductGallery from '@/components/product/ProductGallery';
import VariantSelector from '@/components/product/VariantSelector';
import ProductReviews from '@/components/product/ProductReviews';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatPrice, calculateDiscount, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { t } = useLanguage();
  const { addToCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  useEffect(() => {
    setLoading(true);
    api.get(`/products/${slug}`).then((res) => {
      setProduct(res.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8"><ProductGridSkeleton count={1} /></div>;
  if (!product) return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-center py-20"><p className="text-gray-400">{t('errors.productNotFound')}</p></div>;

  const wishlisted = isInWishlist(product._id);
  const discount = calculateDiscount(product.price, product.compareAtPrice || 0);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(t('success.cartAdded'));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
      >
        <ProductGallery images={product.images} alt={product.name.en} />

        <div className="space-y-6">
          <div>
            {product.category && (
              <Badge variant="secondary" className="mb-3">
                {typeof product.category === 'object' ? product.category.name.en : ''}
              </Badge>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-dark-800 mb-2">
              {product.name.en}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className={cn('w-4 h-4', i < Math.round(product.rating) ? 'text-primary' : 'text-gray-200')} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-500 dark:text-dark-300">({product.numReviews} {t('product.reviews')})</span>
              </div>
              <span className="text-sm text-gray-400">{product.totalSales} {t('home.bestSellers')}</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-primary">{formatPrice(product.price)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
                <Badge variant="danger">{t('common.sale')} -{discount}%</Badge>
              </>
            )}
          </div>

          <p className="text-gray-600 dark:text-dark-400 leading-relaxed">{product.description.en}</p>

          {product.options && product.options.length > 0 && product.variants && (
            <VariantSelector
              options={product.options}
              variants={product.variants}
              selectedOptions={selectedOptions}
              onOptionChange={(name, value) => setSelectedOptions({ ...selectedOptions, [name]: value })}
            />
          )}

          {product.type === 'simple' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-500 mb-2">{t('product.quantity')}</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 dark:border-dark-100 rounded-xl">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-50 dark:hover:bg-dark-100 rounded-s-xl transition-colors">
                    <FiMinus size={16} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-50 dark:hover:bg-dark-100 rounded-e-xl transition-colors">
                    <FiPlus size={16} />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.quantity && product.quantity > 0
                    ? `${t('product.inStock')} (${product.quantity})`
                    : t('product.outOfStock')}
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button size="lg" fullWidth leftIcon={<FiShoppingCart size={20} />} onClick={handleAddToCart}>
              {t('product.addToCart')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => { toggleWishlist(product); toast.success(wishlisted ? t('success.wishlistRemoved') : t('success.wishlistAdded')); }}
            >
              <FiHeart size={20} className={wishlisted ? 'fill-red-500 text-red-500' : ''} />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-dark-100">
            {[
              { icon: FiTruck, text: t('footer.shippingPolicy') },
              { icon: FiShield, text: t('footer.securePayments') },
              { icon: FiRotateCcw, text: t('footer.returnPolicy') },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-center p-3">
                <item.icon size={20} className="text-primary" />
                <span className="text-xs text-gray-500 dark:text-dark-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="border-t border-gray-100 dark:border-dark-100 pt-8">
        <div className="flex gap-4 mb-6">
          {(['description', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-6 py-3 rounded-xl font-medium text-sm transition-all',
                activeTab === tab
                  ? 'bg-primary text-dark-DEFAULT'
                  : 'bg-gray-100 dark:bg-dark-50 text-gray-600 dark:text-dark-400 hover:bg-gray-200 dark:hover:bg-dark-100'
              )}
            >
              {tab === 'description' ? t('product.description') : `${t('product.reviews')} (${product.numReviews})`}
            </button>
          ))}
        </div>

        {activeTab === 'description' ? (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-dark-400 leading-relaxed whitespace-pre-line">{product.description.en}</p>
          </div>
        ) : (
          <ProductReviews productId={product._id} />
        )}
      </div>
    </div>
  );
}

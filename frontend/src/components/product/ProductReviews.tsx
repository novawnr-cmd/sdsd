'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useAuthStore } from '@/store/authStore';
import { Review } from '@/types';
import api from '@/lib/api';
import StarRating from '@/components/ui/StarRating';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.get(`/reviews?product=${productId}`).then((res) => {
      setReviews(res.data.data || []);
    }).catch(() => {});
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    setSubmitting(true);
    try {
      await api.post('/reviews', { product: productId, rating, title, comment });
      toast.success(t('success.reviewSubmitted'));
      setRating(0);
      setTitle('');
      setComment('');
      setShowForm(false);
      const res = await api.get(`/reviews?product=${productId}`);
      setReviews(res.data.data || []);
    } catch {
      toast.error(t('errors.somethingWrong'));
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: reviews.length
      ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100
      : 0,
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-dark-100 rounded-2xl md:min-w-[200px]">
          <span className="text-5xl font-bold text-gray-900 dark:text-dark-800">{avgRating.toFixed(1)}</span>
          <StarRating rating={avgRating} size="lg" />
          <span className="text-sm text-gray-500 dark:text-dark-300 mt-2">
            {t('product.reviewsCount', { count: reviews.length.toString() })}
          </span>
        </div>

        <div className="flex-1 space-y-2">
          {ratingBreakdown.map((item) => (
            <div key={item.star} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-dark-400 w-12">{item.star} ★</span>
              <div className="flex-1 h-2.5 bg-gray-200 dark:bg-dark-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
              <span className="text-xs text-gray-400 dark:text-dark-300 w-8 text-end">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-dark-800">
          {t('product.reviews')} ({reviews.length})
        </h3>
        {isAuthenticated ? (
          <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
            {t('product.writeReview')}
          </Button>
        ) : (
          <a href="/login" className="text-primary hover:text-primary-600 text-sm font-medium">
            {t('product.loginToReview')}
          </a>
        )}
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmit}
          className="p-6 bg-gray-50 dark:bg-dark-100 rounded-2xl space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-500 mb-2">
              {t('product.rating')} *
            </label>
            <StarRating rating={rating} interactive onChange={setRating} size="lg" />
          </div>
          <Input
            label={t('product.reviewTitle')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('product.reviewTitle')}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-500 mb-1.5">
              {t('product.reviewComment')} *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white dark:bg-dark-50 border border-gray-200 dark:border-dark-100 rounded-xl text-gray-900 dark:text-dark-800 placeholder:text-gray-400 dark:placeholder:text-dark-300 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 outline-none resize-none"
              placeholder={t('product.reviewComment')}
              required
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" isLoading={submitting}>{t('product.submitReview')}</Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>{t('common.cancel')}</Button>
          </div>
        </motion.form>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-white dark:bg-dark-50/80 rounded-2xl border border-gray-100 dark:border-white/5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 dark:text-dark-800">
                    {typeof review.customer === 'object' ? review.customer.name : 'User'}
                  </span>
                  {review.isVerified && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                      ✓ {t('product.verifiedPurchase')}
                    </span>
                  )}
                </div>
                <StarRating rating={review.rating} size="sm" />
              </div>
              <span className="text-xs text-gray-400 dark:text-dark-300">{formatDate(review.createdAt)}</span>
            </div>
            {review.title && (
              <h4 className="font-semibold text-gray-900 dark:text-dark-800 mb-1">{review.title}</h4>
            )}
            <p className="text-sm text-gray-600 dark:text-dark-400 leading-relaxed">{review.comment}</p>
          </motion.div>
        ))}
        {reviews.length === 0 && (
          <p className="text-center text-gray-400 dark:text-dark-300 py-8">{t('product.noReviews')}</p>
        )}
      </div>
    </div>
  );
}

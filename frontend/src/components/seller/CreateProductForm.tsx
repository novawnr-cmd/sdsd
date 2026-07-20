'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiImage, FiX, FiPlus } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';
import api from '@/lib/api';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

const productTypes = ['simple', 'variable', 'digital', 'service'] as const;

export default function CreateProductForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<string>('simple');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [options, setOptions] = useState<{ name: string; values: string }[]>([]);
  const [form, setForm] = useState({
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    price: '',
    compareAtPrice: '',
    quantity: '',
    sku: '',
    weight: '',
    category: '',
  });

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const addOption = () => {
    setOptions([...options, { name: '', values: '' }]);
  };

  const updateOption = (index: number, field: 'name' | 'values', value: string) => {
    const updated = [...options];
    updated[index][field] = value;
    setOptions(updated);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        name: { ar: form.nameAr, en: form.nameEn },
        description: { ar: form.descriptionAr, en: form.descriptionEn },
        type,
        price: parseFloat(form.price),
        compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : undefined,
        quantity: parseInt(form.quantity) || 0,
        sku: form.sku,
        weight: form.weight ? parseFloat(form.weight) : undefined,
        category: form.category,
        tags,
        options: options.map((o) => ({
          name: o.name,
          values: o.values.split(',').map((v) => v.trim()).filter(Boolean),
        })),
      };
      await api.post('/products', payload);
      toast.success(t('seller.productCreated'));
      router.push('/seller/products');
    } catch {
      toast.error(t('errors.somethingWrong'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div className="bg-white dark:bg-dark-50/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/5 p-6 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-dark-800">{t('seller.productTypes')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {productTypes.map((pt) => (
            <button
              key={pt}
              type="button"
              onClick={() => setType(pt)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                type === pt
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 dark:border-dark-100 hover:border-gray-300'
              }`}
            >
              <p className="font-medium text-sm text-gray-900 dark:text-dark-800 capitalize">{pt}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-dark-50/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/5 p-6 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-dark-800">{t('seller.productName')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('seller.productNameAr') + ' *'}
            value={form.nameAr}
            onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
            required
          />
          <Input
            label={t('seller.productNameEn') + ' *'}
            value={form.nameEn}
            onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="bg-white dark:bg-dark-50/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/5 p-6 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-dark-800">{t('seller.productDescription')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-500 mb-1.5">{t('seller.productDescAr')}</label>
            <textarea
              value={form.descriptionAr}
              onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-white dark:bg-dark-50 border border-gray-200 dark:border-dark-100 rounded-xl text-gray-900 dark:text-dark-800 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-500 mb-1.5">{t('seller.productDescEn')}</label>
            <textarea
              value={form.descriptionEn}
              onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-white dark:bg-dark-50 border border-gray-200 dark:border-dark-100 rounded-xl text-gray-900 dark:text-dark-800 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-50/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/5 p-6 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-dark-800">{t('common.price')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label={t('seller.productPrice') + ' *'}
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <Input
            label={t('seller.compareAtPrice')}
            type="number"
            value={form.compareAtPrice}
            onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
          />
          {type !== 'digital' && type !== 'service' && (
            <Input
              label={t('seller.productQuantity')}
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t('seller.productSku')}
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
          />
          <Input
            label={t('seller.productWeight')}
            type="number"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-dark-50/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/5 p-6 space-y-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-dark-800">{t('seller.productImages')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="aspect-square bg-gray-100 dark:bg-dark-100 rounded-xl border-2 border-dashed border-gray-300 dark:border-dark-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary transition-colors">
            <FiImage size={32} className="text-gray-400" />
            <span className="text-xs text-gray-400">{t('seller.uploadImages')}</span>
          </div>
        </div>
        <p className="text-xs text-gray-400">{t('seller.maxImages')}</p>
      </div>

      <div className="bg-white dark:bg-dark-50/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/5 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-dark-800">{t('seller.productTags')}</h3>
        </div>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder={t('seller.tagsPlaceholder')}
          />
          <Button type="button" variant="outline" onClick={addTag}>{t('common.add')}</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
              <button onClick={() => setTags(tags.filter((t) => t !== tag))} className="ms-1"><FiX size={12} /></button>
            </Badge>
          ))}
        </div>
      </div>

      {type === 'variable' && (
        <div className="bg-white dark:bg-dark-50/80 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-white/5 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-dark-800">{t('seller.variants')}</h3>
            <Button type="button" variant="outline" size="sm" leftIcon={<FiPlus size={16} />} onClick={addOption}>
              {t('seller.addVariant')}
            </Button>
          </div>
          {options.map((opt, i) => (
            <div key={i} className="flex gap-3 items-end">
              <Input
                label={t('seller.optionName')}
                value={opt.name}
                onChange={(e) => updateOption(i, 'name', e.target.value)}
                placeholder="e.g. Color"
              />
              <Input
                label={t('seller.optionValues')}
                value={opt.values}
                onChange={(e) => updateOption(i, 'values', e.target.value)}
                placeholder={t('seller.optionValuesPlaceholder')}
              />
              <button
                type="button"
                onClick={() => removeOption(i)}
                className="p-3 text-red-500 hover:text-red-600"
              >
                <FiX size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
        {t('seller.createProduct')}
      </Button>
    </motion.form>
  );
}

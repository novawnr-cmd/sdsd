'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ProductOption, ProductVariant } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface VariantSelectorProps {
  options: ProductOption[];
  variants: ProductVariant[];
  selectedOptions: Record<string, string>;
  onOptionChange: (name: string, value: string) => void;
}

export default function VariantSelector({
  options,
  variants,
  selectedOptions,
  onOptionChange,
}: VariantSelectorProps) {
  const { t } = useLanguage();

  const getMatchingVariant = (opts: Record<string, string>) => {
    return variants.find((v) =>
      Object.entries(opts).every(([key, val]) => v.options[key] === val) && v.isActive
    );
  };

  const currentVariant = getMatchingVariant(selectedOptions);
  const availableColors = options.find((o) => o.name.toLowerCase() === 'color' || o.name === 'اللون');
  const sizeOption = options.find((o) => o.name.toLowerCase() === 'size' || o.name === 'المقاس');

  return (
    <div className="space-y-6">
      {options.map((option) => {
        const isColor = option.name.toLowerCase() === 'color' || option.name === 'اللون';
        const isSize = option.name.toLowerCase() === 'size' || option.name === 'المقاس';

        return (
          <div key={option.name}>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-500 mb-3">
              {option.name}:{' '}
              <span className="text-primary font-semibold">
                {selectedOptions[option.name] || t('common.select')}
              </span>
            </label>

            {isColor ? (
              <div className="flex flex-wrap gap-3">
                {option.values.map((value) => {
                  const colorMap: Record<string, string> = {
                    red: '#EF4444', blue: '#3B82F6', green: '#22C55E',
                    black: '#000000', white: '#FFFFFF', yellow: '#EAB308',
                    purple: '#A855F7', pink: '#EC4899', orange: '#F97316',
                    gray: '#9CA3AF', brown: '#92400E', navy: '#1E3A5F',
                  };
                  const bgColor = colorMap[value.toLowerCase()] || value;

                  return (
                    <motion.button
                      key={value}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onOptionChange(option.name, value)}
                      className={cn(
                        'w-10 h-10 rounded-full border-2 transition-all relative',
                        selectedOptions[option.name] === value
                          ? 'border-primary ring-2 ring-primary/30 ring-offset-2 dark:ring-offset-dark-50'
                          : 'border-gray-200 dark:border-dark-100 hover:border-gray-300'
                      )}
                      style={{ backgroundColor: bgColor }}
                      title={value}
                    >
                      {selectedOptions[option.name] === value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 20 20" fill={bgColor === '#FFFFFF' || bgColor === '#EAB308' ? '#000' : '#FFF'}>
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            ) : isSize ? (
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => (
                  <motion.button
                    key={value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onOptionChange(option.name, value)}
                    className={cn(
                      'px-5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all',
                      selectedOptions[option.name] === value
                        ? 'border-primary bg-primary text-dark-DEFAULT'
                        : 'border-gray-200 dark:border-dark-100 text-gray-700 dark:text-dark-500 hover:border-primary/50'
                    )}
                  >
                    {value}
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => (
                  <motion.button
                    key={value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onOptionChange(option.name, value)}
                    className={cn(
                      'px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all',
                      selectedOptions[option.name] === value
                        ? 'border-primary bg-primary text-dark-DEFAULT'
                        : 'border-gray-200 dark:border-dark-100 text-gray-700 dark:text-dark-500 hover:border-primary/50'
                    )}
                  >
                    {value}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {currentVariant && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20"
        >
          {currentVariant.quantity > 0 ? (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              ✓ {t('product.inStock')} ({currentVariant.quantity})
            </p>
          ) : (
            <p className="text-sm text-red-500 font-medium">✗ {t('product.outOfStock')}</p>
          )}
        </motion.div>
      )}
    </div>
  );
}

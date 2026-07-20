'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-dark-DEFAULT flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="relative w-20 h-20"
        >
          <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-dark-100" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primary via-primary-300 to-primary bg-clip-text text-transparent">
            ادم شوب
          </h1>
          <p className="text-sm text-gray-400 dark:text-dark-300 mt-1">Adam Shop</p>
        </motion.div>

        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
              className="w-2.5 h-2.5 rounded-full bg-primary"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

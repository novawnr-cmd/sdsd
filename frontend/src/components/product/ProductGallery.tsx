'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiZoomIn, FiZoomOut, FiChevronLeft, FiChevronRight, FiMaximize2 } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [fullscreen, setFullscreen] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <>
      <div className="space-y-4">
        <div
          className={cn(
            'relative aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-dark-100 cursor-zoom-in group',
            isZoomed && 'cursor-zoom-out'
          )}
          onClick={() => setIsZoomed(!isZoomed)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={images[selectedIndex] || '/placeholder.png'}
                alt={`${alt} ${selectedIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={cn('object-cover transition-transform duration-300', isZoomed && 'scale-[2.5]')}
                style={isZoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
            >
              {isZoomed ? <FiZoomOut size={16} /> : <FiZoomIn size={16} />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setFullscreen(true); }}
              className="p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
            >
              <FiMaximize2 size={16} />
            </button>
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedIndex((p) => (p - 1 + images.length) % images.length); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
              >
                <FiChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedIndex((p) => (p + 1) % images.length); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
              >
                <FiChevronRight size={20} />
              </button>
            </>
          )}

          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-lg">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>

        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  'relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all',
                  i === selectedIndex
                    ? 'border-primary shadow-gold'
                    : 'border-transparent opacity-60 hover:opacity-100'
                )}
              >
                <Image src={img} alt={`${alt} ${i + 1}`} fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setFullscreen(false)}
          >
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-6 end-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="relative w-full h-full max-w-4xl max-h-[80vh] m-8"
            >
              <Image
                src={images[selectedIndex]}
                alt={`${alt} ${selectedIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedIndex((p) => (p - 1 + images.length) % images.length); }}
                  className="absolute start-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <FiChevronLeft size={28} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedIndex((p) => (p + 1) % images.length); }}
                  className="absolute end-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <FiChevronRight size={28} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

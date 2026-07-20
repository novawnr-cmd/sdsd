'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
}

const sizeMap = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-7 h-7' };

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  showValue = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: maxRating }).map((_, i) => {
          const filled = interactive
            ? i < (hoverRating || rating)
            : i < Math.round(rating);
          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              className={cn(
                'transition-colors duration-200',
                interactive && 'cursor-pointer hover:scale-110',
                !interactive && 'cursor-default'
              )}
              onClick={() => interactive && onChange?.(i + 1)}
              onMouseEnter={() => interactive && setHoverRating(i + 1)}
              onMouseLeave={() => interactive && setHoverRating(0)}
            >
              <svg
                className={cn(sizeMap[size], filled ? 'text-primary' : 'text-gray-200 dark:text-dark-100')}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-600 dark:text-dark-400 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

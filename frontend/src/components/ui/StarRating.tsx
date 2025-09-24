import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md', 
  showValue = false, 
  className 
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Estrellas completas
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            "fill-amber-400 text-amber-400"
          )}
        />
      );
    }
    
    // Media estrella
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star
            className={cn(
              sizeClasses[size],
              "text-neutral-300"
            )}
          />
          <Star
            className={cn(
              sizeClasses[size],
              "fill-amber-400 text-amber-400 absolute top-0 left-0 overflow-hidden"
            )}
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          />
        </div>
      );
    }
    
    // Estrellas vacías
    const emptyStars = maxRating - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className={cn(
            sizeClasses[size],
            "text-neutral-300"
          )}
        />
      );
    }
    
    return stars;
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {renderStars()}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-neutral-700 ml-1">
          {rating}
        </span>
      )}
    </div>
  );
}

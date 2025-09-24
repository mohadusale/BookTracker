import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StarRatingInputProps {
  value?: number;
  onChange?: (rating: number) => void;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
  disabled?: boolean;
}

export function StarRatingInput({ 
  value = 0, 
  onChange, 
  maxRating = 5, 
  size = 'md', 
  showValue = false, 
  className,
  disabled = false
}: StarRatingInputProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6'
  };

  const handleStarClick = (rating: number) => {
    if (!disabled && onChange) {
      // Asegurar que la calificación mínima sea 0.5
      const finalRating = Math.max(0.5, rating);
      onChange(finalRating);
    }
  };

  const handleStarHover = (rating: number) => {
    if (!disabled) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverRating(null);
    }
  };

  const renderStars = () => {
    const stars = [];
    const currentRating = hoverRating !== null ? hoverRating : value;
    
    for (let i = 1; i <= maxRating; i++) {
      const isFilled = i <= currentRating;
      const isHalf = i === Math.ceil(currentRating) && currentRating % 1 !== 0;
      
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleMouseLeave}
          disabled={disabled}
          className={cn(
            "transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded-sm",
            disabled ? "cursor-not-allowed" : "cursor-pointer hover:scale-110"
          )}
        >
          {isHalf ? (
            <div className="relative">
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
          ) : (
            <Star
              className={cn(
                sizeClasses[size],
                isFilled 
                  ? "fill-amber-400 text-amber-400" 
                  : "text-neutral-300 hover:text-amber-300"
              )}
            />
          )}
        </button>
      );
    }
    
    return stars;
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div 
        className="flex items-center"
        onMouseLeave={handleMouseLeave}
      >
        {renderStars()}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-neutral-700 ml-2">
          {value}
        </span>
      )}
    </div>
  );
}

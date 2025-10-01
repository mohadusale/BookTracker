import { useState } from 'react';

interface RatingFilterProps {
  selectedRating?: number | null;
  onRatingChange: (rating: number | null) => void;
  className?: string;
}

export function RatingFilter({ selectedRating, onRatingChange, className = "" }: RatingFilterProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleMouseLeave = () => {
    setHoveredRating(null);
  };

  const displayRating = hoveredRating || selectedRating || 0;

  // Mostrar solo 5 estrellas físicas, pero cada una puede ser media o completa
  const renderStar = (starNumber: number) => {
    const halfRating = starNumber - 0.5;
    const fullRating = starNumber;
    
    // Determinar qué parte de la estrella está seleccionada
    let fillPercentage = 0;
    if (displayRating >= fullRating) {
      fillPercentage = 100; // Estrella completa
    } else if (displayRating >= halfRating) {
      fillPercentage = 50; // Media estrella
    }
    
    
    return (
      <button
        type="button"
        onClick={() => {
          if (selectedRating === fullRating) {
            onRatingChange(null);
          } else if (selectedRating === halfRating) {
            onRatingChange(fullRating);
          } else {
            onRatingChange(halfRating);
          }
        }}
        onMouseEnter={() => setHoveredRating(halfRating)}
        className="transition-colors duration-150"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className={`transition-colors duration-150 ${
            fillPercentage > 0 ? 'text-yellow-400' : 'text-neutral-300 hover:text-yellow-300'
          }`}
        >
          <defs>
            <linearGradient id={`star-${starNumber}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset={`${fillPercentage}%`} stopColor="currentColor" />
              <stop offset={`${fillPercentage}%`} stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={fillPercentage > 0 ? `url(#star-${starNumber})` : 'none'}
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </button>
    );
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-neutral-600">Rating:</span>
      <div 
        className="flex items-center gap-1"
        onMouseLeave={handleMouseLeave}
      >
        {[1, 2, 3, 4, 5].map((starNumber) => renderStar(starNumber))}
      </div>
      {selectedRating && (
        <span className="text-xs text-neutral-500 ml-1">
          {selectedRating} estrella{selectedRating !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
}

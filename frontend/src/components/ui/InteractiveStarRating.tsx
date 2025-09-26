import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

interface InteractiveStarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
  bookStatus: 'N' | 'R' | 'C'; // Estado del libro
  onRatingChange: (rating: number, bookId: number) => void;
  bookId: number;
  disabled?: boolean;
}

export function InteractiveStarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md', 
  showValue = false, 
  className,
  bookStatus,
  onRatingChange,
  bookId,
  disabled = false
}: InteractiveStarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4', 
    lg: 'h-5 w-5'
  };

  const handleStarClick = async (clickedRating: number) => {
    if (disabled) return;
    
    // Asegurar que la calificación mínima sea 0.5
    const finalRating = Math.max(0.5, clickedRating);
    
    // Si el libro no está completado, mostrar indicador de completado
    if (bookStatus !== 'C') {
      setIsCompleting(true);
      // Simular un pequeño delay para mostrar la animación
      setTimeout(() => {
        setIsCompleting(false);
      }, 1000);
    }
    
    // Actualizar la calificación (esto también cambiará el estado a completado)
    onRatingChange(finalRating, bookId);
  };

  const handleMouseEnter = (starRating: number) => {
    if (!disabled) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = hoverRating || rating;
    const fullStars = Math.floor(displayRating);
    const hasHalfStar = displayRating % 1 !== 0;
    
    // Estrellas completas
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            "fill-amber-400 text-amber-400 transition-colors duration-150",
            !disabled && "cursor-pointer hover:scale-110"
          )}
          onClick={() => handleStarClick(i + 1)}
          onMouseEnter={() => handleMouseEnter(i + 1)}
          onMouseLeave={handleMouseLeave}
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
              "text-neutral-300 transition-colors duration-150",
              !disabled && "cursor-pointer hover:scale-110"
            )}
            onClick={() => handleStarClick(Math.floor(displayRating) + 0.5)}
            onMouseEnter={() => handleMouseEnter(Math.floor(displayRating) + 0.5)}
            onMouseLeave={handleMouseLeave}
          />
          <Star
            className={cn(
              sizeClasses[size],
              "fill-amber-400 text-amber-400 absolute top-0 left-0 overflow-hidden transition-colors duration-150"
            )}
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          />
        </div>
      );
    }
    
    // Estrellas vacías
    const emptyStars = maxRating - Math.ceil(displayRating);
    for (let i = 0; i < emptyStars; i++) {
      const starRating = Math.ceil(displayRating) + i + 1;
      stars.push(
        <Star
          key={`empty-${i}`}
          className={cn(
            sizeClasses[size],
            "text-neutral-300 transition-colors duration-150",
            !disabled && "cursor-pointer hover:text-amber-300 hover:scale-110"
          )}
          onClick={() => handleStarClick(starRating)}
          onMouseEnter={() => handleMouseEnter(starRating)}
          onMouseLeave={handleMouseLeave}
        />
      );
    }
    
    return stars;
  };

  return (
    <div className={cn("flex items-center gap-1 relative", className)}>
      {/* Indicador de completado */}
      {isCompleting && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap animate-pulse">
          ¡Libro completado!
        </div>
      )}
      
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

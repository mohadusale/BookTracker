import React, { useState } from 'react';
import { cn } from '../../utils/cn';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

const ImageWithFallback = React.forwardRef<HTMLImageElement, ImageWithFallbackProps>(
  ({ className, src, alt, fallbackSrc, ...props }, ref) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleError = () => {
      if (!hasError) {
        setHasError(true);
        setIsLoading(false);
        if (fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }
    };

    const handleLoad = () => {
      setIsLoading(false);
    };

    return (
      <div className="relative w-full h-full">
        {/* Placeholder mientras carga */}
        {isLoading && (
          <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
        )}
        
        <img
          ref={ref}
          src={imgSrc}
          alt={alt}
          className={cn(
            "object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            className
          )}
          onError={handleError}
          onLoad={handleLoad}
          loading="lazy"
          decoding="async"
          {...props}
        />
      </div>
    );
  }
);
ImageWithFallback.displayName = "ImageWithFallback";

export { ImageWithFallback };

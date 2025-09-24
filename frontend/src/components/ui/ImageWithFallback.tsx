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

    const handleError = () => {
      if (!hasError) {
        setHasError(true);
        if (fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }
    };

    return (
      <img
        ref={ref}
        src={imgSrc}
        alt={alt}
        className={cn("object-cover", className)}
        onError={handleError}
        {...props}
      />
    );
  }
);
ImageWithFallback.displayName = "ImageWithFallback";

export { ImageWithFallback };

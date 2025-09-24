import React, { memo } from 'react';
import { BookOpen } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const PageLoader: React.FC<PageLoaderProps> = memo(({ 
  message = "Cargando...", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin`}></div>
        <BookOpen 
          size={size === 'sm' ? 12 : size === 'md' ? 16 : 24} 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-500"
        />
      </div>
      <p className="text-neutral-500 text-sm">{message}</p>
    </div>
  );
});

PageLoader.displayName = 'PageLoader';

export default PageLoader;

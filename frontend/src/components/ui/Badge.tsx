import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          {
            "border-transparent bg-primary-500 text-white hover:bg-primary-600": variant === 'default',
            "border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-200": variant === 'secondary',
            "border-transparent bg-red-500 text-white hover:bg-red-600": variant === 'destructive',
            "text-neutral-900": variant === 'outline',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Badge.displayName = "Badge";

export { Badge };

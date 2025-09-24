import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  onValueChange?: (value: string) => void;
}

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  onValueChange?: (value: string) => void;
}

interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
  setIsOpen?: (open: boolean) => void;
}

interface SelectValueProps {
  placeholder?: string;
  children?: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}

const Select = ({ value, onValueChange, children }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={selectRef} className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            isOpen, 
            setIsOpen, 
            value, 
            onValueChange 
          } as any);
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, isOpen, setIsOpen, onValueChange, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:border-neutral-400 transition-colors",
        className
      )}
      onClick={() => setIsOpen?.(!isOpen)}
      {...props}
    >
      {children}
      <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
    </button>
  )
);
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, isOpen, setIsOpen, onValueChange, ...props }, ref) => {
    if (!isOpen) return null;
    
    return (
      <div
        ref={ref}
        className={cn(
          "absolute top-full z-50 w-full rounded-md border border-neutral-200 bg-white p-1 text-neutral-900 shadow-lg animate-in fade-in-0 zoom-in-95 duration-200",
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { 
              onValueChange, 
              setIsOpen 
            } as any);
          }
          return child;
        })}
      </div>
    );
  }
);
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ className, children, value, onValueChange, setIsOpen, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center justify-start text-left rounded-sm py-2 px-3 text-sm font-medium text-neutral-900 outline-none hover:bg-neutral-100 hover:text-neutral-900 focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors",
        className
      )}
      onClick={() => {
        onValueChange?.(value);
        setIsOpen?.(false);
      }}
      {...props}
    >
      {children}
    </button>
  )
);
SelectItem.displayName = "SelectItem";

const SelectValue = ({ placeholder, children }: SelectValueProps) => {
  if (children) {
    return <span className="font-medium">{children}</span>;
  }
  return <span className="font-medium">{placeholder}</span>;
};

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };

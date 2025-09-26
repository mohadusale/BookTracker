import { memo } from 'react';
import { Search } from 'lucide-react';
import { Input } from './Input';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = memo(function SearchInput({ 
  value, 
  onChange, 
  placeholder = "Buscar...", 
  className = "pl-10 h-10 border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200" 
}: SearchInputProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
      />
    </div>
  );
});

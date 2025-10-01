import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';

interface LibraryStatusFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function LibraryStatusFilter({ value, onChange, className = "" }: LibraryStatusFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-40 h-10 border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
        <SelectValue placeholder="Estado">
          {value === 'C' && 'Finalizados'}
          {value === 'R' && 'Leyendo'}
          {value === 'N' && 'Por leer'}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="C">Finalizados</SelectItem>
        <SelectItem value="R">Leyendo</SelectItem>
        <SelectItem value="N">Por leer</SelectItem>
      </SelectContent>
    </Select>
  );
}

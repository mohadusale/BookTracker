import { memo } from 'react';

interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ key: string; label: string }>;
}

export const StatusFilter = memo(function StatusFilter({ value, onChange, options }: StatusFilterProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex bg-neutral-100 rounded-xl p-1 w-full max-w-md shadow-sm hover:shadow-md transition-shadow duration-200">
        {options.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm flex-1 ${
              value === key
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-white/50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
});

import React from 'react';
import { colors } from '../../config/colors';

interface FormInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string | null;
  hasError?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ 
  type, 
  placeholder, 
  value, 
  onChange,
  onBlur,
  disabled = false,
  error,
  hasError = false
}) => {
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors
    ${hasError 
      ? 'border-purple-600 focus:ring-purple-600 focus:border-purple-600' 
      : 'border-purple-300 focus:ring-purple-500 focus:border-purple-500'
    }
    ${disabled ? 'bg-purple-100 cursor-not-allowed' : 'bg-purple-50'}
  `.trim();

  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={inputClasses}
        style={!hasError ? { '--tw-ring-color': colors.primary.main } as React.CSSProperties : undefined}
        disabled={disabled}
      />
      {error && (
        <p className="mt-1 text-sm text-purple-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;

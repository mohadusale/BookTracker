import React from 'react';
import { colors } from '../../config/colors';

interface FormInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
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
  required = false,
  disabled = false,
  error,
  hasError = false
}) => {
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors
    ${hasError 
      ? 'border-error-500 focus:ring-error-500 focus:border-error-500' 
      : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
    }
    ${disabled ? 'bg-neutral-100 cursor-not-allowed' : 'bg-white'}
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
        style={!hasError ? { '--tw-ring-color': colors.primary.ring } as React.CSSProperties : undefined}
        required={false}
        disabled={disabled}
        noValidate
      />
      {error && (
        <p className="mt-1 text-sm text-error-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;

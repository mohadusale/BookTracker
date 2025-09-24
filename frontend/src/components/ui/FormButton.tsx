import React from 'react';
import { colors } from '../../config/colors';

interface FormButtonProps {
  type: 'submit' | 'button' | 'reset';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const FormButton: React.FC<FormButtonProps> = ({ type, children, onClick, disabled = false }) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = colors.primary.hover;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = colors.primary.main;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-soft ${
        disabled 
          ? 'bg-neutral-400 opacity-50 cursor-not-allowed' 
          : 'bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
      }`}
      onMouseEnter={disabled ? undefined : handleMouseEnter}
      onMouseLeave={disabled ? undefined : handleMouseLeave}
    >
      {children}
    </button>
  );
};

export default FormButton;

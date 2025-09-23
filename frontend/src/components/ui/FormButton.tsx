import React from 'react';
import { colors } from '../../config/colors';

interface FormButtonProps {
  type: 'submit' | 'button';
  children: React.ReactNode;
  onClick?: () => void;
}

const FormButton: React.FC<FormButtonProps> = ({ type, children, onClick }) => {
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
      className="w-full text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-lg"
      style={{ backgroundColor: colors.primary.main }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
};

export default FormButton;

import React from 'react';

interface FormNavigationProps {
  question: string;
  linkText: string;
  onToggle: () => void;
}

const FormNavigation: React.FC<FormNavigationProps> = ({ question, linkText, onToggle }) => {
  return (
    <div className="text-center mt-6">
      <p className="text-gray-600 text-sm font-medium tracking-wide">
        {question}{' '}
        <button 
          onClick={onToggle}
          className="text-blue-600 hover:text-blue-700 hover:underline font-semibold cursor-pointer transition-colors duration-200 tracking-wide"
        >
          {linkText}
        </button>
      </p>
    </div>
  );
};

export default FormNavigation;

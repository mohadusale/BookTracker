import React from 'react';

interface FormNavigationProps {
  question: string;
  linkText: string;
  onToggle: () => void;
}

const FormNavigation: React.FC<FormNavigationProps> = ({ question, linkText, onToggle }) => {
  return (
    <div className="text-center mt-4">
      <p className="text-gray-600 text-sm">
        {question}{' '}
        <button 
          onClick={onToggle}
          className="text-blue-600 hover:underline font-medium cursor-pointer"
        >
          {linkText}
        </button>
      </p>
    </div>
  );
};

export default FormNavigation;

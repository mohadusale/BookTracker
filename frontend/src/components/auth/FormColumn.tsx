import React from 'react';
import { LoginForm, SignUpForm } from './';

interface FormColumnProps {
  isSignUp: boolean;
  isAnimating: boolean;
  onToggleMode: () => void;
}

const FormColumn: React.FC<FormColumnProps> = ({ isSignUp, isAnimating, onToggleMode }) => {
  return (
    <div 
      className="bg-white rounded-2xl shadow-2xl flex items-center justify-center p-8 relative overflow-hidden transition-all duration-600 ease-in-out z-10 w-[480px] h-[700px]"
    >
      {/* Overlay durante animación */}
      {isAnimating && (
        <div className="absolute inset-0 bg-white z-20 rounded-2xl" />
      )}
      
      {/* Contenido del formulario con transición */}
      <div 
        className={`w-full transition-all duration-300 ease-in-out ${
          isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
        }`}
      >
        {isSignUp ? (
          <SignUpForm onToggleMode={onToggleMode} />
        ) : (
          <LoginForm onToggleMode={onToggleMode} />
        )}
      </div>
    </div>
  );
};

export default FormColumn;

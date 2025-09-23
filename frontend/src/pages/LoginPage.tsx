import React from 'react';
import { useAnimation } from '../hooks/useAnimation';
import { BrandingColumn, FormColumn } from '../components/auth';

const LoginPage: React.FC = () => {
  const { isSignUp, isAnimating, toggleMode } = useAnimation();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4"> 
      <div className="flex w-full max-w-5xl gap-6 transition-all duration-600 ease-in-out">
        <BrandingColumn isAnimating={isAnimating} />
        <FormColumn 
          isSignUp={isSignUp} 
          isAnimating={isAnimating} 
          onToggleMode={toggleMode} 
        />
      </div>
    </div>
  );
};

export default LoginPage;
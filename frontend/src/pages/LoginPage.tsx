import React from 'react';
import { useAnimation } from '../hooks/useAnimation';
import { BrandingColumn, FormColumn } from '../components/auth';
import { useAuth } from '../contexts/AuthContext';
import DashboardPage from './DashboardPage';

const LoginPage: React.FC = () => {
  const { isSignUp, isAnimating, toggleMode } = useAnimation();
  const { isAuthenticated, isLoading } = useAuth();

  // Si está autenticado, mostrar el dashboard
  if (isAuthenticated) {
    return <DashboardPage />;
  }

  // Si está cargando, mostrar un spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

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
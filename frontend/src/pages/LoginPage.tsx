import React from 'react';
import { useAnimation } from '../hooks/useAnimation';
import { BrandingColumn, FormColumn } from '../components/auth';
import { useAuth } from '../stores';
import DashboardPage from './DashboardPage';

const LoginPage: React.FC = () => {
  const { isAuthenticated, isInitializing } = useAuth();
  const { isSignUp, isAnimating, toggleMode } = useAnimation();

  // Si está autenticado, mostrar el dashboard
  if (isAuthenticated) {
    return <DashboardPage />;
  }

  // Solo mostrar pantalla de carga durante la inicialización (verificación de tokens)
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-secondary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-100 flex items-center justify-center p-4"> 
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
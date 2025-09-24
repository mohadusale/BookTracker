import LoginPage from './pages/LoginPage';
import ErrorBoundary from './components/ErrorBoundary';
import React, { useEffect } from 'react';
import { useAuthStore } from './stores';

const App: React.FC = () => {
  const { checkAuth, isInitializing } = useAuthStore();

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Mostrar loading mientras se verifica la autenticación
  if (isInitializing) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Verificando autenticación...</p>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <LoginPage />
    </ErrorBoundary>
  );
};

export default App;

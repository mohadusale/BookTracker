import LoginPage from './pages/LoginPage';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import React from 'react';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;

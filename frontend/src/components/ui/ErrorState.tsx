import { memo } from 'react';
import { Search } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  onLogin?: () => void;
  title?: string;
}

export const ErrorState = memo(function ErrorState({ error, onRetry, onLogin, title }: ErrorStateProps) {
  const isAuthError = error.includes('autenticado') || error.includes('token');
  
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
        <Search className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="font-display font-semibold text-lg text-neutral-900 mb-2">
        {title || (isAuthError ? 'Sesión expirada' : 'Error al cargar')}
      </h3>
      <p className="text-neutral-500 mb-4">{error}</p>
      <div className="flex gap-2 justify-center">
        {isAuthError ? (
          <Button onClick={onLogin}>Ir al Login</Button>
        ) : (
          <Button variant="outline" onClick={onRetry}>Reintentar</Button>
        )}
      </div>
    </div>
  );
});

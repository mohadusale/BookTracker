import { memo } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = memo(function LoadingState({ message = "Cargando..." }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-500" />
        <p className="text-neutral-600">{message}</p>
      </div>
    </div>
  );
});

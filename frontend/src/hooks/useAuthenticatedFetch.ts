import { useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';

/**
 * Hook para realizar fetch automático con autenticación
 * Incluye cache inteligente para evitar llamadas redundantes
 * 
 * @param fetchFn - Función que realiza el fetch
 * @param dependencies - Dependencias que disparan el fetch
 * @param options - Opciones de configuración
 */
export function useAuthenticatedFetch<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = [],
  options: {
    enabled?: boolean;
    cacheTime?: number; // Tiempo de validez del cache en ms
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const { enabled = true, cacheTime = 5 * 60 * 1000 } = options; // Default 5 minutos
  const { isAuthenticated, tokens } = useAuthStore();
  const lastFetchRef = useRef<number>(0);
  const isFetchingRef = useRef<boolean>(false);

  const shouldFetch = useCallback(() => {
    if (!enabled || !isAuthenticated || !tokens?.access) {
      return false;
    }

    // Si ya está fetching, no hacer otra llamada
    if (isFetchingRef.current) {
      return false;
    }

    // Verificar si el cache sigue válido
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchRef.current;
    
    if (timeSinceLastFetch < cacheTime && lastFetchRef.current > 0) {
      return false; // Cache aún válido
    }

    return true;
  }, [enabled, isAuthenticated, tokens?.access, cacheTime]);

  const executeFetch = useCallback(async () => {
    if (!shouldFetch()) {
      return;
    }

    try {
      isFetchingRef.current = true;
      const data = await fetchFn();
      lastFetchRef.current = Date.now();
      
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    } catch (error) {
      console.error('Error en useAuthenticatedFetch:', error);
      if (options.onError) {
        options.onError(error as Error);
      }
    } finally {
      isFetchingRef.current = false;
    }
  }, [shouldFetch, options]);

  useEffect(() => {
    if (enabled && isAuthenticated && tokens?.access) {
      fetchFn().then(() => {
        lastFetchRef.current = Date.now();
      }).catch((error) => {
        console.error('Error en useAuthenticatedFetch:', error);
        if (options.onError) {
          options.onError(error as Error);
        }
      });
    }
  }, [enabled, isAuthenticated, tokens?.access, ...dependencies]);

  return {
    refetch: executeFetch,
    clearCache: () => { lastFetchRef.current = 0; },
  };
}

/**
 * Hook simplificado para fetch inicial con autenticación
 * Útil para cargar datos una vez al montar el componente
 * 
 * @param fetchFn - Función que realiza el fetch
 * @param enabled - Si el fetch está habilitado (default: true)
 */
export function useInitialFetch(
  fetchFn: () => Promise<void>,
  enabled: boolean = true
) {
  const { isAuthenticated, tokens } = useAuthStore();
  const hasExecutedRef = useRef(false);

  useEffect(() => {
    if (enabled && isAuthenticated && tokens?.access && !hasExecutedRef.current) {
      hasExecutedRef.current = true;
      fetchFn().catch(console.error);
    }
  }, [enabled, isAuthenticated, tokens?.access]);
}


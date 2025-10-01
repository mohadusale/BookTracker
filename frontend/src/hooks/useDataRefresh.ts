import { useCallback, useState } from 'react';
import { useShelvesActions } from '../stores';

/**
 * Hook personalizado para manejar refrescos de datos de manera eficiente
 * Evita llamadas redundantes y proporciona una API consistente
 */
export function useDataRefresh() {
  const { fetchShelves } = useShelvesActions();
  const [lastRefresh, setLastRefresh] = useState<number>(0);
  const REFRESH_COOLDOWN = 1000; // 1 segundo de cooldown

  const refreshShelves = useCallback(async (force = false) => {
    const now = Date.now();
    
    // Evitar llamadas redundantes muy seguidas
    if (!force && now - lastRefresh < REFRESH_COOLDOWN) {
      console.log('Refresco omitido - muy reciente');
      return;
    }

    try {
      await fetchShelves();
      setLastRefresh(now);
    } catch (error) {
      console.error('Error al refrescar estanterías:', error);
    }
  }, [fetchShelves, lastRefresh]);

  return {
    refreshShelves,
    lastRefresh
  };
}

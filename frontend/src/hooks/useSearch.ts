import { useState, useEffect, useMemo } from 'react';

/**
 * Hook personalizado para búsqueda con debounce
 * Optimiza el rendimiento retrasando la búsqueda hasta que el usuario deje de escribir
 * 
 * @param initialValue - Valor inicial de la búsqueda
 * @param delay - Tiempo de espera en milisegundos antes de ejecutar la búsqueda (default: 300ms)
 * @returns Objeto con query (valor actual), debouncedQuery (valor con debounce) y setQuery
 */
export function useSearch(initialValue: string = '', delay: number = 300) {
  const [query, setQuery] = useState(initialValue);
  const [debouncedQuery, setDebouncedQuery] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [query, delay]);

  return {
    query,
    debouncedQuery,
    setQuery,
  };
}

/**
 * Normaliza un texto para búsqueda (lowercase, trim)
 * @param text - Texto a normalizar
 * @returns Texto normalizado
 */
export const normalizeSearchText = (text: string): string => {
  return text.toLowerCase().trim();
};

/**
 * Hook para filtrar elementos por búsqueda en múltiples campos
 * 
 * @param items - Array de elementos a filtrar
 * @param searchQuery - Query de búsqueda
 * @param searchFields - Función que extrae los campos a buscar de cada elemento
 * @returns Array filtrado
 */
export function useSearchFilter<T>(
  items: T[],
  searchQuery: string,
  searchFields: (item: T) => string[]
): T[] {
  return useMemo(() => {
    if (!searchQuery.trim()) return items;

    const normalizedQuery = normalizeSearchText(searchQuery);

    return items.filter(item => {
      const fields = searchFields(item);
      return fields.some(field => 
        normalizeSearchText(field).includes(normalizedQuery)
      );
    });
  }, [items, searchQuery, searchFields]);
}


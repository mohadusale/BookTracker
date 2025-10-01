import { useMemo } from 'react';
import { normalizeSearchText } from './useSearch';

/**
 * Configuración para filtrado
 */
export interface FilterConfig<T> {
  searchQuery?: string;
  searchFields?: (item: T) => string[];
  customFilters?: ((item: T) => boolean)[];
}

/**
 * Configuración para ordenamiento
 */
export interface SortConfig<T> {
  sortBy: string;
  sortFn: (a: T, b: T, sortBy: string) => number;
}

/**
 * Hook personalizado para filtrar y ordenar elementos
 * Optimizado con useMemo para evitar cálculos innecesarios
 * 
 * @param items - Array de elementos a procesar
 * @param filterConfig - Configuración de filtrado
 * @param sortConfig - Configuración de ordenamiento
 * @returns Array filtrado y ordenado
 */
export function useFilteredAndSorted<T>(
  items: T[],
  filterConfig: FilterConfig<T>,
  sortConfig?: SortConfig<T>
): T[] {
  return useMemo(() => {
    let result = [...items];

    // Aplicar filtros
    if (filterConfig.searchQuery && filterConfig.searchFields) {
      const normalizedQuery = normalizeSearchText(filterConfig.searchQuery);
      
      if (normalizedQuery) {
        result = result.filter(item => {
          const fields = filterConfig.searchFields!(item);
          return fields.some(field => 
            normalizeSearchText(field).includes(normalizedQuery)
          );
        });
      }
    }

    // Aplicar filtros personalizados
    if (filterConfig.customFilters && filterConfig.customFilters.length > 0) {
      filterConfig.customFilters.forEach(filterFn => {
        result = result.filter(filterFn);
      });
    }

    // Aplicar ordenamiento
    if (sortConfig) {
      result.sort((a, b) => sortConfig.sortFn(a, b, sortConfig.sortBy));
    }

    return result;
  }, [items, filterConfig, sortConfig]);
}

/**
 * Funciones de ordenamiento comunes
 */
export const commonSortFunctions = {
  /**
   * Ordenar por string (alfabético)
   */
  byString: <T>(a: T, b: T, field: keyof T): number => {
    const aValue = String(a[field] || '');
    const bValue = String(b[field] || '');
    return aValue.localeCompare(bValue);
  },

  /**
   * Ordenar por número
   */
  byNumber: <T>(a: T, b: T, field: keyof T, ascending: boolean = false): number => {
    const aValue = Number(a[field] || 0);
    const bValue = Number(b[field] || 0);
    return ascending ? aValue - bValue : bValue - aValue;
  },

  /**
   * Ordenar por fecha
   */
  byDate: <T>(a: T, b: T, field: keyof T, ascending: boolean = false): number => {
    const aValue = new Date(a[field] as any).getTime();
    const bValue = new Date(b[field] as any).getTime();
    return ascending ? aValue - bValue : bValue - aValue;
  },
};


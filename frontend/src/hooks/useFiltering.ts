import { useMemo } from 'react';

interface UseFilteringOptions<T> {
  items: T[];
  searchQuery: string;
  searchFields: (keyof T)[];
  sortBy: string;
  sortFunction: (a: T, b: T) => number;
}

export function useFiltering<T>({ 
  items, 
  searchQuery, 
  searchFields, 
  sortBy, 
  sortFunction 
}: UseFilteringOptions<T>) {
  return useMemo(() => {
    return items
      .filter(item => {
        if (!searchQuery) return true;
        return searchFields.some(field => {
          const value = item[field];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchQuery.toLowerCase());
          }
          return false;
        });
      })
      .sort(sortFunction);
  }, [items, searchQuery, searchFields, sortBy, sortFunction]);
}

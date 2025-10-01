import { useState, useEffect } from 'react';
import { Button } from '../../../ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui';
import { ErrorState } from '../../../ui';
import { LoadingState } from '../../../ui';
import { SearchInput } from '../../../ui';
import { Archive, Plus } from 'lucide-react';
import { useShelvesList, useShelvesLoading, useShelvesError, useShelvesActions } from '../../../../stores';
import { useSearch } from '../../../../hooks/useSearch';
import { useFilteredAndSorted } from '../../../../hooks/useFilteredAndSorted';
import { ShelfCard } from './ShelfCard';
import { CreateShelfModal } from './CreateShelfModal.tsx';
import type { ShelfCardData } from '../../../../types/shelves';

interface ShelvesSectionProps {
  onViewShelf?: (shelfId: number, shelfName: string) => void;
}

export function ShelvesSection({ onViewShelf }: ShelvesSectionProps) {
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const shelves = useShelvesList();
  const loading = useShelvesLoading();
  const error = useShelvesError();
  const { fetchShelves, clearError } = useShelvesActions();

  // Hook de búsqueda con debounce
  const { debouncedQuery, setQuery } = useSearch('', 300);

  // Fetch inicial
  useEffect(() => {
    fetchShelves();
  }, []);

  // Filtrado y ordenamiento optimizado
  const filteredShelves = useFilteredAndSorted<ShelfCardData>(
    shelves,
    {
      searchQuery: debouncedQuery,
      searchFields: (shelf) => [shelf.name, shelf.description],
    },
    {
      sortBy,
      sortFn: (a, b, sortBy) => {
        switch (sortBy) {
          case 'name': 
            return a.name.localeCompare(b.name);
          case 'date': 
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          default: 
            return 0;
        }
      }
    }
  );

  if (loading) {
    return <LoadingState message="Cargando tus estanterías..." />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Error al cargar las estanterías"
        onRetry={() => {
          clearError();
          fetchShelves();
        }}
        onLogin={() => {
          window.location.href = '/login';
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {filteredShelves.length > 0 && (
        <div className="flex justify-center">
          <Button onClick={() => setShowCreateModal(true)} className="bg-primary-500 hover:bg-primary-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Crear Estantería
          </Button>
        </div>
      )}

      {filteredShelves.length > 0 && (
        <>
          <div className="flex flex-col lg:flex-row gap-3 justify-center items-center">
            <SearchInput
              value={debouncedQuery}
              onChange={setQuery}
              placeholder="Buscar estanterías..."
            />
            
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'date')}>
              <SelectTrigger className="w-48 h-10 border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <SelectValue placeholder="Ordenar por">
                  {sortBy === 'name' && 'Nombre A-Z'}
                  {sortBy === 'date' && 'Más recientes'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre A-Z</SelectItem>
                <SelectItem value="date">Más recientes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center items-center">
            <div className="text-sm text-neutral-600">
              {filteredShelves.length === 1 ? "1 estantería encontrada" : `${filteredShelves.length} estanterías encontradas`}
              {debouncedQuery && <span className="ml-2 text-neutral-500">para "{debouncedQuery}"</span>}
            </div>
          </div>
        </>
      )}

      {filteredShelves.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredShelves.map((shelf, index) => (
            <ShelfCard 
              key={`shelf-${shelf.id || index}`} 
              shelf={shelf} 
              onViewShelf={onViewShelf}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Archive className="h-6 w-6 text-neutral-500" />
          </div>
          <h3 className="font-display font-semibold text-lg text-neutral-900 mb-2">
            {debouncedQuery ? 'No se encontraron estanterías' : 'No tienes estanterías'}
          </h3>
          <p className="text-neutral-500 mb-4">
            {debouncedQuery ? 'Intenta ajustar tu búsqueda' : 'Crea tu primera estantería para organizar tus libros'}
          </p>
          {!debouncedQuery && (
            <Button onClick={() => setShowCreateModal(true)} className="bg-primary-500 hover:bg-primary-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Crear Estantería
            </Button>
          )}
        </div>
      )}

      <CreateShelfModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}

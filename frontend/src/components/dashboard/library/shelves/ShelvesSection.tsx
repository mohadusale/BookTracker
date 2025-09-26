import { useState, useEffect, useMemo } from 'react';
import { Button } from '../../../ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui';
import { ErrorState } from '../../../ui';
import { LoadingState } from '../../../ui';
import { SearchInput } from '../../../ui';
import { Archive, Plus } from 'lucide-react';
import { useShelvesList, useShelvesLoading, useShelvesError, useShelvesActions } from '../../../../stores';
import { useAuthStore } from '../../../../stores';
import { ShelfCard } from './ShelfCard';
import { CreateShelfModal } from './CreateShelfModal.tsx';

interface ShelvesSectionProps {
  onViewShelf?: (shelfId: number, shelfName: string) => void;
}

export function ShelvesSection({ onViewShelf }: ShelvesSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'books'>('date');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const shelves = useShelvesList();
  const loading = useShelvesLoading();
  const error = useShelvesError();
  const { fetchShelves, clearError } = useShelvesActions();
  const { isAuthenticated, tokens } = useAuthStore();

  const filteredShelves = useMemo(() => {
    return shelves
      .filter(shelf => {
        const matchesSearch = !searchQuery || 
          shelf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shelf.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name': return a.name.localeCompare(b.name);
          case 'date': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'books': return b.bookCount - a.bookCount;
          default: return 0;
        }
      });
  }, [shelves, searchQuery, sortBy]);

  useEffect(() => {
    if (isAuthenticated && tokens?.access) {
      fetchShelves().catch(console.error);
    }
  }, [isAuthenticated, tokens?.access, fetchShelves]);


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
          useAuthStore.getState().logout();
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
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar estanterías..."
            />
            
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'date' | 'books')}>
              <SelectTrigger className="w-48 h-10 border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <SelectValue placeholder="Ordenar por">
                  {sortBy === 'name' && 'Nombre A-Z'}
                  {sortBy === 'date' && 'Más recientes'}
                  {sortBy === 'books' && 'Más libros'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre A-Z</SelectItem>
                <SelectItem value="date">Más recientes</SelectItem>
                <SelectItem value="books">Más libros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center items-center">
            <div className="text-sm text-neutral-600">
              {filteredShelves.length === 1 ? "1 estantería encontrada" : `${filteredShelves.length} estanterías encontradas`}
              {searchQuery && <span className="ml-2 text-neutral-500">para "{searchQuery}"</span>}
            </div>
            {searchQuery && (
              <Button variant="outline" size="sm" onClick={() => setSearchQuery("")} className="text-xs ml-4">
                Limpiar búsqueda
              </Button>
            )}
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
            {searchQuery ? 'No se encontraron estanterías' : 'No tienes estanterías'}
          </h3>
          <p className="text-neutral-500 mb-4">
            {searchQuery ? 'Intenta ajustar tu búsqueda' : 'Crea tu primera estantería para organizar tus libros'}
          </p>
          {searchQuery ? (
            <Button variant="outline" onClick={() => setSearchQuery("")}>Limpiar búsqueda</Button>
          ) : (
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

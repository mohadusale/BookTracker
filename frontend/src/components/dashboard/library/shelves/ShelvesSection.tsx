import { useState, useEffect } from 'react';
import { Button } from '../../../ui';
import { Input } from '../../../ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui';
import { Archive, Plus, Search, Loader2 } from 'lucide-react';
import { useShelvesList, useShelvesLoading, useShelvesError, useShelvesActions } from '../../../../stores';
import { useAuthStore } from '../../../../stores';
import { ShelfCard } from './ShelfCard';
import { CreateShelfModal } from './CreateShelfModal.tsx';

export function ShelvesSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'books'>('date');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Obtener estado del store
  const shelves = useShelvesList();
  const loading = useShelvesLoading();
  const error = useShelvesError();
  const { fetchShelves, clearError } = useShelvesActions();

  // Obtener estado de autenticación
  const { isAuthenticated, tokens } = useAuthStore();

  // Filtrar y ordenar estanterías
  const filteredShelves = shelves
    .filter(shelf => {
      const matchesSearch = shelf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           shelf.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'books':
          return b.bookCount - a.bookCount;
        default:
          return 0;
      }
    });

  // Cargar datos del backend al montar el componente
  useEffect(() => {
    const loadShelves = async () => {
      // Verificar autenticación antes de cargar datos
      if (!isAuthenticated || !tokens?.access) {
        return;
      }

      try {
        await fetchShelves();
      } catch (error) {
        console.error('Error al cargar estanterías:', error);
      }
    };

    loadShelves();
  }, [isAuthenticated, tokens?.access, fetchShelves]);

  const handleCreateShelf = () => {
    setShowCreateModal(true);
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-500" />
          <p className="text-neutral-600">Cargando tus estanterías...</p>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    const isAuthError = error.includes('autenticado') || error.includes('token');
    
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Search className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="font-display font-semibold text-lg text-neutral-900 mb-2">
          {isAuthError ? 'Sesión expirada' : 'Error al cargar las estanterías'}
        </h3>
        <p className="text-neutral-500 mb-4">{error}</p>
        <div className="flex gap-2 justify-center">
          {isAuthError ? (
            <Button 
              onClick={() => {
                useAuthStore.getState().logout();
                window.location.href = '/login';
              }}
            >
              Ir al Login
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => {
                clearError();
                fetchShelves();
              }}
            >
              Reintentar
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Botón crear estantería centrado - solo si hay estanterías */}
      {filteredShelves.length > 0 && (
        <div className="flex justify-center">
          <Button 
            onClick={handleCreateShelf} 
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Crear Estantería
          </Button>
        </div>
      )}

      {/* Filtros - solo si hay estanterías */}
      {filteredShelves.length > 0 && (
        <>
          <div className="flex flex-col lg:flex-row gap-3 justify-center items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Buscar estanterías..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
              />
            </div>
            
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

          {/* Información */}
          <div className="flex justify-center items-center">
            <div className="text-sm text-neutral-600">
              {filteredShelves.length === 1 
                ? "1 estantería encontrada" 
                : `${filteredShelves.length} estanterías encontradas`
              }
              {searchQuery && (
                <span className="ml-2 text-neutral-500">
                  para "{searchQuery}"
                </span>
              )}
            </div>
            {searchQuery && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSearchQuery("")}
                className="text-xs ml-4"
              >
                Limpiar búsqueda
              </Button>
            )}
          </div>
        </>
      )}

      {/* Grid de Estanterías */}
      {filteredShelves.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredShelves.map((shelf, index) => (
            <ShelfCard key={`shelf-${shelf.id || index}`} shelf={shelf} />
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
            {searchQuery 
              ? 'Intenta ajustar tu búsqueda'
              : 'Crea tu primera estantería para organizar tus libros'
            }
          </p>
          {searchQuery ? (
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery("")}
            >
              Limpiar búsqueda
            </Button>
          ) : (
            <Button 
              onClick={handleCreateShelf} 
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Estantería
            </Button>
          )}
        </div>
      )}

      {/* Modal de creación */}
      <CreateShelfModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}

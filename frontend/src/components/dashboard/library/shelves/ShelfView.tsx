import { useState, useCallback, memo, useEffect } from 'react';
import { Button } from '../../../ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui';
import { BookDetailsModal } from '../../../ui';
import { ErrorState } from '../../../ui';
import { LoadingState } from '../../../ui';
import { SearchInput } from '../../../ui';
import { StatusFilter } from '../../../ui';
import { RatingFilter } from '../../../ui';
import { ArrowLeft, BookOpen, MoreHorizontal, Edit3, Trash2, Plus } from 'lucide-react';
import { useBookDetailsModal } from '../../../../hooks/useBookDetailsModal';
import { useSearch } from '../../../../hooks/useSearch';
import { useFilteredAndSorted } from '../../../../hooks/useFilteredAndSorted';
import { ShelfCoverCollage } from '../../../ui/ShelfCoverCollage';
import { getVisibilityText } from '../../../../utils/shelfCoverUtils';
import { shelvesService } from '../../../../services/shelvesService';
import { useShelvesActions, useLibraryStore, useLibraryActions } from '../../../../stores';
import { useIsAuthenticated, useAccessToken } from '../../../../stores/authStore';
import { EditShelfModal } from './EditShelfModal';
import { DeleteShelfModal } from './DeleteShelfModal';
import { AddBooksToShelfModal } from './AddBooksToShelfModal';
import { BookCard } from '../BookCard';
import type { BookCardData } from '../../../../types/library';
import type { ShelfCardData } from '../../../../types/shelves';

interface ShelfViewProps {
  shelfId: number;
  shelfName: string;
  onBack: () => void;
}

interface ShelfBook {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  status: 'N' | 'R' | 'C';
  readingStatusId: number;
}

export const ShelfView = memo(function ShelfView({ shelfId, shelfName, onBack }: ShelfViewProps) {
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'rating' | 'date'>('title');
  const [statusFilter, setStatusFilter] = useState<'all' | 'C' | 'R' | 'N'>('all');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [books, setBooks] = useState<ShelfBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddBooksModal, setShowAddBooksModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [shelfInfo, setShelfInfo] = useState<ShelfCardData | null>(null);

  const { selectedBook, isOpen, openModal, closeModal } = useBookDetailsModal();
  const { deleteShelf } = useShelvesActions();
  const { fetchUserBooks } = useLibraryActions();
  const getUserBookStatus = useLibraryStore(state => state.getUserBookStatus);
  const isAuthenticated = useIsAuthenticated();
  const accessToken = useAccessToken();

  // Hook de búsqueda con debounce
  const { debouncedQuery, setQuery } = useSearch('', 300);

  // Función para recargar los datos de la estantería
  const reloadShelfData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const shelfData = await shelvesService.getBookshelf(shelfId);
      
      const shelfBooks: ShelfBook[] = shelfData.entries?.map((entry: any) => {
        const readingStatus = getUserBookStatus(entry.book.id);
        
        return {
          id: entry.book.id,
          title: entry.book.title,
          author: entry.book.authors?.[0] || 'Autor desconocido',
          cover: entry.book.cover_image_url || '',
          rating: readingStatus?.rating || 0,
          status: readingStatus?.status || 'N',
          readingStatusId: readingStatus?.id || 0
        };
      }) || [];
      
      setBooks(shelfBooks);
      setShelfInfo({
        id: shelfData.id,
        name: shelfData.name,
        description: shelfData.description || '',
        visibility: shelfData.visibility || 'public',
        bookCount: shelfData.book_count || 0,
        cover: shelfData.cover_image_url || '',
        color: '',
        created_at: shelfData.created_at,
        auto_cover_books: shelfData.auto_cover_books || []
      });
    } catch (error) {
      console.error('Error al cargar datos de la estantería:', error);
      setError('Error al cargar los datos de la estantería');
    } finally {
      setLoading(false);
    }
  }, [shelfId, getUserBookStatus]);

  // Cargar datos iniciales
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      fetchUserBooks(1).catch(console.error);
    }
    reloadShelfData();
  }, [reloadShelfData, isAuthenticated, accessToken, fetchUserBooks]);

  // Cerrar menú de opciones al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // No cerrar si se hace clic dentro del menú
      if (target.closest('[data-options-menu]')) {
        return;
      }
      setShowOptions(false);
    };
    
    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOptions]);

  // Filtrado y ordenamiento optimizado
  const filteredBooks = useFilteredAndSorted<ShelfBook>(
    books,
    {
      searchQuery: debouncedQuery,
      searchFields: (book) => [book.title, book.author],
      customFilters: [
        (book) => statusFilter === "all" || book.status === statusFilter,
        (book) => {
          // Solo aplicar filtro de rating si estamos en "Finalizados" y hay un rating seleccionado
          if (statusFilter === "C" && ratingFilter !== null) {
            // Permitir tanto el rating exacto como el rating redondeado
            return book.rating === ratingFilter || Math.round(book.rating * 2) / 2 === ratingFilter;
          }
          return true;
        }
      ]
    },
    {
      sortBy,
      sortFn: (a, b, sortBy) => {
        switch (sortBy) {
          case 'title': return a.title.localeCompare(b.title);
          case 'author': return a.author.localeCompare(b.author);
          case 'rating': return b.rating - a.rating;
          case 'date': return b.id - a.id;
          default: return 0;
        }
      }
    }
  );

  const handleViewBook = useCallback((book: BookCardData) => openModal(book), [openModal]);

  const handleEditShelf = useCallback(() => {
    setShowEditModal(true);
    setShowOptions(false);
  }, []);

  const handleEditModalClose = useCallback(() => {
    setShowEditModal(false);
    reloadShelfData();
  }, [reloadShelfData]);

  const handleBooksAdded = useCallback(() => {
    reloadShelfData();
  }, [reloadShelfData]);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteModal(true);
    setShowOptions(false);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      setIsDeleting(true);
      await deleteShelf(shelfId);
      setShowDeleteModal(false);
      onBack();
    } catch (error) {
      console.error('Error al eliminar estantería:', error);
    } finally {
      setIsDeleting(false);
    }
  }, [shelfId, deleteShelf, onBack]);

  if (loading) {
    return <LoadingState message="Cargando libros de la estantería..." />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Error al cargar la estantería"
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Estanterías
        </Button>

        <Button
          onClick={() => setShowAddBooksModal(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Añadir libros
        </Button>
      </div>

      {/* Info estantería */}
      <div className="bg-gradient-to-r from-neutral-50 to-white rounded-xl border border-neutral-200 p-6 mb-8 relative">
        <div className="absolute top-4 right-4">
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOptions(!showOptions)}
              className="h-8 w-8 p-0 hover:bg-neutral-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            
            {showOptions && (
              <div 
                data-options-menu
                className="absolute right-0 top-10 z-10 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg py-1"
              >
                <button
                  onClick={handleEditShelf}
                  className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Editar estantería
                </button>
                <button
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar estantería
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <ShelfCoverCollage 
            books={shelfInfo?.auto_cover_books || []}
            coverImageUrl={shelfInfo?.cover}
            className="w-32 h-48 flex-shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            <p className="text-sm mb-2 text-neutral-900">
              {getVisibilityText(shelfInfo?.visibility || 'public')}
            </p>
            <h1 className="font-display font-bold text-4xl lg:text-5xl xl:text-6xl text-neutral-900 mb-4 leading-tight">{shelfName}</h1>
            <div className="flex flex-col gap-2 text-sm text-neutral-600">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{shelfInfo?.bookCount || 0} {(shelfInfo?.bookCount || 0) === 1 ? 'libro' : 'libros'}</span>
              </div>
              {shelfInfo?.created_at && (
                <div className="text-neutral-500">
                  Creada el {new Date(shelfInfo.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 justify-center items-center">
          <SearchInput
            value={debouncedQuery}
            onChange={setQuery}
            placeholder="Buscar libros en esta estantería..."
          />
          
          <StatusFilter
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value as 'all' | 'C' | 'R' | 'N');
              // Limpiar filtro de rating cuando cambia el estado
              if (value !== 'C') {
                setRatingFilter(null);
              }
            }}
          />
          
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'title' | 'author' | 'rating' | 'date')}>
            <SelectTrigger className="w-48 h-10 border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <SelectValue placeholder="Ordenar por">
                {sortBy === 'title' && 'Título A-Z'}
                {sortBy === 'author' && 'Autor A-Z'}
                {sortBy === 'rating' && 'Calificación'}
                {sortBy === 'date' && 'Fecha'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Título A-Z</SelectItem>
              <SelectItem value="author">Autor A-Z</SelectItem>
              <SelectItem value="rating">Calificación</SelectItem>
              <SelectItem value="date">Fecha</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {statusFilter === "C" && (
          <div className="flex justify-center">
            <RatingFilter
              selectedRating={ratingFilter}
              onRatingChange={setRatingFilter}
            />
          </div>
        )}
      </div>

      {/* Grid de Libros */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
          {filteredBooks.map((book) => (
            <BookCard 
              key={book.id} 
              book={book as BookCardData} 
              onViewBook={handleViewBook}
              onRatingChange={() => {}}
              disableRating={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-6 w-6 text-neutral-500" />
          </div>
          <h3 className="font-display font-semibold text-lg text-neutral-900 mb-2">
            {debouncedQuery ? 'No se encontraron libros' : 'Esta estantería está vacía'}
          </h3>
          <p className="text-neutral-500 mb-4">
            {debouncedQuery 
              ? 'Intenta ajustar tu búsqueda' 
              : 'Agrega libros a esta estantería para organizarlos'
            }
          </p>
        </div>
      )}

      {/* Modales */}
      <BookDetailsModal
        isOpen={isOpen}
        onClose={closeModal}
        book={selectedBook}
        onRatingChange={() => {}}
      />

      {shelfInfo && (
        <EditShelfModal
          isOpen={showEditModal}
          onClose={handleEditModalClose}
          shelf={shelfInfo}
        />
      )}

      <DeleteShelfModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        shelfName={shelfName}
        isDeleting={isDeleting}
      />

      <AddBooksToShelfModal
        isOpen={showAddBooksModal}
        onClose={() => setShowAddBooksModal(false)}
        shelfId={shelfId}
        shelfName={shelfName}
        booksInShelf={books.map(book => book.id)}
        onBooksAdded={handleBooksAdded}
      />
    </div>
  );
});

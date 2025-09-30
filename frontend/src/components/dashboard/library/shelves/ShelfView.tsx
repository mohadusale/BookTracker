import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import { Button } from '../../../ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui';
import { BookDetailsModal } from '../../../ui';
import { ErrorState } from '../../../ui';
import { LoadingState } from '../../../ui';
import { SearchInput } from '../../../ui';
import { ArrowLeft, BookOpen, MoreHorizontal, Edit3, Trash2, Plus } from 'lucide-react';
import { useBookDetailsModal } from '../../../../hooks/useBookDetailsModal';
import { ShelfCoverCollage } from '../../../ui/ShelfCoverCollage';
import { getVisibilityText } from '../../../../utils/shelfCoverUtils';
import { shelvesService } from '../../../../services/shelvesService';
import { useShelvesActions, useLibraryStore, useLibraryActions } from '../../../../stores';
import { useAuthStore } from '../../../../stores/authStore';
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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'rating' | 'date'>('title');
  const [books, setBooks] = useState<ShelfBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddBooksModal, setShowAddBooksModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [shelfInfo, setShelfInfo] = useState<ShelfCardData | null>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const { selectedBook, isOpen, openModal, closeModal } = useBookDetailsModal();
  const { deleteShelf } = useShelvesActions();
  const { fetchUserBooks } = useLibraryActions();
  const getUserBookStatus = useLibraryStore(state => state.getUserBookStatus);
  const { isAuthenticated, tokens } = useAuthStore();

  // Función para recargar los datos de la estantería
  const reloadShelfData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar datos de la estantería desde el API
      const shelfData = await shelvesService.getBookshelf(shelfId);
      
      // Mapear los libros de la estantería al formato esperado
      const shelfBooks: ShelfBook[] = shelfData.entries?.map((entry: any) => {
        // Obtener el reading status del store (más eficiente que query al backend)
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
  }, [shelfId]);

  const filteredBooks = useMemo(() => {
    return books
      .filter(book => {
        const matchesSearch = !searchQuery || 
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'title': return a.title.localeCompare(b.title);
          case 'author': return a.author.localeCompare(b.author);
          case 'rating': return b.rating - a.rating;
          case 'date': return b.id - a.id; // Simulando fecha por ID
          default: return 0;
        }
      });
  }, [books, searchQuery, sortBy]);

  useEffect(() => {
    // Cargar reading statuses primero para tener los datos disponibles
    if (isAuthenticated && tokens?.access) {
      fetchUserBooks(1).catch(console.error);
    }
    reloadShelfData();
  }, [reloadShelfData, isAuthenticated, tokens?.access, fetchUserBooks]);

  // Cerrar menú de opciones al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptions]);

  const handleViewBook = useCallback((book: BookCardData) => openModal(book), [openModal]);

  const handleRatingChange = useCallback(async (_rating: number, _bookId: number) => {
    // TODO: Implementar actualización de rating
  }, []);

  const handleEditShelf = useCallback(() => {
    setShowEditModal(true);
    setShowOptions(false);
  }, []);

  const handleEditModalClose = useCallback(() => {
    setShowEditModal(false);
    // Recargar datos para reflejar los cambios
    reloadShelfData();
  }, [reloadShelfData]);

  const handleBooksAdded = useCallback(() => {
    // Recargar datos para mostrar los nuevos libros
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
      // Volver a la sección de estanterías después de eliminar
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
        {/* Header con botón de regreso y añadir libros */}
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

      {/* Portada y información de la estantería */}
      <div className="bg-gradient-to-r from-neutral-50 to-white rounded-xl border border-neutral-200 p-6 mb-8 relative">
        {/* Botón de opciones */}
        <div className="absolute top-4 right-4">
          <div className="relative" ref={optionsRef}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOptions(!showOptions)}
              className="h-8 w-8 p-0 hover:bg-neutral-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            
            {/* Menú desplegable de opciones */}
            {showOptions && (
              <div className="absolute right-0 top-10 z-10 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg py-1">
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
          {/* Portada de la estantería */}
          <ShelfCoverCollage 
            books={shelfInfo?.auto_cover_books || []}
            coverImageUrl={shelfInfo?.cover}
            className="w-32 h-48 flex-shrink-0"
          />
          
          {/* Información de la estantería */}
          <div className="flex-1 min-w-0">
            <p className="text-sm mb-2 text-neutral-900">
              {getVisibilityText(shelfInfo?.visibility || 'public')}
            </p>
            <h1 className="font-display font-bold text-4xl lg:text-5xl xl:text-6xl text-neutral-900 mb-4 leading-tight">{shelfName}</h1>
            <div className="flex items-center gap-4 text-sm text-neutral-600">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{shelfInfo?.bookCount || 0} {(shelfInfo?.bookCount || 0) === 1 ? 'libro' : 'libros'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Filtros */}
        <div className="flex flex-col lg:flex-row gap-3 justify-center items-center">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar libros en esta estantería..."
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


        {/* Grid de Libros */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
            {filteredBooks.map((book) => (
              <BookCard 
                key={book.id} 
                book={book as BookCardData} 
                onViewBook={handleViewBook}
                onRatingChange={handleRatingChange}
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
              {searchQuery ? 'No se encontraron libros' : 'Esta estantería está vacía'}
            </h3>
            <p className="text-neutral-500 mb-4">
              {searchQuery 
                ? 'Intenta ajustar tu búsqueda' 
                : 'Agrega libros a esta estantería para organizarlos'
              }
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Limpiar búsqueda
              </Button>
            )}
          </div>
        )}

      {/* Modal de detalles del libro */}
      <BookDetailsModal
        isOpen={isOpen}
        onClose={closeModal}
        book={selectedBook}
        onRatingChange={handleRatingChange}
      />

      {/* Modal de edición */}
      {shelfInfo && (
        <EditShelfModal
          isOpen={showEditModal}
          onClose={handleEditModalClose}
          shelf={shelfInfo}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      <DeleteShelfModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        shelfName={shelfName}
        isDeleting={isDeleting}
      />

      {/* Modal de añadir libros */}
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

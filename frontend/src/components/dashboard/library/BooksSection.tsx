import { useState, useCallback, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui';
import { BookDetailsModal } from '../../ui';
import { Pagination } from '../../ui';
import { ErrorState } from '../../ui';
import { LoadingState } from '../../ui';
import { SearchInput } from '../../ui';
import { RatingFilter } from '../../ui';
import { useLibraryBooks, useLibraryLoading, useLibraryError, useLibraryActions, useCurrentPage, useTotalPages, useHasNextPage, useHasPreviousPage } from '../../../stores';
import type { BookCardData } from '../../../types/library';
import { useBookDetailsModal } from '../../../hooks/useBookDetailsModal';
import { useSearch } from '../../../hooks/useSearch';
import { useFilteredAndSorted } from '../../../hooks/useFilteredAndSorted';
import { BookCard } from './BookCard';

export function BooksSection() {
  const [sortBy, setSortBy] = useState("rating");
  const [statusFilter, setStatusFilter] = useState("C"); // Por defecto en Finalizados
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  
  // Hook para el modal de detalles del libro
  const { selectedBook, isOpen, openModal, closeModal } = useBookDetailsModal();

  // Hook de búsqueda con debounce
  const { debouncedQuery, setQuery } = useSearch('', 300);

  // Obtener estado del store
  const books = useLibraryBooks();
  const loading = useLibraryLoading();
  const error = useLibraryError();
  const currentPage = useCurrentPage();
  const totalPages = useTotalPages();
  const hasNextPage = useHasNextPage();
  const hasPreviousPage = useHasPreviousPage();
  const { fetchUserBooks, updateBookRating, clearError } = useLibraryActions();

  // Fetch inicial
  useEffect(() => {
    fetchUserBooks(1);
  }, []);

  // Filtrado y ordenamiento con hook optimizado
  const filteredBooks = useFilteredAndSorted<BookCardData>(
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
        return sortBy === 'rating-asc' ? a.rating - b.rating : b.rating - a.rating;
      }
    }
  );

  const handleRatingChange = useCallback(async (rating: number, bookId: number) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      updateBookRating(bookId, rating, book.readingStatusId).catch(console.error);
    }
  }, [books, updateBookRating]);

  const handleViewBook = useCallback((book: BookCardData) => openModal(book), [openModal]);

  const handlePageChange = useCallback(async (page: number) => {
    await fetchUserBooks(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchUserBooks]);

  if (loading) {
    return <LoadingState message="Cargando tu biblioteca..." />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        title="Error al cargar la biblioteca"
        onRetry={() => {
          clearError();
          fetchUserBooks();
        }}
        onLogin={() => {
          window.location.href = '/login';
        }}
      />
    );
  }

  // Función para obtener mensaje cuando no hay libros
  const getEmptyMessage = () => {
    if (debouncedQuery) {
      return {
        title: 'No se encontraron libros',
        description: 'Intenta ajustar tu búsqueda'
      };
    }
    
    switch (statusFilter) {
      case 'C': return { title: 'No tienes libros finalizados', description: 'Cuando añadas libros a tu biblioteca, aparecerán aquí según su estado' };
      case 'R': return { title: 'No tienes libros en lectura', description: 'Cuando añadas libros a tu biblioteca, aparecerán aquí según su estado' };
      case 'N': return { title: 'No tienes libros por leer', description: 'Cuando añadas libros a tu biblioteca, aparecerán aquí según su estado' };
      default: return { title: 'No tienes libros en esta categoría', description: 'Cuando añadas libros a tu biblioteca, aparecerán aquí según su estado' };
    }
  };

  const emptyMessage = getEmptyMessage();

  return (
    <div className="space-y-6">
      {/* Botones de estado */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setStatusFilter('C')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            statusFilter === 'C'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
          }`}
        >
          Finalizados
        </button>
        <button
          onClick={() => setStatusFilter('R')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            statusFilter === 'R'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
          }`}
        >
          Leyendo
        </button>
        <button
          onClick={() => setStatusFilter('N')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            statusFilter === 'N'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200'
          }`}
        >
          Por leer
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 justify-center items-center">
        <SearchInput
          value={debouncedQuery}
          onChange={setQuery}
          placeholder="Buscar por título o autor..."
        />
        
        {statusFilter === "C" && (
          <RatingFilter
            selectedRating={ratingFilter}
            onRatingChange={setRatingFilter}
          />
        )}
        
        {statusFilter === "C" && (
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 h-10 border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <SelectValue placeholder="Ordenar por">
                {sortBy === 'rating' && 'Calificación ↓'}
                {sortBy === 'rating-asc' && 'Calificación ↑'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Calificación ↓</SelectItem>
              <SelectItem value="rating-asc">Calificación ↑</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {filteredBooks.length > 0 && (
        <div className="flex justify-center items-center">
          <div className="text-sm text-neutral-600">
            {filteredBooks.length === 1 ? "1 libro encontrado" : `${filteredBooks.length} libros encontrados`}
            {debouncedQuery && <span className="ml-2 text-neutral-500">para "{debouncedQuery}"</span>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        {filteredBooks.map((book) => (
          <BookCard 
            key={book.id} 
            book={book} 
            onViewBook={handleViewBook}
            onRatingChange={handleRatingChange}
            disableRating={true}
          />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <h3 className="font-display font-semibold text-lg text-neutral-900 mb-2">
            {emptyMessage.title}
          </h3>
          <p className="text-neutral-500 mb-4">
            {emptyMessage.description}
          </p>
        </div>
      )}

      {filteredBooks.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
        />
      )}

      <BookDetailsModal
        isOpen={isOpen}
        onClose={closeModal}
        book={selectedBook}
        onRatingChange={handleRatingChange}
      />
    </div>
  );
}

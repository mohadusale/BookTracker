import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Card } from '../../ui';
import { Button } from '../../ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui';
import { ImageWithFallback } from '../../ui';
import { InteractiveStarRating } from '../../ui';
import { BookDetailsModal } from '../../ui';
import { Pagination } from '../../ui';
import { ErrorState } from '../../ui';
import { LoadingState } from '../../ui';
import { SearchInput } from '../../ui';
import { StatusFilter } from '../../ui';
import { Eye } from 'lucide-react';
import { useLibraryBooks, useLibraryLoading, useLibraryError, useLibraryActions, useCurrentPage, useTotalPages, useTotalCount, useHasNextPage, useHasPreviousPage } from '../../../stores';
import type { BookCardData } from '../../../types/library';
import { useAuthStore } from '../../../stores';
import { useBookDetailsModal } from '../../../hooks/useBookDetailsModal';

export function BooksSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [statusFilter, setStatusFilter] = useState("C"); // Por defecto en Finalizados
  
  // Hook para el modal de detalles del libro
  const { selectedBook, isOpen, openModal, closeModal } = useBookDetailsModal();

  // Obtener estado del store
  const books = useLibraryBooks();
  const loading = useLibraryLoading();
  const error = useLibraryError();
  const currentPage = useCurrentPage();
  const totalPages = useTotalPages();
  const totalCount = useTotalCount();
  const hasNextPage = useHasNextPage();
  const hasPreviousPage = useHasPreviousPage();
  const { fetchUserBooks, updateBookRating, clearError } = useLibraryActions();
  const { isAuthenticated, tokens } = useAuthStore();


  const filteredBooks = useMemo(() => {
    return books
      .filter(book => {
        const matchesSearch = !searchQuery || 
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch && (statusFilter === "all" || book.status === statusFilter);
      })
      .sort((a, b) => sortBy === 'rating-asc' ? a.rating - b.rating : b.rating - a.rating);
  }, [books, searchQuery, statusFilter, sortBy]);

  useEffect(() => {
    if (isAuthenticated && tokens?.access) {
      fetchUserBooks(1).catch(console.error);
    }
  }, [isAuthenticated, tokens?.access, fetchUserBooks]);

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

  const BookCard = memo(({ book }: { book: BookCardData }) => (
    <Card className="group overflow-hidden bg-white hover:shadow-lg transition-all duration-200 border border-neutral-200 shadow-sm">
      <div className="relative">
        <div className="aspect-[2/3] bg-neutral-100 relative overflow-hidden">
          <ImageWithFallback
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover"
          />
          
          {book.status === 'C' && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                <InteractiveStarRating 
                  rating={book.rating} 
                  size="sm" 
                  showValue={false}
                  bookStatus={book.status as 'N' | 'R' | 'C'}
                  onRatingChange={handleRatingChange}
                  bookId={book.id}
                  disabled={true}
                />
              </div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button 
              size="sm" 
              variant="secondary" 
              className="bg-white/95 hover:bg-white text-xs px-2 py-1"
              onClick={() => handleViewBook(book)}
            >
              <Eye className="h-3 w-3 mr-1" />
              Ver
            </Button>
          </div>
        </div>
      </div>
    </Card>
  ));

  BookCard.displayName = 'BookCard';

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
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <StatusFilter
        value={statusFilter}
        onChange={setStatusFilter}
        options={[
          { key: "C", label: "Finalizados" },
          { key: "R", label: "Leyendo" },
          { key: "N", label: "Por leer" }
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-3 justify-center items-center">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar por título o autor..."
        />
        
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

      <div className="flex justify-center items-center">
        <div className="text-sm text-neutral-600">
          {totalCount === 1 ? "1 libro encontrado" : `${totalCount} libros encontrados`}
          {searchQuery && <span className="ml-2 text-neutral-500">para "{searchQuery}"</span>}
          {totalPages > 1 && <span className="ml-2 text-neutral-500">(Página {currentPage} de {totalPages})</span>}
        </div>
        {searchQuery && (
          <Button variant="outline" size="sm" onClick={() => setSearchQuery("")} className="text-xs ml-4">
            Limpiar búsqueda
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="h-6 w-6 text-neutral-500">📚</div>
          </div>
          <h3 className="font-display font-semibold text-lg text-neutral-900 mb-2">No se encontraron libros</h3>
          <p className="text-neutral-500 mb-4">Intenta ajustar tus filtros de búsqueda</p>
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setStatusFilter("all");
          }}>Limpiar filtros</Button>
        </div>
      )}

      {totalPages > 1 && (
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

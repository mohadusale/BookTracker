import { useState, useCallback, useEffect } from 'react';
import { Button } from '../../../ui';
import { SearchInput } from '../../../ui';
import { ImageWithFallback } from '../../../ui';
import { InteractiveStarRating } from '../../../ui';
import { StatusFilter } from '../../../ui';
import { RatingFilter } from '../../../ui';
import { X, Check, Loader2 } from 'lucide-react';
import { useShelvesActions, useLibraryBooks } from '../../../../stores';
import { useDataRefresh } from '../../../../hooks/useDataRefresh';
import { useSearch } from '../../../../hooks/useSearch';
import { useFilteredAndSorted } from '../../../../hooks/useFilteredAndSorted';
import { useLibraryActions } from '../../../../stores';
import type { BookCardData } from '../../../../types/library';

interface AddBooksToShelfModalProps {
  isOpen: boolean;
  onClose: () => void;
  shelfId: number;
  shelfName: string;
  booksInShelf: number[];
  onBooksAdded?: () => void;
}

export function AddBooksToShelfModal({ 
  isOpen, 
  onClose, 
  shelfId, 
  shelfName,
  booksInShelf,
  onBooksAdded 
}: AddBooksToShelfModalProps) {
  const [selectedBooks, setSelectedBooks] = useState<Set<number>>(new Set());
  const [booksToRemove, setBooksToRemove] = useState<Set<number>>(new Set());
  const [isAdding, setIsAdding] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'C' | 'R' | 'N'>('all');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const { addBookToShelf, removeBookFromShelf } = useShelvesActions();
  const { fetchUserBooks } = useLibraryActions();
  const { refreshShelves } = useDataRefresh();
  
  // Obtener libros del store
  const books = useLibraryBooks();

  // Hook de búsqueda con debounce
  const { debouncedQuery, setQuery } = useSearch('', 300);

  // Cargar libros si es necesario
  useEffect(() => {
    if (isOpen && books.length === 0) {
      fetchUserBooks(1);
    }
  }, [isOpen]);

  // Filtrado optimizado
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
    }
  );

  const handleToggleBook = useCallback((bookId: number) => {
    const isInShelf = booksInShelf.includes(bookId);
    
    if (isInShelf) {
      // Si está en la estantería, marcar para quitar
      setBooksToRemove(prev => {
        const newSet = new Set(prev);
        if (newSet.has(bookId)) {
          newSet.delete(bookId);
        } else {
          newSet.add(bookId);
        }
        return newSet;
      });
    } else {
      // Si no está, marcar para añadir
      setSelectedBooks(prev => {
        const newSet = new Set(prev);
        if (newSet.has(bookId)) {
          newSet.delete(bookId);
        } else {
          newSet.add(bookId);
        }
        return newSet;
      });
    }
  }, [booksInShelf]);

  const handleAddBooks = async () => {
    if (selectedBooks.size === 0 && booksToRemove.size === 0) return;

    try {
      setIsAdding(true);
      
      const promises: Promise<any>[] = [];
      
      // Añadir libros nuevos
      if (selectedBooks.size > 0) {
        const addPromises = Array.from(selectedBooks).map(bookId => 
          addBookToShelf(shelfId, bookId)
        );
        promises.push(...addPromises);
      }
      
      // Quitar libros existentes
      if (booksToRemove.size > 0) {
        const removePromises = Array.from(booksToRemove).map(bookId => 
          removeBookFromShelf(shelfId, bookId)
        );
        promises.push(...removePromises);
      }
      
      await Promise.all(promises);
      
      // Refrescar estanterías
      await refreshShelves(true);
      
      // Limpiar y cerrar
      setSelectedBooks(new Set());
      setBooksToRemove(new Set());
      setQuery("");
      
      if (onBooksAdded) {
        onBooksAdded();
      }
      
      onClose();
    } catch (error) {
      console.error('Error al modificar libros:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleClose = () => {
    if (!isAdding) {
      setSelectedBooks(new Set());
      setBooksToRemove(new Set());
      setQuery("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Fondo oscuro */}
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <div>
              <h2 className="font-display font-semibold text-lg text-neutral-900">
                Gestionar libros en "{shelfName}"
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                {selectedBooks.size > 0 || booksToRemove.size > 0 ? (
                  <span>
                    {selectedBooks.size > 0 && `${selectedBooks.size} ${selectedBooks.size === 1 ? 'libro' : 'libros'} para añadir`}
                    {selectedBooks.size > 0 && booksToRemove.size > 0 && ' • '}
                    {booksToRemove.size > 0 && `${booksToRemove.size} ${booksToRemove.size === 1 ? 'libro' : 'libros'} para quitar`}
                  </span>
                ) : (
                  'Selecciona libros para añadir o quitar de la estantería'
                )}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isAdding}
              className="text-neutral-500 hover:text-neutral-900"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Search y Filtros */}
          <div className="p-6 border-b border-neutral-200">
            <div className="flex flex-col lg:flex-row gap-3 justify-center items-center">
              <SearchInput
                value={debouncedQuery}
                onChange={setQuery}
                placeholder="Buscar por título o autor..."
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
              
              {statusFilter === "C" && (
                <RatingFilter
                  selectedRating={ratingFilter}
                  onRatingChange={setRatingFilter}
                />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-500">
                  {debouncedQuery ? 'No se encontraron libros' : 'No tienes libros en tu biblioteca'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {filteredBooks.map((book) => (
                  <SelectableBookCard
                    key={book.id}
                    book={book}
                    isSelected={selectedBooks.has(book.id)}
                    isInShelf={booksInShelf.includes(book.id)}
                    isMarkedForRemoval={booksToRemove.has(book.id)}
                    onToggle={handleToggleBook}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-200 flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isAdding}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddBooks}
              disabled={isAdding || (selectedBooks.size === 0 && booksToRemove.size === 0)}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
            >
              {isAdding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                (() => {
                  const totalChanges = selectedBooks.size + booksToRemove.size;
                  if (selectedBooks.size > 0 && booksToRemove.size > 0) {
                    return `Guardar cambios (${totalChanges})`;
                  } else if (selectedBooks.size > 0) {
                    return `Añadir (${selectedBooks.size})`;
                  } else if (booksToRemove.size > 0) {
                    return `Quitar (${booksToRemove.size})`;
                  } else {
                    return 'Guardar cambios';
                  }
                })()
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de tarjeta de libro seleccionable
interface SelectableBookCardProps {
  book: BookCardData;
  isSelected: boolean;
  isInShelf: boolean;
  isMarkedForRemoval: boolean;
  onToggle: (bookId: number) => void;
}

function SelectableBookCard({ book, isSelected, isInShelf, isMarkedForRemoval, onToggle }: SelectableBookCardProps) {
  const handleClick = () => {
    onToggle(book.id);
  };

  // Determinar estado visual
  const getVisualState = () => {
    if (isMarkedForRemoval) {
      return { borderColor: '#ef4444', opacity: 'opacity-75', cursor: 'cursor-pointer' };
    } else if (isSelected) {
      return { borderColor: '#3b82f6', opacity: 'opacity-100', cursor: 'cursor-pointer' };
    } else if (isInShelf) {
      return { borderColor: '#10b981', opacity: 'opacity-100', cursor: 'cursor-pointer' };
    } else {
      return { borderColor: 'transparent', opacity: 'opacity-100', cursor: 'cursor-pointer' };
    }
  };

  const visualState = getVisualState();

  return (
    <div 
      className={`relative group ${visualState.opacity} ${visualState.cursor} transition-all duration-200`}
      onClick={handleClick}
    >
      <div className="aspect-[2/3] bg-neutral-100 relative overflow-hidden rounded-lg border-2 transition-colors duration-200"
        style={{ borderColor: visualState.borderColor }}
      >
        <ImageWithFallback
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover"
        />
        
        {/* Estrellas para libros finalizados */}
        {book.status === 'C' && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
              <InteractiveStarRating 
                rating={book.rating} 
                size="sm" 
                showValue={false}
                bookStatus={book.status}
                onRatingChange={() => {}}
                bookId={book.id}
                disabled={true}
              />
            </div>
          </div>
        )}

        {/* Overlay de selección */}
        <div className={`absolute inset-0 transition-opacity duration-200 ${
          isMarkedForRemoval 
            ? 'bg-red-500/20 opacity-100'
            : isSelected 
              ? 'bg-blue-500/20 opacity-100'
              : isInShelf
                ? 'bg-green-500/20 opacity-100'
                : 'opacity-0 group-hover:opacity-100 bg-blue-500/20'
        }`} />

        {/* Círculo de selección */}
        <div className="absolute top-2 right-2">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            isMarkedForRemoval
              ? 'bg-red-500 border-red-500'
              : isSelected 
                ? 'bg-blue-500 border-blue-500' 
                : isInShelf
                  ? 'bg-green-500 border-green-500'
                  : 'bg-white border-neutral-300 group-hover:border-blue-400'
          }`}>
            {(isMarkedForRemoval || isSelected || isInShelf) && (
              <Check className="h-4 w-4 text-white" strokeWidth={3} />
            )}
          </div>
        </div>

        {/* Indicador de estado */}
        {isMarkedForRemoval && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-600/90 text-white text-xs py-1 px-2 text-center">
            ✗ Se quitará
          </div>
        )}
        {isInShelf && !isMarkedForRemoval && (
          <div className="absolute bottom-0 left-0 right-0 bg-green-600/90 text-white text-xs py-1 px-2 text-center">
            ✓ En estantería
          </div>
        )}
      </div>
      
      {/* Título del libro */}
      <div className="mt-1 text-xs text-neutral-700 truncate group-hover:text-neutral-900">
        {book.title}
      </div>
    </div>
  );
}

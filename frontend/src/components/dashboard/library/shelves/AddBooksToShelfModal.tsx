import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '../../../ui';
import { SearchInput } from '../../../ui';
import { ImageWithFallback } from '../../../ui';
import { InteractiveStarRating } from '../../../ui';
import { X, Check, Loader2 } from 'lucide-react';
import { useShelvesActions, useLibraryBooks, useLibraryActions } from '../../../../stores';
import { useAuthStore } from '../../../../stores';
import type { BookCardData } from '../../../../types/library';

interface AddBooksToShelfModalProps {
  isOpen: boolean;
  onClose: () => void;
  shelfId: number;
  shelfName: string;
  booksInShelf: number[]; // IDs de libros ya en la estantería
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooks, setSelectedBooks] = useState<Set<number>>(new Set());
  const [isAdding, setIsAdding] = useState(false);

  const { addBookToShelf } = useShelvesActions();
  const { fetchUserBooks } = useLibraryActions();
  const { isAuthenticated, tokens } = useAuthStore();
  
  // Obtener libros directamente del store (ya cargados)
  const books = useLibraryBooks();

  // Asegurar que los libros estén cargados cuando se abre el modal
  useEffect(() => {
    if (isOpen && isAuthenticated && tokens?.access && books.length === 0) {
      fetchUserBooks(1).catch(console.error);
    }
  }, [isOpen, isAuthenticated, tokens?.access, books.length, fetchUserBooks]);

  // Filtrar libros por búsqueda
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = !searchQuery || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [books, searchQuery]);

  const handleToggleBook = useCallback((bookId: number) => {
    setSelectedBooks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookId)) {
        newSet.delete(bookId);
      } else {
        newSet.add(bookId);
      }
      return newSet;
    });
  }, []);

  const handleAddBooks = async () => {
    if (selectedBooks.size === 0) return;

    try {
      setIsAdding(true);
      
      // Añadir libros uno por uno
      const promises = Array.from(selectedBooks).map(bookId => 
        addBookToShelf(shelfId, bookId)
      );
      
      await Promise.all(promises);
      
      // Limpiar selección y cerrar
      setSelectedBooks(new Set());
      setSearchQuery("");
      
      // Notificar que se añadieron libros
      if (onBooksAdded) {
        onBooksAdded();
      }
      
      onClose();
    } catch (error) {
      console.error('Error al añadir libros:', error);
      // TODO: Mostrar notificación de error
    } finally {
      setIsAdding(false);
    }
  };

  const handleClose = () => {
    if (!isAdding) {
      setSelectedBooks(new Set());
      setSearchQuery("");
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
                Añadir libros a "{shelfName}"
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                {selectedBooks.size > 0 
                  ? `${selectedBooks.size} ${selectedBooks.size === 1 ? 'libro seleccionado' : 'libros seleccionados'}`
                  : 'Selecciona los libros que quieres añadir'
                }
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

          {/* Search */}
          <div className="p-6 border-b border-neutral-200">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar por título o autor..."
            />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-500">
                  {searchQuery ? 'No se encontraron libros' : 'No tienes libros en tu biblioteca'}
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
              disabled={isAdding || selectedBooks.size === 0}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
            >
              {isAdding ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Añadiendo...
                </>
              ) : (
                `Añadir ${selectedBooks.size > 0 ? `(${selectedBooks.size})` : ''}`
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
  onToggle: (bookId: number) => void;
}

function SelectableBookCard({ book, isSelected, isInShelf, onToggle }: SelectableBookCardProps) {
  const handleClick = () => {
    if (!isInShelf) {
      onToggle(book.id);
    }
  };

  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-200 ${
        isInShelf ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={handleClick}
    >
      <div className="aspect-[2/3] bg-neutral-100 relative overflow-hidden rounded-lg border-2 transition-colors duration-200"
        style={{ 
          borderColor: isInShelf ? '#d1d5db' : isSelected ? '#3b82f6' : 'transparent' 
        }}
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
        <div className={`absolute inset-0 bg-blue-500/20 transition-opacity duration-200 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`} />

        {/* Círculo de selección */}
        <div className="absolute top-2 right-2">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            isInShelf 
              ? 'bg-green-500 border-green-500' 
              : isSelected 
                ? 'bg-blue-500 border-blue-500' 
                : 'bg-white border-neutral-300 group-hover:border-blue-400'
          }`}>
            {(isInShelf || isSelected) && (
              <Check className="h-4 w-4 text-white" strokeWidth={3} />
            )}
          </div>
        </div>

        {/* Indicador de "Ya en estantería" */}
        {isInShelf && (
          <div className="absolute bottom-0 left-0 right-0 bg-green-600/90 text-white text-xs py-1 px-2 text-center">
            ✓ En estantería
          </div>
        )}
      </div>
      
      {/* Título del libro (tooltip al hover) */}
      <div className="mt-1 text-xs text-neutral-700 truncate group-hover:text-neutral-900">
        {book.title}
      </div>
    </div>
  );
}

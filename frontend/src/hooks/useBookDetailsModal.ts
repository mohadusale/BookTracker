import { useState } from 'react';
import type { BookCardData } from '../types/library';
import { useLibraryBooks } from '../stores/libraryStore';

export function useBookDetailsModal() {
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const books = useLibraryBooks();

  const openModal = (book: BookCardData) => {
    setSelectedBookId(book.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedBookId(null);
  };

  // Obtener el libro actualizado del store
  const selectedBook = selectedBookId ? books.find(book => book.id === selectedBookId) || null : null;

  return {
    selectedBook,
    isOpen,
    openModal,
    closeModal
  };
}

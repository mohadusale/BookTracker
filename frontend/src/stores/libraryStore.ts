import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ReadingStatus, ReadingStatusWithBook, BookCardData } from '../types/library';
import { libraryService } from '../services/libraryService';
import { mapReadingStatusToBookCard } from '../utils/libraryUtils';
import { ERROR_MESSAGES } from '../config/constants';

// Estado inicial
const initialState = {
  books: [] as BookCardData[],
  readingStatuses: [] as ReadingStatusWithBook[],
  loading: false,
  error: null as string | null,
  lastFetched: null as number | null,
};

// Interface para las acciones del store
interface LibraryStore {
  // Estado
  books: BookCardData[];
  readingStatuses: ReadingStatusWithBook[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Acciones
  fetchUserBooks: () => Promise<void>;
  updateBookRating: (bookId: number, rating: number, readingStatusId: number) => Promise<void>;
  updateBookStatus: (bookId: number, status: 'N' | 'R' | 'C', readingStatusId: number) => Promise<void>;
  createReadingStatus: (bookId: number, status: 'N' | 'R' | 'C', rating?: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;
  
  // Selectores
  getUserBookStatus: (bookId: number) => ReadingStatusWithBook | undefined;
  getBooksByStatus: (status: 'N' | 'R' | 'C' | 'all') => BookCardData[];
  getBooksByRating: (minRating: number) => BookCardData[];
  searchBooks: (query: string) => BookCardData[];
}

// Crear el store
export const useLibraryStore = create<LibraryStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      ...initialState,

      // Fetch user books
      fetchUserBooks: async () => {
        try {
          set({ loading: true, error: null });
          
          const readingStatuses = await libraryService.getUserReadingStatuses();
          const mappedBooks = readingStatuses.map(mapReadingStatusToBookCard);
          
          set({
            books: mappedBooks,
            readingStatuses: readingStatuses,
            loading: false,
            error: null,
            lastFetched: Date.now(),
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;
          set({
            books: [],
            readingStatuses: [],
            loading: false,
            error: errorMessage,
            lastFetched: null,
          });
          throw error;
        }
      },

      // Update book rating
      updateBookRating: async (bookId: number, rating: number, readingStatusId: number) => {
        const originalBooks = get().books;
        const originalStatuses = get().readingStatuses;

        try {
          // Optimistic update
          set(state => ({
            books: state.books.map(book => 
              book.id === bookId 
                ? { 
                    ...book, 
                    rating: rating, 
                    status: 'C' as const // Automáticamente marcar como completado
                  }
                : book
            ),
            readingStatuses: state.readingStatuses.map(status =>
              status.id === readingStatusId
                ? {
                    ...status,
                    rating: rating,
                    status: 'C' as const,
                    finished_at: new Date().toISOString().split('T')[0],
                  }
                : status
            ),
          }));

          // Actualizar en el backend
          await libraryService.updateReadingStatus(readingStatusId, {
            rating: rating,
            status: 'C',
            finished_at: new Date().toISOString().split('T')[0],
          });

        } catch (error) {
          // Revertir cambios en caso de error
          set({
            books: originalBooks,
            readingStatuses: originalStatuses,
            error: 'Error al actualizar la calificación',
          });
          throw error;
        }
      },

      // Update book status
      updateBookStatus: async (bookId: number, status: 'N' | 'R' | 'C', readingStatusId: number) => {
        const originalBooks = get().books;
        const originalStatuses = get().readingStatuses;

        try {
          // Optimistic update
          const updateData: Partial<ReadingStatus> = { status };
          
          if (status === 'R' && !originalStatuses.find(s => s.id === readingStatusId)?.started_at) {
            updateData.started_at = new Date().toISOString().split('T')[0];
          }
          
          if (status === 'C' && !originalStatuses.find(s => s.id === readingStatusId)?.finished_at) {
            updateData.finished_at = new Date().toISOString().split('T')[0];
          }

          set(state => ({
            books: state.books.map(book => 
              book.id === bookId ? { ...book, status } : book
            ),
            readingStatuses: state.readingStatuses.map(readingStatus =>
              readingStatus.id === readingStatusId
                ? { ...readingStatus, ...updateData }
                : readingStatus
            ),
          }));

          // Actualizar en el backend
          await libraryService.updateReadingStatus(readingStatusId, updateData);

        } catch (error) {
          // Revertir cambios en caso de error
          set({
            books: originalBooks,
            readingStatuses: originalStatuses,
            error: 'Error al actualizar el estado de lectura',
          });
          throw error;
        }
      },

      // Create reading status
      createReadingStatus: async (bookId: number, status: 'N' | 'R' | 'C', rating?: number) => {
        try {
          const newStatus = await libraryService.createReadingStatus(bookId, status, rating);
          
          // Añadir al estado actual
          set(state => ({
            readingStatuses: [...state.readingStatuses, newStatus],
            books: [...state.books, mapReadingStatusToBookCard(newStatus as ReadingStatusWithBook)],
          }));

        } catch (error) {
          set({ error: 'Error al crear el estado de lectura' });
          throw error;
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Reset store
      reset: () => {
        set(initialState);
      },

      // Get user book status
      getUserBookStatus: (bookId: number) => {
        return get().readingStatuses.find(status => status.book === bookId);
      },

      // Get books by status
      getBooksByStatus: (status: 'N' | 'R' | 'C' | 'all') => {
        if (status === 'all') return get().books;
        return get().books.filter(book => book.status === status);
      },

      // Get books by rating
      getBooksByRating: (minRating: number) => {
        return get().books.filter(book => book.rating >= minRating);
      },

      // Search books
      searchBooks: (query: string) => {
        const lowerQuery = query.toLowerCase();
        return get().books.filter(book => 
          book.title.toLowerCase().includes(lowerQuery) ||
          book.author.toLowerCase().includes(lowerQuery)
        );
      },
    }),
    {
      name: 'library-storage', // nombre de la clave en localStorage
      partialize: (state) => ({
        books: state.books,
        readingStatuses: state.readingStatuses,
        lastFetched: state.lastFetched,
      }),
    }
  )
);

// Hooks optimizados con selectores específicos
export const useLibrary = () => {
  const store = useLibraryStore();
  return store;
};

// Selectores específicos para mejor rendimiento
export const useLibraryBooks = () => useLibraryStore(state => state.books);
export const useLibraryLoading = () => useLibraryStore(state => state.loading);
export const useLibraryError = () => useLibraryStore(state => state.error);
export const useReadingStatuses = () => useLibraryStore(state => state.readingStatuses);

// Selector para obtener el estado de un libro específico
export const useUserBookStatus = (bookId: number) => 
  useLibraryStore(state => state.getUserBookStatus(bookId));

// Selector para libros por estado
export const useBooksByStatus = (status: 'N' | 'R' | 'C' | 'all') =>
  useLibraryStore(state => state.getBooksByStatus(status));

// Selector memoizado para evitar bucles infinitos
export const useLibraryActions = () => {
  const fetchUserBooks = useLibraryStore(state => state.fetchUserBooks);
  const updateBookRating = useLibraryStore(state => state.updateBookRating);
  const updateBookStatus = useLibraryStore(state => state.updateBookStatus);
  const createReadingStatus = useLibraryStore(state => state.createReadingStatus);
  const clearError = useLibraryStore(state => state.clearError);
  const reset = useLibraryStore(state => state.reset);
  
  return {
    fetchUserBooks,
    updateBookRating,
    updateBookStatus,
    createReadingStatus,
    clearError,
    reset,
  };
};

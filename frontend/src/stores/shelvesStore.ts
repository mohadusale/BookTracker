import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  BookshelfWithBooks, 
  ShelfCardData, 
  CreateBookshelfData, 
  UpdateBookshelfData,
  ShelfBook 
} from '../types/shelves';
import { shelvesService } from '../services/shelvesService';
import { mapBookshelfToCardData, mapShelfBooksToShelfBook } from '../utils/shelvesUtils';
import { ERROR_MESSAGES } from '../config/constants';

// Estado inicial
const initialState = {
  shelves: [] as ShelfCardData[],
  selectedShelf: null as BookshelfWithBooks | null,
  shelfBooks: [] as ShelfBook[],
  loading: false,
  error: null as string | null,
  lastFetched: null as number | null,
};

// Interface para las acciones del store
interface ShelvesStore {
  // Estado
  shelves: ShelfCardData[];
  selectedShelf: BookshelfWithBooks | null;
  shelfBooks: ShelfBook[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Acciones CRUD
  fetchShelves: () => Promise<void>;
  createShelf: (data: CreateBookshelfData) => Promise<ShelfCardData>;
  updateShelf: (id: number, data: UpdateBookshelfData) => Promise<ShelfCardData>;
  deleteShelf: (id: number) => Promise<void>;
  
  // Acciones con libros
  addBookToShelf: (shelfId: number, bookId: number) => Promise<void>;
  removeBookFromShelf: (shelfId: number, bookId: number) => Promise<void>;
  fetchShelfBooks: (shelfId: number) => Promise<void>;
  
  // Utilidades
  clearError: () => void;
  reset: () => void;
  setSelectedShelf: (shelf: BookshelfWithBooks | null) => void;
  
  // Selectores
  getShelfById: (id: number) => ShelfCardData | undefined;
  getShelvesBySearch: (query: string) => ShelfCardData[];
  getShelvesBySort: (sortBy: 'name' | 'date') => ShelfCardData[];
}

// Crear el store
export const useShelvesStore = create<ShelvesStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      ...initialState,

      // Fetch shelves
      fetchShelves: async () => {
        try {
          set({ loading: true, error: null });
          
          const shelves = await shelvesService.getUserBookshelves();
          
          // Filtrar estanterías con IDs válidos y mapear
          const validShelves = shelves.filter(shelf => shelf.id && typeof shelf.id === 'number');
          const mappedShelves = validShelves.map(shelf => mapBookshelfToCardData(shelf));
          
          set({
            shelves: mappedShelves,
            loading: false,
            error: null,
            lastFetched: Date.now(),
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;
          set({
            shelves: [],
            loading: false,
            error: errorMessage,
            lastFetched: null,
          });
          throw error;
        }
      },

      // Create shelf
      createShelf: async (data: CreateBookshelfData) => {
        try {
          const newShelf = await shelvesService.createBookshelf(data);
          
          // Validar que la estantería tenga un ID válido
          if (!newShelf.id || typeof newShelf.id !== 'number') {
            throw new Error('La estantería creada no tiene un ID válido');
          }
          
          const shelfCardData = mapBookshelfToCardData(newShelf);
          
          set(state => ({
            shelves: [...state.shelves, shelfCardData],
          }));
          
          return shelfCardData;
        } catch (error) {
          set({ error: 'Error al crear la estantería' });
          throw error;
        }
      },

      // Update shelf
      updateShelf: async (id: number, data: UpdateBookshelfData) => {
        const originalShelves = get().shelves;

        try {
          const updatedShelf = await shelvesService.updateBookshelf(id, data);
          
          // Encontrar la estantería original para mantener el bookCount
          const originalShelf = originalShelves.find(shelf => shelf.id === id);
          const bookCount = originalShelf?.bookCount || 0;
          
          const shelfCardData = mapBookshelfToCardData(updatedShelf, bookCount);

          // Actualizar con datos reales del backend
          set(state => ({
            shelves: state.shelves.map(shelf =>
              shelf.id === id ? shelfCardData : shelf
            ),
          }));

          return shelfCardData;
        } catch (error) {
          // Revertir cambios en caso de error
          set({
            shelves: originalShelves,
            error: 'Error al actualizar la estantería',
          });
          throw error;
        }
      },

      // Delete shelf
      deleteShelf: async (id: number) => {
        const originalShelves = get().shelves;

        try {
          // Optimistic update
          set(state => ({
            shelves: state.shelves.filter(shelf => shelf.id !== id),
          }));

          await shelvesService.deleteBookshelf(id);
        } catch (error) {
          // Revertir cambios en caso de error
          set({
            shelves: originalShelves,
            error: 'Error al eliminar la estantería',
          });
          throw error;
        }
      },

      // Add book to shelf
      addBookToShelf: async (shelfId: number, bookId: number) => {
        try {
          await shelvesService.addBookToShelf(shelfId, bookId);
          
          // Actualizar contador de libros en la estantería
          set(state => ({
            shelves: state.shelves.map(shelf =>
              shelf.id === shelfId
                ? { ...shelf, bookCount: shelf.bookCount + 1 }
                : shelf
            ),
          }));

          // Si la estantería está seleccionada, actualizar sus libros
          const selectedShelf = get().selectedShelf;
          if (selectedShelf && selectedShelf.id === shelfId) {
            await get().fetchShelfBooks(shelfId);
          }
        } catch (error) {
          set({ error: 'Error al añadir libro a la estantería' });
          throw error;
        }
      },

      // Remove book from shelf
      removeBookFromShelf: async (shelfId: number, bookId: number) => {
        try {
          await shelvesService.removeBookFromShelf(shelfId, bookId);
          
          // Actualizar contador de libros en la estantería
          set(state => ({
            shelves: state.shelves.map(shelf =>
              shelf.id === shelfId
                ? { ...shelf, bookCount: Math.max(0, shelf.bookCount - 1) }
                : shelf
            ),
          }));

          // Actualizar libros de la estantería seleccionada
          set(state => ({
            shelfBooks: state.shelfBooks.filter(book => book.id !== bookId),
          }));

          // Si la estantería está seleccionada, actualizar sus libros
          const selectedShelf = get().selectedShelf;
          if (selectedShelf && selectedShelf.id === shelfId) {
            selectedShelf.book_count = Math.max(0, selectedShelf.book_count - 1);
            set({ selectedShelf });
          }
        } catch (error) {
          set({ error: 'Error al remover libro de la estantería' });
          throw error;
        }
      },

      // Fetch shelf books
      fetchShelfBooks: async (shelfId: number) => {
        try {
          set({ loading: true, error: null });
          
          const [shelfData, booksData] = await Promise.all([
            shelvesService.getBookshelf(shelfId),
            shelvesService.getShelfBooks(shelfId),
          ]);
          
          const mappedBooks = booksData.map(mapShelfBooksToShelfBook);
          
          set({
            selectedShelf: shelfData,
            shelfBooks: mappedBooks,
            loading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UNKNOWN_ERROR;
          set({
            selectedShelf: null,
            shelfBooks: [],
            loading: false,
            error: errorMessage,
          });
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

      // Set selected shelf
      setSelectedShelf: (shelf: BookshelfWithBooks | null) => {
        set({ selectedShelf: shelf });
      },

      // Get shelf by ID
      getShelfById: (id: number) => {
        return get().shelves.find(shelf => shelf.id === id);
      },

      // Get shelves by search
      getShelvesBySearch: (query: string) => {
        if (!query.trim()) return get().shelves;
        
        const lowerQuery = query.toLowerCase();
        return get().shelves.filter(shelf => 
          shelf.name.toLowerCase().includes(lowerQuery) ||
          shelf.description.toLowerCase().includes(lowerQuery)
        );
      },

      // Get shelves by sort
      getShelvesBySort: (sortBy: 'name' | 'date') => {
        return [...get().shelves].sort((a, b) => {
          switch (sortBy) {
            case 'name':
              return a.name.localeCompare(b.name);
            case 'date':
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            default:
              return 0;
          }
        });
      },
    }),
    {
      name: 'shelves-storage', // nombre de la clave en localStorage
      partialize: (state) => ({
        shelves: state.shelves,
        lastFetched: state.lastFetched,
      }),
    }
  )
);

// Hooks optimizados con selectores específicos
export const useShelves = () => {
  const store = useShelvesStore();
  return store;
};

// Selectores específicos para mejor rendimiento
export const useShelvesList = () => useShelvesStore(state => state.shelves);
export const useShelvesLoading = () => useShelvesStore(state => state.loading);
export const useShelvesError = () => useShelvesStore(state => state.error);
export const useSelectedShelf = () => useShelvesStore(state => state.selectedShelf);
export const useShelfBooks = () => useShelvesStore(state => state.shelfBooks);

// Selector para obtener una estantería específica
export const useShelfById = (id: number) =>
  useShelvesStore(state => state.getShelfById(id));

// Selector para estanterías filtradas
export const useShelvesBySearch = (query: string) =>
  useShelvesStore(state => state.getShelvesBySearch(query));

// Selector para estanterías ordenadas
export const useShelvesBySort = (sortBy: 'name' | 'date') =>
  useShelvesStore(state => state.getShelvesBySort(sortBy));

// Selector memoizado para evitar bucles infinitos
export const useShelvesActions = () => {
  const fetchShelves = useShelvesStore(state => state.fetchShelves);
  const createShelf = useShelvesStore(state => state.createShelf);
  const updateShelf = useShelvesStore(state => state.updateShelf);
  const deleteShelf = useShelvesStore(state => state.deleteShelf);
  const addBookToShelf = useShelvesStore(state => state.addBookToShelf);
  const removeBookFromShelf = useShelvesStore(state => state.removeBookFromShelf);
  const fetchShelfBooks = useShelvesStore(state => state.fetchShelfBooks);
  const clearError = useShelvesStore(state => state.clearError);
  const reset = useShelvesStore(state => state.reset);
  const setSelectedShelf = useShelvesStore(state => state.setSelectedShelf);
  
  return {
    fetchShelves,
    createShelf,
    updateShelf,
    deleteShelf,
    addBookToShelf,
    removeBookFromShelf,
    fetchShelfBooks,
    clearError,
    reset,
    setSelectedShelf,
  };
};

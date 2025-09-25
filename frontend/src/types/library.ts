// Tipos para la biblioteca de libros

export type ReadingStatusType = 'N' | 'R' | 'C';

export interface ReadingStatus {
  id: number;
  user: string;
  book: number;
  status: ReadingStatusType;
  rating: number | null;
  started_at: string | null;
  finished_at: string | null;
}

export interface Book {
  id: number;
  title: string;
  isbn: string;
  synopsis: string;
  publication_date: string | null;
  pages: number | null;
  cover_image_url: string;
  publisher: string;
  authors: string[];
  genres: string[];
}

export interface ReadingStatusWithBook extends ReadingStatus {
  book_detail: Book;
}

// Tipo para el componente BookCard (compatible con datos del backend)
export interface BookCardData {
  id: number;
  title: string;
  author: string; // Mapeado desde authors[0]
  cover: string; // Mapeado desde cover_image_url
  rating: number; // Mapeado desde rating (default 0 si es null)
  status: ReadingStatusType;
  progress: number; // Calculado basado en el estado
  readingStatusId: number; // ID del ReadingStatus para actualizaciones
  // Datos adicionales del libro (opcionales para compatibilidad)
  isbn?: string;
  synopsis?: string;
  publication_date?: string | null;
  pages?: number | null;
  publisher?: string;
  authors?: string[];
  genres?: string[];
}

// Tipo para el modal de detalles del libro (ahora es igual a BookCardData)
export type BookDetailsData = BookCardData;

// Estado de carga para la UI
export interface LibraryState {
  books: BookCardData[];
  loading: boolean;
  error: string | null;
}
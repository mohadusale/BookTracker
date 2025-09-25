// Tipos para estanterías (bookshelves)

export interface Bookshelf {
  id: number;
  name: string;
  description: string;
  created_at: string;
  user: number;
}

export interface BookshelfEntry {
  id: number;
  bookshelf: number;
  book: number;
  added_at: string;
}

export interface BookshelfWithBooks extends Bookshelf {
  entries: BookshelfEntry[];
  book_count: number;
}

// Tipo para el componente ShelfCard (compatible con datos del backend)
export interface ShelfCardData {
  id: number;
  name: string;
  description: string;
  bookCount: number;
  cover: string; // URL de la imagen de portada (del primer libro o placeholder)
  color: string; // Clase CSS para el color de fondo
  created_at: string;
}

// Tipo para libros en una estantería
export interface ShelfBook {
  id: number;
  title: string;
  author: string; // Mapeado desde authors[0]
  cover: string; // Mapeado desde cover_image_url
  added_at: string; // Fecha de adición a la estantería
}

// Estado de carga para la UI de estanterías
export interface ShelvesState {
  shelves: ShelfCardData[];
  loading: boolean;
  error: string | null;
  selectedShelf: BookshelfWithBooks | null;
}

// Tipos para operaciones CRUD
export interface CreateBookshelfData {
  name: string;
  description?: string;
}

export interface UpdateBookshelfData {
  name?: string;
  description?: string;
}

// Tipo para respuestas de la API
export interface BookshelfResponse {
  error: boolean;
  message: string;
  data?: Bookshelf | Bookshelf[];
}

export interface BookshelfEntryResponse {
  error: boolean;
  message: string;
  data?: {
    book_id: number;
    book_title: string;
    bookshelf_id: number;
    bookshelf_name: string;
  };
}

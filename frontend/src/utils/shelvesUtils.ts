import type { Bookshelf, BookshelfWithBooks, ShelfCardData, ShelfBook } from '../types/shelves';

// Colores predefinidos para las estanterías
const SHELF_COLORS = [
  'bg-purple-100',
  'bg-blue-100', 
  'bg-emerald-100',
  'bg-amber-100',
  'bg-rose-100',
  'bg-cyan-100',
  'bg-indigo-100',
  'bg-pink-100',
  'bg-teal-100',
  'bg-orange-100',
];

/**
 * Mapea los datos del backend a el formato esperado por ShelfCard
 */
export const mapBookshelfToCardData = (bookshelf: Bookshelf, bookCount: number = 0): ShelfCardData => {
  // Asegurar que tenemos un ID válido
  if (!bookshelf.id || typeof bookshelf.id !== 'number') {
    throw new Error('Bookshelf debe tener un ID válido');
  }

  // Generar color basado en el ID de la estantería
  const colorIndex = bookshelf.id % SHELF_COLORS.length;
  const color = SHELF_COLORS[colorIndex];
  
  // La cover se maneja directamente desde cover_image_url o será vacío para usar collage
  const cover = bookshelf.cover_image_url || '';

  return {
    id: bookshelf.id,
    name: bookshelf.name,
    description: bookshelf.description || '',
    bookCount: bookCount,
    cover: cover,
    color: color,
    created_at: bookshelf.created_at,
    visibility: bookshelf.visibility || 'public',
    auto_cover_books: bookshelf.auto_cover_books || [],
  };
};

/**
 * Mapea una estantería con libros a datos de tarjeta
 */
export const mapBookshelfWithBooksToCardData = (bookshelf: BookshelfWithBooks): ShelfCardData => {
  return mapBookshelfToCardData(bookshelf, bookshelf.book_count);
};

/**
 * Mapea libros de una estantería al formato esperado
 */
export const mapShelfBooksToShelfBook = (bookData: any): ShelfBook => {
  return {
    id: bookData.id,
    title: bookData.title,
    author: bookData.authors && bookData.authors.length > 0 ? bookData.authors[0] : 'Autor desconocido',
    cover: bookData.cover_image_url || '/images/default-book-cover.jpg',
    added_at: bookData.added_at || new Date().toISOString(),
  };
};

/**
 * Genera un color automático para una estantería basado en su nombre
 */
export const getShelfColor = (shelfName: string): string => {
  // Usar el hash del nombre para generar un índice consistente
  let hash = 0;
  for (let i = 0; i < shelfName.length; i++) {
    const char = shelfName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a 32bit integer
  }
  
  const index = Math.abs(hash) % SHELF_COLORS.length;
  return SHELF_COLORS[index];
};


/**
 * Calcula estadísticas de una estantería
 */
export const getShelfStats = (bookshelf: BookshelfWithBooks) => {
  return {
    totalBooks: bookshelf.book_count,
    recentBooks: bookshelf.entries.filter(entry => {
      const addedDate = new Date(entry.added_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return addedDate > thirtyDaysAgo;
    }).length,
    oldestBook: bookshelf.entries.length > 0 
      ? bookshelf.entries.reduce((oldest, current) => 
          new Date(current.added_at) < new Date(oldest.added_at) ? current : oldest
        ).added_at
      : null,
  };
};

/**
 * Ordena estanterías por diferentes criterios
 */
export const sortShelves = (shelves: ShelfCardData[], sortBy: 'name' | 'date' | 'books'): ShelfCardData[] => {
  return [...shelves].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'books':
        return b.bookCount - a.bookCount;
      default:
        return 0;
    }
  });
};

/**
 * Filtra estanterías por texto de búsqueda
 */
export const searchShelves = (shelves: ShelfCardData[], query: string): ShelfCardData[] => {
  if (!query.trim()) return shelves;
  
  const lowerQuery = query.toLowerCase();
  return shelves.filter(shelf => 
    shelf.name.toLowerCase().includes(lowerQuery) ||
    shelf.description.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Valida datos de creación de estantería
 */
export const validateShelfData = (data: { name: string; description?: string }): string[] => {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('El nombre de la estantería es obligatorio');
  }
  
  if (data.name && data.name.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres');
  }
  
  if (data.name && data.name.trim().length > 100) {
    errors.push('El nombre no puede tener más de 100 caracteres');
  }
  
  if (data.description && data.description.length > 500) {
    errors.push('La descripción no puede tener más de 500 caracteres');
  }
  
  return errors;
};

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

// Imágenes de portada por defecto para estanterías
const DEFAULT_SHELF_COVERS = [
  'https://images.unsplash.com/photo-1755541608494-5c02cf56e1f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBmYW50YXN5JTIwbm92ZWx8ZW58MXx8fHwxNzU4NjIwMzY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1749803386662-00aa5b10fc20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBzY2llbmNlJTIwZmljdGlvbnxlbnwxfHx8fDE3NTg3MTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1758279771969-2cc6bcac3fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBjbGFzc2ljJTIwbGl0ZXJhdHVyZXxlbnwxfHx8fDE3NTg2NDgyMDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1599394463169-bd0bdf8e247a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBteXN0ZXJ5JTIwdGhyaWxsZXJ8ZW58MXx8fDE3NTg3MTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
  
  // Generar imagen de portada basada en el ID
  const coverIndex = bookshelf.id % DEFAULT_SHELF_COVERS.length;
  const cover = DEFAULT_SHELF_COVERS[coverIndex];

  return {
    id: bookshelf.id,
    name: bookshelf.name,
    description: bookshelf.description || '',
    bookCount: bookCount,
    cover: cover,
    color: color,
    created_at: bookshelf.created_at,
    visibility: bookshelf.visibility || 'public',
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
 * Genera una imagen de portada automática para una estantería
 */
export const getShelfCover = (shelfName: string): string => {
  // Usar el hash del nombre para generar un índice consistente
  let hash = 0;
  for (let i = 0; i < shelfName.length; i++) {
    const char = shelfName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a 32bit integer
  }
  
  const index = Math.abs(hash) % DEFAULT_SHELF_COVERS.length;
  return DEFAULT_SHELF_COVERS[index];
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

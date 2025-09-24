import type { ReadingStatusWithBook, BookCardData } from '../types/library';

/**
 * Mapea los datos del backend a el formato esperado por BookCard
 */
export const mapReadingStatusToBookCard = (readingStatus: ReadingStatusWithBook): BookCardData => {
  const book = readingStatus.book_detail;
  
  // Verificar si tenemos datos del libro
  if (!book) {
    // Crear un objeto de libro temporal con datos básicos
    return {
      id: readingStatus.book || 0, // Usar el ID del libro si está disponible
      title: `Libro ${readingStatus.book || 'Desconocido'}`,
      author: 'Autor desconocido',
      cover: '/images/default-book-cover.jpg',
      rating: readingStatus.rating || 0,
      status: readingStatus.status,
      progress: readingStatus.status === 'C' ? 100 : readingStatus.status === 'R' ? 50 : 0,
      readingStatusId: readingStatus.id,
    };
  }
  
  // Calcular progreso basado en el estado
  let progress = 0;
  switch (readingStatus.status) {
    case 'N':
      progress = 0;
      break;
    case 'R':
      progress = 50; // Podríamos calcular esto basado en páginas leídas si tuviéramos esa info
      break;
    case 'C':
      progress = 100;
      break;
  }

  return {
    id: book.id,
    title: book.title,
    author: book.authors.length > 0 ? book.authors[0] : 'Autor desconocido',
    cover: book.cover_image_url || '/images/default-book-cover.jpg',
    rating: readingStatus.rating || 0,
    status: readingStatus.status,
    progress: progress,
    readingStatusId: readingStatus.id,
  };
};

/**
 * Obtiene el texto del estado en español
 */
export const getStatusText = (status: 'N' | 'R' | 'C'): string => {
  switch (status) {
    case 'N':
      return 'Por leer';
    case 'R':
      return 'Leyendo';
    case 'C':
      return 'Finalizado';
    default:
      return 'Desconocido';
  }
};

/**
 * Obtiene las clases CSS para el badge de estado
 */
export const getStatusBadgeClasses = (status: 'N' | 'R' | 'C'): string => {
  switch (status) {
    case 'N':
      return 'bg-gray-100 text-gray-600';
    case 'R':
      return 'bg-blue-100 text-blue-600';
    case 'C':
      return 'bg-green-100 text-green-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

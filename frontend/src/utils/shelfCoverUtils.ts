import type { AutoCoverBook } from '../types/shelves';

/**
 * Genera la URL de portada para una estantería basada en los libros
 */
export function generateShelfCoverUrl(
  coverImageUrl?: string,
  autoCoverBooks?: AutoCoverBook[]
): string {
  // Si hay una imagen personalizada, la usamos
  if (coverImageUrl) {
    return coverImageUrl;
  }

  // Si no hay libros, retornamos una imagen por defecto
  if (!autoCoverBooks || autoCoverBooks.length === 0) {
    return getDefaultShelfCover();
  }

  // Si hay 1 libro, usamos su portada
  if (autoCoverBooks.length === 1) {
    return autoCoverBooks[0].cover_image_url || getDefaultShelfCover();
  }

  // Si hay 2-3 libros, usamos el primero (más antiguo)
  if (autoCoverBooks.length <= 3) {
    return autoCoverBooks[0].cover_image_url || getDefaultShelfCover();
  }

  // Si hay 4+ libros, usamos el primero (más antiguo)
  return autoCoverBooks[0].cover_image_url || getDefaultShelfCover();
}

/**
 * Genera un collage de portadas para estanterías con 4+ libros
 */
export function generateShelfCollage(autoCoverBooks: AutoCoverBook[]): string[] {
  if (!autoCoverBooks || autoCoverBooks.length === 0) {
    return [getDefaultShelfCover()];
  }

  if (autoCoverBooks.length === 1) {
    return [autoCoverBooks[0].cover_image_url || getDefaultShelfCover()];
  }

  if (autoCoverBooks.length <= 3) {
    return [autoCoverBooks[0].cover_image_url || getDefaultShelfCover()];
  }

  // Para 4+ libros, retornamos las primeras 4 portadas
  return autoCoverBooks.slice(0, 4).map(book => 
    book.cover_image_url || getDefaultShelfCover()
  );
}

/**
 * Retorna la URL de la imagen por defecto para estanterías vacías
 */
export function getDefaultShelfCover(): string {
  // Usar una imagen de placeholder para estanterías vacías
  return 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop&crop=center';
}

/**
 * Determina si una estantería necesita collage (4+ libros)
 */
export function needsCollage(autoCoverBooks?: AutoCoverBook[]): boolean {
  return !!(autoCoverBooks && autoCoverBooks.length >= 4);
}

/**
 * Obtiene el texto de visibilidad en español
 */
export function getVisibilityText(visibility: 'public' | 'private'): string {
  return visibility === 'public' ? 'Estantería pública' : 'Estantería privada';
}

/**
 * Obtiene el color del indicador de visibilidad
 */
export function getVisibilityColor(visibility: 'public' | 'private'): string {
  return visibility === 'public' ? 'text-green-600' : 'text-orange-600';
}

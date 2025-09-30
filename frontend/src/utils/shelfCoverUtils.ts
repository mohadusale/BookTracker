/**
 * Obtiene el texto de visibilidad en español
 */
export function getVisibilityText(visibility: 'public' | 'private'): string {
  return visibility === 'public' ? 'Estantería pública' : 'Estantería privada';
}

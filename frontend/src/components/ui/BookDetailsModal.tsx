import { useEffect } from 'react';
import { X, BookOpen, Calendar, Hash, Building, FileText } from 'lucide-react';
import { Button } from './Button';
import { ImageWithFallback } from './ImageWithFallback';
import { InteractiveStarRating } from './InteractiveStarRating';
import type { BookCardData } from '../../types/library';

interface BookDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: BookCardData | null;
  onRatingChange?: (rating: number, bookId: number) => void;
}

export function BookDetailsModal({ isOpen, onClose, book, onRatingChange }: BookDetailsModalProps) {
  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !book) return null;

  const getStatusText = (status: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'N':
        return 'bg-blue-100 text-blue-800';
      case 'R':
        return 'bg-yellow-100 text-yellow-800';
      case 'C':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRatingChange = (rating: number) => {
    if (onRatingChange) {
      onRatingChange(rating, book.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fondo oscuro */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900">Detalles del libro</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-neutral-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Portada */}
            <div className="flex-shrink-0">
              <div className="w-48 h-72 mx-auto lg:mx-0 bg-neutral-100 rounded-lg overflow-hidden shadow-lg">
                <ImageWithFallback
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Información del libro */}
            <div className="flex-1 space-y-6">
              {/* Título y autor */}
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                  {book.title}
                </h1>
                <div className="text-lg text-neutral-600 mb-4">
                  {book.author}
                </div>
              </div>

              {/* Estado de lectura */}
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-neutral-700">Estado:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(book.status)}`}>
                    {getStatusText(book.status)}
                  </span>
                </div>
                
                {/* Calificación - solo si está finalizado */}
                {book.status === 'C' && (
                  <div className="flex items-center gap-2">
                    <InteractiveStarRating
                      rating={book.rating}
                      size="lg"
                      showValue={false}
                      bookStatus={book.status as 'N' | 'R' | 'C'}
                      onRatingChange={handleRatingChange}
                      bookId={book.id}
                      disabled={false}
                    />
                  </div>
                )}
              </div>

              {/* Información adicional */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Páginas */}
                <div className="flex items-center gap-2 text-neutral-600">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm">
                    {book.pages ? `${book.pages} páginas` : 'Páginas no disponibles'}
                  </span>
                </div>

                {/* ISBN */}
                <div className="flex items-center gap-2 text-neutral-600">
                  <Hash className="h-4 w-4" />
                  <span className="text-sm">
                    {book.isbn || 'ISBN no disponible'}
                  </span>
                </div>

                {/* Editorial */}
                <div className="flex items-center gap-2 text-neutral-600">
                  <Building className="h-4 w-4" />
                  <span className="text-sm">
                    {book.publisher || 'Editorial no disponible'}
                  </span>
                </div>

                {/* Fecha de publicación */}
                <div className="flex items-center gap-2 text-neutral-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    {book.publication_date 
                      ? new Date(book.publication_date).getFullYear().toString()
                      : 'Año no disponible'
                    }
                  </span>
                </div>
              </div>


              {/* Géneros */}
              {book.genres && book.genres.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium text-neutral-700">Géneros:</span>
                  <div className="flex flex-wrap gap-2">
                    {book.genres.map((genre, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Sinopsis - debajo de la portada, de izquierda a derecha */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium text-neutral-700">Sinopsis</span>
            </div>
            <p className="text-neutral-600 text-sm leading-relaxed">
              {book.synopsis || 'Sinopsis no disponible para este libro.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-neutral-200 bg-neutral-50">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}

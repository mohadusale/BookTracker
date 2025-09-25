import { useEffect } from 'react';
import { X } from 'lucide-react';
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


  const handleRatingChange = (rating: number) => {
    if (onRatingChange) {
      onRatingChange(rating, book.id);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Fondo oscuro - cubre toda la página */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal centrado */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl max-h-[95vh] overflow-hidden">
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header minimalista */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-200">
              <h2 className="text-lg font-medium text-neutral-800 tracking-wide">Detalles del libro</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-neutral-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Contenido principal */}
            <div className="overflow-y-auto max-h-[calc(95vh-80px)] p-6">
              {/* Layout: Portada izquierda, info derecha */}
              <div className="flex gap-6 mb-6">
                {/* Portada izquierda */}
                <div className="flex-shrink-0">
                  <div className="w-40 h-56 bg-neutral-100 rounded-lg overflow-hidden shadow-sm">
                    <ImageWithFallback
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Información derecha */}
                <div className="flex-1 space-y-4">
                  {/* Título y autor */}
                  <div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-1 leading-tight tracking-wide">
                      {book.title.toUpperCase()}
                    </h1>
                    <p className="text-base text-neutral-700 font-medium">
                      By {book.author}
                    </p>
                  </div>

                  {/* Estado de lectura */}
                  <div>
                    <p className="text-sm text-neutral-700 mb-2">
                      Reading Status: <span className={`font-semibold ${
                        book.status === 'N' ? 'text-blue-600' :
                        book.status === 'R' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {getStatusText(book.status).toUpperCase()}
                      </span>
                    </p>
                    
                    {/* Calificación - solo si está finalizado */}
                    {book.status === 'C' && (
                      <div className="mt-3">
                        <InteractiveStarRating
                          rating={book.rating}
                          size="md"
                          showValue={false}
                          bookStatus={book.status as 'N' | 'R' | 'C'}
                          onRatingChange={handleRatingChange}
                          bookId={book.id}
                          disabled={false}
                        />
                      </div>
                    )}
                  </div>

                  {/* Información técnica - formato compacto */}
                  <div className="space-y-1 text-sm text-neutral-700">
                    {book.publisher && (
                      <div className="flex">
                        <span className="font-medium w-20">Publisher:</span>
                        <span>{book.publisher}</span>
                      </div>
                    )}
                    {book.isbn && (
                      <div className="flex">
                        <span className="font-medium w-20">ISBN:</span>
                        <span className="font-mono text-xs">{book.isbn}</span>
                      </div>
                    )}
                    {book.pages && (
                      <div className="flex">
                        <span className="font-medium w-20">Pages:</span>
                        <span>{book.pages}</span>
                      </div>
                    )}
                    {book.publication_date && (
                      <div className="flex">
                        <span className="font-medium w-20">Year:</span>
                        <span>{new Date(book.publication_date).getFullYear()}</span>
                      </div>
                    )}
                  </div>

                  {/* Géneros */}
                  {book.genres && book.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {book.genres.map((genre, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full font-medium"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Sinopsis abajo */}
              <div className="border-t border-neutral-200 pt-5">
                <p className="text-neutral-700 text-sm leading-relaxed">
                  <span className="font-semibold">Synopsis:</span> {book.synopsis || 'Synopsis not available for this book.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

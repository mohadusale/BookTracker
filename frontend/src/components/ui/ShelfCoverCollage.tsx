import { memo } from 'react';
import { ImageWithFallback } from './ImageWithFallback';
import type { AutoCoverBook } from '../../types/shelves';

interface ShelfCoverCollageProps {
  books: AutoCoverBook[];
  coverImageUrl?: string;
  className?: string;
}

export const ShelfCoverCollage = memo(function ShelfCoverCollage({ 
  books, 
  coverImageUrl,
  className = "w-32 h-48" 
}: ShelfCoverCollageProps) {
  // Si hay una imagen personalizada, mostrarla
  if (coverImageUrl) {
    return (
      <div className={`${className} bg-neutral-100 rounded-lg shadow-md border border-neutral-200 overflow-hidden`}>
        <ImageWithFallback
          src={coverImageUrl}
          alt="Portada personalizada de la estantería"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className={`${className} bg-neutral-100 rounded-lg shadow-md border border-neutral-200 overflow-hidden flex items-center justify-center`}>
        <div className="text-neutral-400 text-center">
          <div className="text-2xl mb-1">📚</div>
          <div className="text-xs">Sin libros</div>
        </div>
      </div>
    );
  }

  if (books.length === 1) {
    return (
      <div className={`${className} bg-neutral-100 rounded-lg shadow-md border border-neutral-200 overflow-hidden`}>
        <ImageWithFallback
          src={books[0].cover_image_url}
          alt={books[0].title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (books.length <= 3) {
    return (
      <div className={`${className} bg-neutral-100 rounded-lg shadow-md border border-neutral-200 overflow-hidden`}>
        <ImageWithFallback
          src={books[0].cover_image_url}
          alt={books[0].title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  // Para 4+ libros, mostrar collage de 2x2
  return (
    <div className={`${className} bg-neutral-100 rounded-lg shadow-md border border-neutral-200 overflow-hidden grid grid-cols-2 gap-1`}>
      {books.slice(0, 4).map((book, index) => (
        <div key={book.id} className="relative">
          <ImageWithFallback
            src={book.cover_image_url}
            alt={book.title}
            className="w-full h-full object-cover"
          />
          {index === 3 && books.length > 4 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">+{books.length - 4}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

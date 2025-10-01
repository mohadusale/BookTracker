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
  // Si no hay libros, siempre mostrar el placeholder (independiente de si hay imagen personalizada)
  if (!books || books.length === 0) {
    return (
      <div className={`${className} bg-neutral-100 overflow-hidden flex items-center justify-center`}>
        <div className="text-neutral-400 text-center">
          <div className="text-2xl mb-1">📚</div>
          <div className="text-xs">Sin libros</div>
        </div>
      </div>
    );
  }

  // Si hay una imagen personalizada y hay libros, mostrarla
  if (coverImageUrl) {
    return (
      <div className={`${className} bg-neutral-100 overflow-hidden`}>
        <ImageWithFallback
          src={coverImageUrl}
          alt="Portada personalizada de la estantería"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (books.length === 1) {
    return (
      <div className={`${className} bg-neutral-100 overflow-hidden flex items-center justify-center p-1`}>
        <div className="w-full h-full max-w-[85%] max-h-[90%] relative">
          <ImageWithFallback
            src={books[0].cover_image_url}
            alt={books[0].title}
            className="w-full h-full object-contain shadow-sm"
          />
        </div>
      </div>
    );
  }

  if (books.length === 2) {
    return (
      <div className={`${className} bg-neutral-100 overflow-hidden grid grid-cols-2 gap-0.5`}>
        {books.map((book) => (
          <div key={book.id} className="relative">
            <ImageWithFallback
              src={book.cover_image_url}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 3) {
    return (
      <div className={`${className} bg-neutral-100 overflow-hidden grid grid-cols-2 gap-0.5`}>
        <div className="row-span-2">
          <ImageWithFallback
            src={books[0].cover_image_url}
            alt={books[0].title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative">
          <ImageWithFallback
            src={books[1].cover_image_url}
            alt={books[1].title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative">
          <ImageWithFallback
            src={books[2].cover_image_url}
            alt={books[2].title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  // Para 4+ libros, mostrar collage de 2x2 con gap más pequeño
  return (
    <div className={`${className} bg-neutral-100 overflow-hidden grid grid-cols-2 gap-0.5`}>
      {books.slice(0, 4).map((book, index) => (
        <div key={book.id} className="relative">
          <ImageWithFallback
            src={book.cover_image_url}
            alt={book.title}
            className="w-full h-full object-cover"
          />
          {index === 3 && books.length > 4 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">+{books.length - 4}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

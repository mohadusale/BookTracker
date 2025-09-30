import { memo } from 'react';
import { Card } from '../../ui';
import { Button } from '../../ui';
import { ImageWithFallback } from '../../ui';
import { InteractiveStarRating } from '../../ui';
import { Eye } from 'lucide-react';
import type { BookCardData } from '../../../types/library';

interface BookCardProps {
  book: BookCardData;
  onViewBook: (book: BookCardData) => void;
  onRatingChange?: (rating: number, bookId: number) => void;
  disableRating?: boolean;
}

export const BookCard = memo(({ 
  book, 
  onViewBook, 
  onRatingChange,
  disableRating = false 
}: BookCardProps) => {
  return (
    <Card className="group overflow-hidden bg-white hover:shadow-lg transition-all duration-200 border border-neutral-200 shadow-sm">
      <div className="relative">
        <div className="aspect-[2/3] bg-neutral-100 relative overflow-hidden">
          <ImageWithFallback
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover"
          />
          
          {book.status === 'C' && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                <InteractiveStarRating 
                  rating={book.rating} 
                  size="sm" 
                  showValue={false}
                  bookStatus={book.status}
                  onRatingChange={onRatingChange || (() => {})}
                  bookId={book.id}
                  disabled={disableRating}
                />
              </div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button 
              size="sm" 
              variant="secondary" 
              className="bg-white/95 hover:bg-white text-xs px-2 py-1"
              onClick={() => onViewBook(book)}
            >
              <Eye className="h-3 w-3 mr-1" />
              Ver
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
});

BookCard.displayName = 'BookCard';

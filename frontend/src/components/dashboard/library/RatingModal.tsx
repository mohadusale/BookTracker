import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui';
import { Button } from '../../ui';
import { StarRatingInput } from '../../ui';
import { X } from 'lucide-react';

interface RatingModalProps {
  bookTitle: string;
  bookAuthor: string;
  currentRating?: number;
  onSave: (rating: number) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function RatingModal({ 
  bookTitle, 
  bookAuthor, 
  currentRating = 0, 
  onSave, 
  onClose, 
  isOpen 
}: RatingModalProps) {
  const [rating, setRating] = useState(currentRating);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(rating);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Fondo oscuro */}
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <Card className="relative w-full max-w-md bg-white rounded-2xl shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="font-display font-bold text-lg text-neutral-900">
            Calificar Libro
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-neutral-500 hover:text-neutral-900"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="font-display font-semibold text-lg text-neutral-900 mb-1">
              {bookTitle}
            </h3>
            <p className="text-neutral-500 text-sm">{bookAuthor}</p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="text-center">
              <p className="text-sm text-neutral-600 mb-3">
                ¿Qué calificación le das a este libro?
              </p>
              <StarRatingInput
                value={rating}
                onChange={setRating}
                size="lg"
                showValue={true}
              />
            </div>

            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
              >
                Guardar Calificación
              </Button>
            </div>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}

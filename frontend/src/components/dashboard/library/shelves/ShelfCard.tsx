import { useState } from 'react';
import { Card, CardContent } from '../../../ui';
import { Button } from '../../../ui';
import { BookOpen, Eye, MoreHorizontal, Trash2, Edit3 } from 'lucide-react';
import { useShelvesActions } from '../../../../stores';
import type { ShelfCardData } from '../../../../types/shelves';
import { DeleteShelfModal } from './DeleteShelfModal';

interface ShelfCardProps {
  shelf: ShelfCardData;
  onViewShelf?: (shelfId: number, shelfName: string) => void;
}

export function ShelfCard({ shelf, onViewShelf }: ShelfCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteShelf } = useShelvesActions();

  const handleViewShelf = () => {
    if (onViewShelf) {
      onViewShelf(shelf.id, shelf.name);
    }
    setShowActions(false);
  };

  const handleEditShelf = () => {
    // TODO: Implementar edición de estantería
    console.log('Editar estantería:', shelf.name);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setShowActions(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await deleteShelf(shelf.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error al eliminar estantería:', error);
      // TODO: Mostrar notificación de error
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };


  return (
    <Card className="group overflow-hidden bg-white hover:shadow-lg transition-all duration-200 border border-neutral-200 shadow-sm">
      <div className="relative">
        <div className="aspect-[4/3] bg-neutral-100 relative overflow-hidden">
          <img
            src={shelf.cover}
            alt={shelf.name}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay con botón ver */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button 
              size="sm" 
              variant="secondary" 
              className="bg-white/95 hover:bg-white"
              onClick={handleViewShelf}
            >
              <Eye className="h-3 w-3 mr-1" />
              Ver estantería
            </Button>
          </div>

          {/* Botón de acciones */}
          <div className="absolute top-2 right-2">
            <Button
              size="sm"
              variant="ghost"
              className="bg-white/90 hover:bg-white text-neutral-600 hover:text-neutral-900"
              onClick={() => setShowActions(!showActions)}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>

            {/* Menú de acciones */}
            {showActions && (
              <div className="absolute top-8 right-0 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                <button
                  onClick={handleEditShelf}
                  className="w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center"
                >
                  <Edit3 className="h-3 w-3 mr-2" />
                  Editar
                </button>
                <button
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center disabled:opacity-50"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-display font-semibold text-base text-neutral-900 leading-tight">
            {shelf.name}
          </h3>
          <p className="text-sm text-neutral-500 line-clamp-2">
            {shelf.description || 'Sin descripción'}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-neutral-500">
            <BookOpen className="h-4 w-4" />
            <span>{shelf.bookCount} {shelf.bookCount === 1 ? 'libro' : 'libros'}</span>
          </div>
          <div className="text-xs text-neutral-400">
            {new Date(shelf.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>

      {/* Modal de confirmación de eliminación */}
      <DeleteShelfModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        shelfName={shelf.name}
        isDeleting={isDeleting}
      />

    </Card>
  );
}

import React from 'react';
import { Button } from '../../../ui';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteShelfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  shelfName: string;
  isDeleting?: boolean;
}

export function DeleteShelfModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  shelfName, 
  isDeleting = false 
}: DeleteShelfModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg text-neutral-900">
                Eliminar Estantería
              </h2>
              <p className="text-sm text-neutral-500">
                Esta acción no se puede deshacer
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="text-neutral-500 hover:text-neutral-900"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            <p className="text-neutral-700">
              ¿Estás seguro de que quieres eliminar la estantería{' '}
              <span className="font-semibold text-neutral-900">"{shelfName}"</span>?
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-red-800">
                    Advertencia
                  </p>
                  <p className="text-sm text-red-700">
                    Todos los libros de esta estantería serán removidos de ella, 
                    pero los libros en sí no se eliminarán de tu biblioteca.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Eliminando...
              </>
            ) : (
              'Eliminar Estantería'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Loader2, Trash2 } from 'lucide-react';
import { useShelvesActions } from '../../../../stores';
import { validateShelfData } from '../../../../utils/shelvesUtils';
import { ShelfBasicInfo, ShelfCoverUpload, ShelfFormErrors } from './forms';
import type { ShelfCardData } from '../../../../types/shelves';

interface ShelfFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  shelf?: ShelfCardData; // Solo requerido en modo edit
}

export function ShelfFormModal({ isOpen, onClose, mode, shelf }: ShelfFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'public' as 'public' | 'private',
    cover_image: null as File | null,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeCoverImage, setRemoveCoverImage] = useState(false);

  const { createShelf, updateShelf, fetchShelves } = useShelvesActions();

  // Cargar datos cuando se abre el modal (para modo edit)
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && shelf) {
        setFormData({
          name: shelf.name,
          description: shelf.description || '',
          visibility: shelf.visibility,
          cover_image: null,
        });
        setImagePreview(shelf.cover || null);
        setRemoveCoverImage(false);
      } else {
        // Modo create: limpiar formulario
        setFormData({ name: '', description: '', visibility: 'public', cover_image: null });
        setImagePreview(null);
        setRemoveCoverImage(false);
      }
      setErrors([]);
    }
  }, [isOpen, mode, shelf]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleVisibilityChange = (value: string) => {
    setFormData(prev => ({ ...prev, visibility: value as 'public' | 'private' }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setErrors(['Por favor selecciona un archivo de imagen válido.']);
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(['La imagen debe ser menor a 5MB.']);
        return;
      }

      setFormData(prev => ({ ...prev, cover_image: file }));
      setRemoveCoverImage(false);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      if (errors.length > 0) {
        setErrors([]);
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, cover_image: null }));
    setImagePreview(null);
    setRemoveCoverImage(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar datos
    const validationErrors = validateShelfData(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (mode === 'create') {
        await createShelf({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          visibility: formData.visibility,
          cover_image: formData.cover_image || undefined,
        });
      } else {
        // mode === 'edit'
        if (!shelf) {
          throw new Error('Shelf is required for edit mode');
        }
        await updateShelf(shelf.id, {
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          visibility: formData.visibility,
          cover_image: formData.cover_image || undefined,
          remove_cover_image: removeCoverImage,
        });
        
        // Refrescar la lista de estanterías para obtener datos actualizados
        await fetchShelves();
      }
      
      handleClose();
    } catch (error) {
      console.error(`Error al ${mode === 'create' ? 'crear' : 'actualizar'} estantería:`, error);
      setErrors([`Error al ${mode === 'create' ? 'crear' : 'actualizar'} la estantería. Intenta nuevamente.`]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: '', description: '', visibility: 'public', cover_image: null });
      setImagePreview(null);
      setErrors([]);
      setRemoveCoverImage(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  const isEdit = mode === 'edit';
  const title = isEdit ? 'Editar Estantería' : 'Crear Nueva Estantería';
  const submitText = isEdit ? 'Guardar Cambios' : 'Crear Estantería';
  const submittingText = isEdit ? 'Guardando...' : 'Creando...';

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Fondo oscuro */}
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="font-display font-semibold text-lg text-neutral-900">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-neutral-500 hover:text-neutral-900"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <ShelfFormErrors errors={errors} />

          {/* Layout horizontal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ShelfBasicInfo
              formData={formData}
              onInputChange={handleInputChange}
              onVisibilityChange={handleVisibilityChange}
              isSubmitting={isSubmitting}
            />

            <div className="space-y-4">
              <ShelfCoverUpload
                imagePreview={imagePreview}
                onImageChange={handleImageChange}
                onRemoveImage={handleRemoveImage}
                isSubmitting={isSubmitting}
              />
              
              {/* Botón para eliminar imagen actual (solo en modo edit) */}
              {isEdit && shelf?.cover && !removeCoverImage && !formData.cover_image && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveImage}
                  disabled={isSubmitting}
                  className="w-full text-red-600 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar imagen personalizada
                </Button>
              )}
              
              {removeCoverImage && (
                <p className="text-sm text-neutral-500 text-center">
                  La imagen personalizada será eliminada al guardar
                </p>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim()}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {submittingText}
                </>
              ) : (
                submitText
              )}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}

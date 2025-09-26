import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Loader2 } from 'lucide-react';
import { useShelvesActions } from '../../../../stores';
import { validateShelfData } from '../../../../utils/shelvesUtils';
import { ShelfBasicInfo, ShelfCoverUpload, ShelfFormErrors } from './forms';

interface CreateShelfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateShelfModal({ isOpen, onClose }: CreateShelfModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'public' as 'public' | 'private',
    cover_image: null as File | null,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { createShelf } = useShelvesActions();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleVisibilityChange = (value: string) => {
    setFormData(prev => ({ ...prev, visibility: value as 'public' | 'private' }));
    // Limpiar errores cuando el usuario cambie la visibilidad
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
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Limpiar errores
      if (errors.length > 0) {
        setErrors([]);
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, cover_image: null }));
    setImagePreview(null);
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
      await createShelf({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        visibility: formData.visibility,
        cover_image: formData.cover_image || undefined,
      });
      
      // Limpiar formulario y cerrar modal
      setFormData({ name: '', description: '', visibility: 'public', cover_image: null });
      setImagePreview(null);
      setErrors([]);
      onClose();
    } catch (error) {
      console.error('Error al crear estantería:', error);
      setErrors(['Error al crear la estantería. Intenta nuevamente.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: '', description: '', visibility: 'public', cover_image: null });
      setImagePreview(null);
      setErrors([]);
      onClose();
    }
  };

  if (!isOpen) return null;

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
            Crear Nueva Estantería
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

            <ShelfCoverUpload
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              onRemoveImage={handleRemoveImage}
              isSubmitting={isSubmitting}
            />
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
                  Creando...
                </>
              ) : (
                'Crear Estantería'
              )}
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}

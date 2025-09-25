import React, { useState } from 'react';
import { Button } from '../../../ui';
import { Input } from '../../../ui';
import { X, Loader2 } from 'lucide-react';
import { useShelvesActions } from '../../../../stores';
import { validateShelfData } from '../../../../utils/shelvesUtils';

interface CreateShelfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateShelfModal({ isOpen, onClose }: CreateShelfModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createShelf } = useShelvesActions();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors.length > 0) {
      setErrors([]);
    }
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
      });
      
      // Limpiar formulario y cerrar modal
      setFormData({ name: '', description: '' });
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
      setFormData({ name: '', description: '' });
      setErrors([]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Errores */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <ul className="text-sm text-red-600 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
              Nombre de la estantería *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ej: Fantasía Épica"
              disabled={isSubmitting}
              className="w-full"
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe el tipo de libros que incluirás en esta estantería..."
              disabled={isSubmitting}
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500"
            />
            <div className="text-xs text-neutral-500 mt-1">
              {formData.description.length}/500 caracteres
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
  );
}

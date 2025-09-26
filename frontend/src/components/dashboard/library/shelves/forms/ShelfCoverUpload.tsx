import { useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ShelfCoverUploadProps {
  imagePreview: string | null;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  isSubmitting: boolean;
}

export default function ShelfCoverUpload({ 
  imagePreview, 
  onImageChange, 
  onRemoveImage, 
  isSubmitting 
}: ShelfCoverUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-neutral-900 mb-4">Imagen de portada</h3>
      
      <div className="space-y-3">
        {/* Input de archivo oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
          disabled={isSubmitting}
        />
        
        {/* Botón para seleccionar imagen */}
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSubmitting}
          className="w-full h-32 border-2 border-dashed border-neutral-300 hover:border-primary-500 hover:bg-primary-50"
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-neutral-400" />
            <span className="text-sm text-neutral-600">
              {imagePreview ? 'Cambiar imagen' : 'Seleccionar imagen'}
            </span>
            <span className="text-xs text-neutral-500">JPG, PNG (máx. 5MB)</span>
          </div>
        </Button>

        {/* Preview de la imagen */}
        {imagePreview && (
          <div className="relative">
            <div className="w-full h-48 rounded-lg overflow-hidden border border-neutral-200">
              <img
                src={imagePreview}
                alt="Preview de la portada"
                className="w-full h-full object-cover"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRemoveImage}
              disabled={isSubmitting}
              className="absolute top-2 right-2 bg-white/90 hover:bg-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Información sobre portada automática */}
        {!imagePreview && (
          <div className="text-xs text-neutral-500 bg-neutral-50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <ImageIcon className="h-4 w-4 text-neutral-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-neutral-600 mb-1">Portada automática</p>
                <p>Si no seleccionas una imagen, la portada se generará automáticamente basada en los libros que agregues a la estantería.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

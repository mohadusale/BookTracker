import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';

interface ShelfBasicInfoProps {
  formData: {
    name: string;
    description: string;
    visibility: 'public' | 'private';
  };
  onInputChange: (field: string, value: string) => void;
  onVisibilityChange: (value: string) => void;
  isSubmitting: boolean;
}

export default function ShelfBasicInfo({ 
  formData, 
  onInputChange, 
  onVisibilityChange,
  isSubmitting 
}: ShelfBasicInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-neutral-900 mb-4">Información básica</h3>
      
      {/* Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
          Nombre de la estantería *
        </label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange('name', e.target.value)}
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
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onInputChange('description', e.target.value)}
          placeholder="Describe el tipo de libros que incluirás en esta estantería..."
          disabled={isSubmitting}
          rows={4}
          maxLength={500}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500"
        />
        <div className="text-xs text-neutral-500 mt-1">
          {formData.description.length}/500 caracteres
        </div>
      </div>

      {/* Visibilidad */}
      <div>
        <label htmlFor="visibility" className="block text-sm font-medium text-neutral-700 mb-1">
          Visibilidad
        </label>
        <Select 
          value={formData.visibility} 
          onValueChange={onVisibilityChange}
        >
          <SelectTrigger className="w-full" type="button">
            <SelectValue placeholder="Selecciona la visibilidad">
              {formData.visibility === 'public' ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Pública - Visible para todos
                </div>
              ) : formData.visibility === 'private' ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Privada - Solo para ti
                </div>
              ) : (
                'Selecciona la visibilidad'
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Pública - Visible para todos
              </div>
            </SelectItem>
            <SelectItem value="private">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Privada - Solo para ti
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

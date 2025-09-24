import React, { useState } from 'react';
import { Card, CardContent } from '../../ui';
import { Button } from '../../ui';
import { Archive, Plus, BookOpen, Eye, MoreHorizontal } from 'lucide-react';

// Datos de ejemplo para las estanterías
const sampleShelves = [
  {
    id: 1,
    name: "Fantasía Épica",
    description: "Mis libros favoritos de fantasía",
    bookCount: 12,
    cover: "https://images.unsplash.com/photo-1755541608494-5c02cf56e1f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBmYW50YXN5JTIwbm92ZWx8ZW58MXx8fHwxNzU4NjIwMzY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "bg-purple-100"
  },
  {
    id: 2,
    name: "Ciencia Ficción",
    description: "Clásicos y modernos de sci-fi",
    bookCount: 8,
    cover: "https://images.unsplash.com/photo-1749803386662-00aa5b10fc20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBzY2llbmNlJTIwZmljdGlvbnxlbnwxfHx8fDE3NTg3MTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "bg-blue-100"
  },
  {
    id: 3,
    name: "Literatura Clásica",
    description: "Obras maestras de la literatura",
    bookCount: 15,
    cover: "https://images.unsplash.com/photo-1758279771969-2cc6bcac3fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBjbGFzc2ljJTIwbGl0ZXJhdHVyZXxlbnwxfHx8fDE3NTg2NDgyMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "bg-amber-100"
  },
  {
    id: 4,
    name: "Por Leer",
    description: "Libros pendientes de lectura",
    bookCount: 23,
    cover: "https://images.unsplash.com/photo-1599394463169-bd0bdf8e247a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBteXN0ZXJ5JTIwdGhyaWxsZXJ8ZW58MXx8fDE3NTg3MTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "bg-emerald-100"
  }
];

export function ShelvesSection() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateShelf = () => {
    setShowCreateModal(true);
    // Aquí se abriría un modal para crear una nueva estantería
    console.log('Crear nueva estantería');
  };

  const ShelfCard = ({ shelf }: { shelf: typeof sampleShelves[0] }) => (
    <Card className="group overflow-hidden bg-white hover:shadow-md transition-all duration-200 border border-neutral-200">
      <div className="relative">
        <div className="aspect-[4/3] bg-neutral-100 relative overflow-hidden">
          <img
            src={shelf.cover}
            alt={shelf.name}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button size="sm" variant="secondary" className="bg-white/95 hover:bg-white">
              <Eye className="h-3 w-3 mr-1" />
              Ver estantería
            </Button>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-display font-semibold text-base text-neutral-900 leading-tight">
            {shelf.name}
          </h3>
          <p className="text-sm text-neutral-500 line-clamp-2">{shelf.description}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-neutral-500">
            <BookOpen className="h-4 w-4" />
            <span>{shelf.bookCount} libros</span>
          </div>
          <Button size="sm" variant="ghost" className="text-neutral-500 hover:text-neutral-900">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Botón Crear Estantería */}
      <div className="flex justify-end">
        <Button onClick={handleCreateShelf} className="bg-primary-500 hover:bg-primary-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Crear Estantería
        </Button>
      </div>

      {/* Grid de Estanterías */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sampleShelves.map((shelf) => (
          <ShelfCard key={shelf.id} shelf={shelf} />
        ))}
      </div>

      {sampleShelves.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Archive className="h-6 w-6 text-neutral-500" />
          </div>
          <h3 className="font-display font-semibold text-lg text-neutral-900 mb-2">No tienes estanterías</h3>
          <p className="text-neutral-500 mb-4">Crea tu primera estantería para organizar tus libros</p>
          <Button onClick={handleCreateShelf} className="bg-primary-500 hover:bg-primary-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Crear Estantería
          </Button>
        </div>
      )}
    </div>
  );
}

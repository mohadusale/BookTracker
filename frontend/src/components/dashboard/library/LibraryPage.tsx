import React, { useState } from 'react';
import { Card, CardContent } from '../../ui';
import { Button } from '../../ui';
import { Input } from '../../ui';
import { Badge } from '../../ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui';
import { ImageWithFallback } from '../../ui';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Star, 
  Calendar,
  BookOpen,
  Clock,
  CheckCircle,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '../../../utils/cn';

const books = [
  {
    id: 1,
    title: "El Nombre del Viento",
    author: "Patrick Rothfuss",
    cover: "https://images.unsplash.com/photo-1755541608494-5c02cf56e1f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBmYW50YXN5JTIwbm92ZWx8ZW58MXx8fHwxNzU4NjIwMzY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    genre: "Fantasía",
    pages: 662,
    rating: 4.5,
    status: "reading",
    progress: 65,
    publishedYear: 2007,
    description: "Una historia épica de magia, música y misterio en un mundo fantástico."
  },
  {
    id: 2,
    title: "Dune",
    author: "Frank Herbert",
    cover: "https://images.unsplash.com/photo-1749803386662-00aa5b10fc20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBzY2llbmNlJTIwZmljdGlvbnxlbnwxfHx8fDE3NTg3MTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    genre: "Ciencia Ficción",
    pages: 688,
    rating: 4.8,
    status: "completed",
    progress: 100,
    publishedYear: 1965,
    description: "Una obra maestra de la ciencia ficción sobre política, religión y ecología."
  },
  {
    id: 3,
    title: "El Hobbit",
    author: "J.R.R. Tolkien",
    cover: "https://images.unsplash.com/photo-1758279771969-2cc6bcac3fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBjbGFzc2ljJTIwbGl0ZXJhdHVyZXxlbnwxfHx8fDE3NTg2NDgyMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    genre: "Fantasía",
    pages: 310,
    rating: 4.7,
    status: "not_started",
    progress: 0,
    publishedYear: 1937,
    description: "La aventura que comenzó todo en la Tierra Media."
  },
  {
    id: 4,
    title: "Cien Años de Soledad",
    author: "Gabriel García Márquez",
    cover: "https://images.unsplash.com/photo-1599394463169-bd0bdf8e247a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBteXN0ZXJ5JTIwdGhyaWxsZXJ8ZW58MXx8fDE3NTg3MTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    genre: "Realismo Mágico",
    pages: 417,
    rating: 4.9,
    status: "completed",
    progress: 100,
    publishedYear: 1967,
    description: "Una saga familiar que abarca generaciones en el pueblo de Macondo."
  },
  {
    id: 5,
    title: "1984",
    author: "George Orwell",
    cover: "https://images.unsplash.com/photo-1758279771969-2cc6bcac3fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBjbGFzc2ljJTIwbGl0ZXJhdHVyZXxlbnwxfHx8fDE3NTg2NDgyMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    genre: "Distopía",
    pages: 328,
    rating: 4.6,
    status: "not_started",
    progress: 0,
    publishedYear: 1949,
    description: "Una novela distópica sobre el totalitarismo y la vigilancia masiva."
  },
  {
    id: 6,
    title: "El Quijote",
    author: "Miguel de Cervantes",
    cover: "https://images.unsplash.com/photo-1599394463169-bd0bdf8e247a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBteXN0ZXJ5JTIwdGhyaWxsZXJ8ZW58MXx8fDE3NTg3MTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    genre: "Clásico",
    pages: 1056,
    rating: 4.3,
    status: "reading",
    progress: 23,
    publishedYear: 1605,
    description: "La obra cumbre de la literatura española y universal."
  }
];

const statusConfig = {
  not_started: { icon: Clock, label: "No empezado", color: "bg-slate-100 text-slate-700" },
  reading: { icon: BookOpen, label: "Leyendo", color: "bg-blue-100 text-blue-700" },
  completed: { icon: CheckCircle, label: "Completado", color: "bg-emerald-100 text-emerald-700" }
};

const LibraryPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("title");

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const BookCard = ({ book }: { book: typeof books[0] }) => {
    const StatusIcon = statusConfig[book.status].icon;
    
    return (
      <Card className="group overflow-hidden bg-white hover:shadow-md transition-all duration-200 border border-neutral-200">
        <div className="relative">
          {/* Fixed aspect ratio container */}
          <div className="aspect-[2/3] bg-neutral-100 relative overflow-hidden">
            <ImageWithFallback
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover"
            />
            
            {/* Status overlay */}
            {book.status === 'reading' && book.progress > 0 && (
              <div className="absolute top-2 left-2">
                <div className="bg-white/95 backdrop-blur-sm rounded px-2 py-1">
                  <span className="text-xs font-semibold text-primary">{book.progress}%</span>
                </div>
              </div>
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Button size="sm" variant="secondary" className="bg-white/95 hover:bg-white">
                <Eye className="h-3 w-3 mr-1" />
                Ver detalles
              </Button>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-base text-neutral-900 leading-tight line-clamp-2 min-h-[2.5rem]">
              {book.title}
            </h3>
            <p className="text-sm text-neutral-500">{book.author}</p>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-neutral-900">{book.rating}</span>
              <span className="text-neutral-500">• {book.pages}p</span>
            </div>
            <Badge className={cn("text-xs", statusConfig[book.status].color)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[book.status].label}
            </Badge>
          </div>
          
          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed min-h-[2rem]">
            {book.description}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-neutral-900 mb-1">Mi Biblioteca</h1>
          <p className="text-neutral-500">Gestiona tu colección personal de {books.length} libros</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-neutral-100 rounded-lg p-0.5">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={cn(
                "h-8 px-3",
                viewMode === "grid" 
                  ? "bg-white shadow-sm text-neutral-900" 
                  : "text-neutral-500 hover:text-neutral-900"
              )}
            >
              <Grid3X3 className="h-3 w-3" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={cn(
                "h-8 px-3",
                viewMode === "list" 
                  ? "bg-white shadow-sm text-neutral-900" 
                  : "text-neutral-500 hover:text-neutral-900"
              )}
            >
              <List className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white border-neutral-200">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Buscar por título, autor o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 border-neutral-200"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-40 h-10 border-neutral-200">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los géneros</SelectItem>
                  <SelectItem value="Fantasía">Fantasía</SelectItem>
                  <SelectItem value="Ciencia Ficción">Ciencia Ficción</SelectItem>
                  <SelectItem value="Realismo Mágico">Realismo Mágico</SelectItem>
                  <SelectItem value="Distopía">Distopía</SelectItem>
                  <SelectItem value="Clásico">Clásico</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 h-10 border-neutral-200">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Título</SelectItem>
                  <SelectItem value="author">Autor</SelectItem>
                  <SelectItem value="rating">Calificación</SelectItem>
                  <SelectItem value="year">Año</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      <div className={cn(
        "grid gap-4",
        viewMode === "grid" 
          ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" 
          : "grid-cols-1"
      )}>
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-6 w-6 text-neutral-500" />
          </div>
          <h3 className="font-display font-semibold text-lg text-neutral-900 mb-2">No se encontraron libros</h3>
          <p className="text-neutral-500 mb-4">Intenta ajustar tus filtros de búsqueda</p>
          <Button variant="outline" onClick={() => {setSearchQuery(""); setSelectedGenre("all");}}>
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
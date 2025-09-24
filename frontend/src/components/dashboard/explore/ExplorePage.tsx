import React, { useState } from 'react';
import { Card, CardContent } from '../../ui';
import { Button } from '../../ui';
import { Input } from '../../ui';
import { Badge } from '../../ui';
import { ImageWithFallback } from '../../ui';
import { 
  Search, 
  TrendingUp, 
  Star, 
  Sparkles, 
  BookOpen,
  Users,
  Filter,
  Plus
} from 'lucide-react';

const featuredBooks = [
  {
    id: 1,
    title: "El Nombre del Viento",
    author: "Patrick Rothfuss",
    cover: "https://images.unsplash.com/photo-1755541608494-5c02cf56e1f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBmYW50YXN5JTIwbm92ZWx8ZW58MXx8fHwxNzU4NjIwMzY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    reviews: 1247,
    genre: "Fantasía Épica",
    description: "La historia de Kvothe, un héroe legendario cuyas aventuras han sido distorsionadas por el mito.",
    trending: true,
    newRelease: false
  },
  {
    id: 2,
    title: "Project Hail Mary",
    author: "Andy Weir",
    cover: "https://images.unsplash.com/photo-1749803386662-00aa5b10fc20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBzY2llbmNlJTIwZmljdGlvbnxlbnwxfHx8fDE3NTg3MTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    reviews: 2156,
    genre: "Ciencia Ficción",
    description: "Un científico despierta solo en una nave espacial sin recordar cómo llegó allí.",
    trending: false,
    newRelease: true
  },
  {
    id: 3,
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    cover: "https://images.unsplash.com/photo-1758279771969-2cc6bcac3fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBjbGFzc2ljJTIwbGl0ZXJhdHVyZXxlbnwxfHx8fDE3NTg2NDgyMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    reviews: 892,
    genre: "Literatura Contemporánea",
    description: "Una historia conmovedora contada desde la perspectiva de una amiga artificial.",
    trending: true,
    newRelease: false
  },
  {
    id: 4,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    cover: "https://images.unsplash.com/photo-1599394463169-bd0bdf8e247a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBteXN0ZXJ5JTIwdGhyaWxsZXJ8ZW58MXx8fDE3NTg3MTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.4,
    reviews: 1532,
    genre: "Thriller Psicológico",
    description: "Un psicoterapeuta está obsesionado con tratar a una mujer que se niega a hablar.",
    trending: false,
    newRelease: false
  }
];

const trendingAuthors = [
  { name: "Brandon Sanderson", books: 23, followers: 15420, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { name: "N.K. Jemisin", books: 12, followers: 8932, avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" },
  { name: "Andy Weir", books: 8, followers: 12567, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" }
];

const categories = [
  { name: "Fantasía", count: 2847, icon: "📚" },
  { name: "Ciencia Ficción", count: 1923, icon: "🚀" },
  { name: "Misterio", count: 1456, icon: "🔍" },
  { name: "Romance", count: 3241, icon: "💭" },
  { name: "Thriller", count: 1234, icon: "⚡" },
  { name: "Historia", count: 892, icon: "📜" }
];

const ExplorePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-neutral-100 rounded-full px-3 py-1 mb-4">
          <Sparkles className="h-4 w-4 text-primary-500" />
          <span className="text-sm font-medium text-neutral-900">Descubre tu próxima gran lectura</span>
        </div>
        <h1 className="font-display font-bold text-3xl text-neutral-900">
          Explorar & Descubrir
        </h1>
        <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
          Encuentra libros increíbles recomendados por la comunidad
        </p>
      </div>

      {/* Search */}
      <Card className="bg-white border-neutral-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Buscar libros, autores, géneros..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base border-neutral-200"
              />
            </div>
            <div className="flex gap-3">
              <Button size="lg" className="bg-primary-500 hover:bg-primary-600 text-white">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Button variant="outline" size="lg" className="border-neutral-200">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Books */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-neutral-900">Libros Destacados</h2>
          <Button variant="ghost" className="text-neutral-500 hover:text-neutral-900">
            Ver todos
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredBooks.map((book) => (
            <Card key={book.id} className="group overflow-hidden bg-white hover:shadow-md transition-all duration-200 border border-neutral-200">
              <div className="relative">
                <div className="aspect-[2/3] bg-neutral-100 relative overflow-hidden">
                  <ImageWithFallback
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Status badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {book.trending && (
                      <Badge className="bg-red-500 text-white border-0 text-xs font-semibold">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    {book.newRelease && (
                      <Badge className="bg-emerald-500 text-white border-0 text-xs font-semibold">
                        Nuevo
                      </Badge>
                    )}
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button size="sm" variant="secondary" className="bg-white/95 hover:bg-white">
                      <Plus className="h-3 w-3 mr-1" />
                      Añadir
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
                  <Badge variant="secondary" className="bg-neutral-100 text-neutral-500 text-xs">
                    {book.genre}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-neutral-900">{book.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-neutral-500">
                    <Users className="h-3 w-3" />
                    <span>{book.reviews}</span>
                  </div>
                </div>
                
                <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 min-h-[2rem]">
                  {book.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-4">
        <h2 className="font-display font-bold text-xl text-neutral-900">Explorar por Categoría</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((category) => (
            <Card key={category.name} className="group cursor-pointer overflow-hidden border border-neutral-200 hover:shadow-md transition-all duration-200">
              <CardContent className="p-4 text-center space-y-2">
                <div className="text-2xl">{category.icon}</div>
                <div>
                  <h3 className="font-semibold text-sm text-neutral-900">{category.name}</h3>
                  <p className="text-xs text-neutral-500">{category.count} libros</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trending Authors */}
      <section className="space-y-4">
        <h2 className="font-display font-bold text-xl text-neutral-900">Autores Populares</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trendingAuthors.map((author) => (
            <Card key={author.name} className="group cursor-pointer overflow-hidden border border-neutral-200 hover:shadow-md transition-all duration-200">
              <CardContent className="p-6 text-center space-y-4">
                <div className="relative">
                  <ImageWithFallback
                    src={author.avatar}
                    alt={author.name}
                    className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-neutral-200"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                    <BookOpen className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-base text-neutral-900">{author.name}</h3>
                  <p className="text-sm text-neutral-500">{author.books} libros</p>
                  <p className="text-xs text-neutral-500">{author.followers.toLocaleString()} seguidores</p>
                </div>
                <Button size="sm" variant="outline" className="border-neutral-200">
                  Seguir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ExplorePage;
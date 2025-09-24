import { useState, useEffect } from 'react';
import { Card } from '../../ui';
import { Button } from '../../ui';
import { Input } from '../../ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui';
import { ImageWithFallback } from '../../ui';
import { InteractiveStarRating } from '../../ui';
import { Search, Eye, Loader2 } from 'lucide-react';
import { libraryService } from '../../../services/libraryService';
import type { BookCardData, LibraryState } from '../../../types/library';
import { mapReadingStatusToBookCard } from '../../../utils/libraryUtils';
import { useAuthStore } from '../../../stores/authStore';

export function BooksSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [statusFilter, setStatusFilter] = useState("C"); // Por defecto en Finalizados
  const [libraryState, setLibraryState] = useState<LibraryState>({
    books: [],
    loading: true,
    error: null,
  });

  // Obtener estado de autenticación
  const { isAuthenticated, tokens } = useAuthStore();


  const filteredBooks = libraryState.books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || book.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating; // Mayor a menor
        case 'rating-asc':
          return a.rating - b.rating; // Menor a mayor
        default:
          return 0;
      }
    });


  // Cargar datos del backend al montar el componente
  useEffect(() => {
    const loadUserBooks = async () => {
      // Verificar autenticación antes de cargar datos
      if (!isAuthenticated || !tokens?.access) {
        setLibraryState({
          books: [],
          loading: false,
          error: 'No estás autenticado. Por favor, inicia sesión.',
        });
        return;
      }

      try {
        setLibraryState(prev => ({ ...prev, loading: true, error: null }));
        
        const readingStatuses = await libraryService.getUserReadingStatuses();
        const mappedBooks = readingStatuses.map(mapReadingStatusToBookCard);
        
        setLibraryState({
          books: mappedBooks,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error al cargar libros:', error);
        setLibraryState({
          books: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Error al cargar los libros',
        });
      }
    };

    loadUserBooks();
  }, [isAuthenticated, tokens?.access]);

  const handleRatingChange = async (rating: number, bookId: number) => {
    // Encontrar el libro en el estado actual
    const book = libraryState.books.find(b => b.id === bookId);
    if (!book) {
      console.error('Libro no encontrado');
      return;
    }

    // Guardar el estado original para poder revertir en caso de error
    const originalRating = book.rating;
    const originalStatus = book.status;

    try {
      // Actualizar optimistamente la UI
      setLibraryState(prev => ({
        ...prev,
        books: prev.books.map(b => 
          b.id === bookId 
            ? { 
                ...b, 
                rating: rating, 
                status: 'C' // Automáticamente marcar como completado
              }
            : b
        ),
      }));

      // Actualizar en el backend
      await libraryService.updateReadingStatus(book.readingStatusId, {
        rating: rating,
        status: 'C',
        finished_at: new Date().toISOString().split('T')[0], // Fecha actual
      });

    } catch (error) {
      console.error('Error al actualizar calificación:', error);
      // Revertir cambios en caso de error
      setLibraryState(prev => ({
        ...prev,
        books: prev.books.map(b => 
          b.id === bookId 
            ? { 
                ...b, 
                rating: originalRating, // Revertir rating
                status: originalStatus, // Revertir status
              }
            : b
        ),
      }));
      
      // Mostrar error al usuario
      setLibraryState(prev => ({
        ...prev,
        error: 'Error al actualizar la calificación',
      }));
    }
  };

  const BookCard = ({ book }: { book: BookCardData }) => (
    <Card className="group overflow-hidden bg-white hover:shadow-lg transition-all duration-200 border border-neutral-200 shadow-sm hover:shadow-md">
      <div className="relative">
        <div className="aspect-[2/3] bg-neutral-100 relative overflow-hidden">
          <ImageWithFallback
            src={book.cover}
            alt={book.title}
            className="w-full h-full object-cover"
          />
          
          {/* Estrellas flotantes sobre la imagen - solo para libros completados */}
          {book.status === 'C' && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                <InteractiveStarRating 
                  rating={book.rating} 
                  size="sm" 
                  showValue={false}
                  bookStatus={book.status as 'N' | 'R' | 'C'}
                  onRatingChange={handleRatingChange}
                  bookId={book.id}
                  disabled={true}
                />
              </div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button size="sm" variant="secondary" className="bg-white/95 hover:bg-white text-xs px-2 py-1">
              <Eye className="h-3 w-3 mr-1" />
              Ver
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  // Mostrar estado de carga
  if (libraryState.loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary-500" />
          <p className="text-neutral-600">Cargando tu biblioteca...</p>
        </div>
      </div>
    );
  }

  // Mostrar error
  if (libraryState.error) {
    const isAuthError = libraryState.error.includes('autenticado') || libraryState.error.includes('token');
    
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Search className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="font-display font-semibold text-lg text-neutral-900 mb-2">
          {isAuthError ? 'Sesión expirada' : 'Error al cargar la biblioteca'}
        </h3>
        <p className="text-neutral-500 mb-4">{libraryState.error}</p>
        <div className="flex gap-2 justify-center">
          {isAuthError ? (
            <Button 
              onClick={() => {
                useAuthStore.getState().logout();
                window.location.href = '/login';
              }}
            >
              Ir al Login
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Reintentar
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Botones de estado */}
      <div className="flex items-center justify-center">
        <div className="flex bg-neutral-100 rounded-xl p-1 w-full max-w-md shadow-sm hover:shadow-md transition-shadow duration-200">
          <button
            onClick={() => setStatusFilter("C")}
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm flex-1 ${
              statusFilter === "C"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-white/50"
            }`}
          >
            Finalizados
          </button>
          <button
            onClick={() => setStatusFilter("R")}
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm flex-1 ${
              statusFilter === "R"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-white/50"
            }`}
          >
            Leyendo
          </button>
          <button
            onClick={() => setStatusFilter("N")}
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm flex-1 ${
              statusFilter === "N"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-white/50"
            }`}
          >
            Por leer
          </button>
        </div>
      </div>

      {/* Filtros - Solo para Finalizados */}
      {statusFilter === "C" && (
        <div className="flex flex-col lg:flex-row gap-3 justify-center items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="Buscar por título o autor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            />
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 h-10 border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <SelectValue placeholder="Ordenar por">
                {sortBy === 'rating' && 'Calificación ↓'}
                {sortBy === 'rating-asc' && 'Calificación ↑'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Calificación ↓</SelectItem>
              <SelectItem value="rating-asc">Calificación ↑</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Filtros - Para Leyendo y Por leer */}
      {(statusFilter === "R" || statusFilter === "N") && (
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="Buscar por título o autor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border-neutral-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            />
          </div>
        </div>
      )}

      {/* Información */}
      <div className="flex justify-center items-center">
        <div className="text-sm text-neutral-600">
          {filteredBooks.length === 1 
            ? "1 libro encontrado" 
            : `${filteredBooks.length} libros encontrados`
          }
          {searchQuery && (
            <span className="ml-2 text-neutral-500">
              para "{searchQuery}"
            </span>
          )}
        </div>
        {searchQuery && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSearchQuery("")}
            className="text-xs ml-4"
          >
            Limpiar búsqueda
          </Button>
        )}
      </div>

             {/* Grid de Libros */}
             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Search className="h-6 w-6 text-neutral-500" />
          </div>
          <h3 className="font-display font-semibold text-lg text-neutral-900 mb-2">No se encontraron libros</h3>
          <p className="text-neutral-500 mb-4">Intenta ajustar tus filtros de búsqueda</p>
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setStatusFilter("all");
          }}>
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
}

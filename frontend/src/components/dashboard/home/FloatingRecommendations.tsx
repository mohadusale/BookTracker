import { Card, CardContent, CardHeader, CardTitle } from '../../ui';
import { Button } from '../../ui';
import { ImageWithFallback } from '../../ui';
import { StarRating } from '../../ui';
import { Heart, Plus } from 'lucide-react';

const recommendations = [
  {
    id: 1,
    title: "El Señor de los Anillos",
    author: "J.R.R. Tolkien",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBmYW50YXN5JTIwdG9sa2llbnxlbnwxfHx8fDE3NTg2MjAzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    reason: "Basado en tu amor por la fantasía épica"
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    cover: "https://images.unsplash.com/photo-1599394463169-bd0bdf8e247a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBteXN0ZXJ5JTIwdGhyaWxsZXJ8ZW58MXx8fDE3NTg3MTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    reason: "Clásico que deberías leer"
  },
  {
    id: 3,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBoaXN0b3J5JTIwbm9uZmljdGlvbnxlbnwxfHx8fDE3NTg3MTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    reason: "Perfecto para expandir tu mente"
  },
  {
    id: 4,
    title: "El Alquimista",
    author: "Paulo Coelho",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBwaGlsb3NvcGh5JTIwZmljdGlvbnxlbnwxfHx8fDE3NTg3MTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.5,
    reason: "Inspirador y reflexivo"
  },
  {
    id: 5,
    title: "Cien Años de Soledad",
    author: "Gabriel García Márquez",
    cover: "https://images.unsplash.com/photo-1599394463169-bd0bdf8e247a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBteXN0ZXJ5JTIwdGhyaWxsZXJ8ZW58MXx8fDE3NTg3MTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    reason: "Obra maestra de la literatura latinoamericana"
  },
  {
    id: 6,
    title: "El Nombre del Viento",
    author: "Patrick Rothfuss",
    cover: "https://images.unsplash.com/photo-1755541608494-5c02cf56e1f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBmYW50YXN5JTIwbm92ZWx8ZW58MXx8fHwxNzU4NjIwMzY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    reason: "Fantasía épica con prosa excepcional"
  }
];

export function FloatingRecommendations() {
  return (
    <Card className="bg-white rounded-3xl shadow-lg border-0 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="font-display font-bold text-lg text-neutral-900">
          Recomendaciones para Ti
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {recommendations.map((book) => (
            <div key={book.id} className="flex gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 hover:scale-[1.01] transition-all duration-200">
              <ImageWithFallback
                src={book.cover}
                alt={book.title}
                className="w-12 h-16 object-cover rounded-lg shadow-sm"
              />
              <div className="flex-1 space-y-2">
                <div>
                  <h4 className="font-display font-semibold text-neutral-900 text-sm line-clamp-1">{book.title}</h4>
                  <p className="text-xs text-neutral-500">{book.author}</p>
                </div>
                
                       <div className="flex items-center gap-2">
                         <StarRating 
                           rating={book.rating} 
                           size="sm" 
                           showValue={true}
                         />
                         <span className="text-xs text-neutral-500">•</span>
                         <span className="text-xs text-neutral-500 line-clamp-1">{book.reason}</span>
                       </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="bg-primary-500 hover:bg-primary-600 text-white text-xs px-3 py-1">
                    <Plus className="h-3 w-3 mr-1" />
                    Añadir
                  </Button>
                  <Button size="sm" variant="ghost" className="text-neutral-500 hover:text-red-500 hover:bg-red-50 text-xs px-3 py-1">
                    <Heart className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button variant="ghost" className="text-neutral-500 hover:text-neutral-900 text-sm">
            Ver más recomendaciones
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

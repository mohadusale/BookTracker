import { Card, CardContent, CardHeader, CardTitle } from '../../ui';
import { Button } from '../../ui';
import { ImageWithFallback } from '../../ui';
import { StarRating } from '../../ui';
import { TrendingUp, Heart, Plus } from 'lucide-react';

const trendingBooks = [
  {
    id: 1,
    title: "El Juego del Calamar",
    author: "Hwang Dong-hyuk",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjB0aHJpbGxlcnxlbnwxfHx8fDE3NTg3MTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    trend: "🔥 #1 en tendencia"
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBzZWxmLWhlbHB8ZW58MXx8fHwxNzU4NzE0NzkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    trend: "📈 +15% esta semana"
  },
  {
    id: 3,
    title: "The Midnight Library",
    author: "Matt Haig",
    cover: "https://images.unsplash.com/photo-1599394463169-bd0bdf8e247a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBteXN0ZXJ5JTIwdGhyaWxsZXJ8ZW58MXx8fDE3NTg3MTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    trend: "⭐ Nuevo en la lista"
  }
];

export function FloatingTrendingBooks() {
  return (
    <Card className="bg-white rounded-3xl shadow-lg border-0 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="font-display font-bold text-lg text-neutral-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          Libros en Tendencia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {trendingBooks.map((book) => (
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
                <span className="text-xs text-orange-600 font-medium">{book.trend}</span>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" className="bg-primary-500 hover:bg-primary-600 text-white text-xs px-3 py-1 flex-1">
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
        
        <Button variant="ghost" className="w-full justify-center text-neutral-500 hover:text-neutral-900 text-sm">
          Ver más tendencias
        </Button>
      </CardContent>
    </Card>
  );
}

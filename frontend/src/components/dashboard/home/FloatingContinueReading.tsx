import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui';
import { Button } from '../../ui';
import { ImageWithFallback } from '../../ui';
import { Play, BookOpen } from 'lucide-react';

const continueReadingBooks = [
  {
    id: 1,
    title: "El Nombre del Viento",
    author: "Patrick Rothfuss",
    cover: "https://images.unsplash.com/photo-1755541608494-5c02cf56e1f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBmYW50YXN5JTIwbm92ZWx8ZW58MXx8fHwxNzU4NjIwMzY5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    progress: 45,
    currentPage: 298,
    totalPages: 662
  },
  {
    id: 2,
    title: "Cien Años de Soledad",
    author: "Gabriel García Márquez",
    cover: "https://images.unsplash.com/photo-1599394463169-bd0bdf8e247a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBteXN0ZXJ5JTIwdGhyaWxsZXJ8ZW58MXx8fDE3NTg3MTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    progress: 78,
    currentPage: 325,
    totalPages: 417
  }
];

export function FloatingContinueReading() {
  return (
    <Card className="bg-white rounded-3xl shadow-lg border-0 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="font-display font-bold text-lg text-foreground">
          Continuar Leyendo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {continueReadingBooks.map((book) => (
          <div key={book.id} className="flex gap-3 p-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors">
            <ImageWithFallback
              src={book.cover}
              alt={book.title}
              className="w-12 h-16 object-cover rounded-lg shadow-sm"
            />
            <div className="flex-1 space-y-2">
              <div>
                <h4 className="font-display font-semibold text-foreground">{book.title}</h4>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Página {book.currentPage} de {book.totalPages}</span>
                  <span className="font-semibold text-primary">{book.progress}%</span>
                </div>
                
                <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${book.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                <Play className="h-3 w-3 mr-1" />
                Continuar
              </Button>
            </div>
          </div>
        ))}
        
        <Button variant="ghost" className="w-full justify-center text-muted-foreground hover:text-foreground">
          <BookOpen className="h-4 w-4 mr-2" />
          Ver todos los libros
        </Button>
      </CardContent>
    </Card>
  );
}

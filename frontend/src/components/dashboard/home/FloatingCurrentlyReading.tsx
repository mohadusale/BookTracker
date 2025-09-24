import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui';
import { Button } from '../../ui';
import { ImageWithFallback } from '../../ui';
import { CheckCircle } from 'lucide-react';

export function FloatingCurrentlyReading() {
  const [progress, setProgress] = useState(60);
  const totalPages = 640;
  const currentPage = Math.round((progress / 100) * totalPages);

  return (
    <Card className="bg-white rounded-3xl shadow-lg border-0 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="font-display font-bold text-lg text-neutral-900">
          Actualmente Leyendo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1749803386662-00aa5b10fc20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjBzY2llbmNlJTIwZmljdGlvbnxlbnwxfHx8fDE3NTg3MTQ3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Dune"
              className="w-20 h-28 object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-display font-bold text-xl text-neutral-900">Dune</h3>
            <p className="text-neutral-500">Frank Herbert</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-500">Página {currentPage} de {totalPages}</span>
            <span className="font-bold text-primary-500">{progress}%</span>
          </div>
          
          <div className="relative">
            <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar como terminado
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import { BookOpen, Quote, Star, Library } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function LeftColumn() {
  return (
    <div className="relative h-full bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 p-6 flex flex-col justify-center overflow-hidden rounded-2xl">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 rounded-2xl">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1695846451114-e08de59a4500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYm9va3MlMjBsaWJyYXJ5JTIwYWVzdGhldGljfGVufDF8fHx8MTc1ODYyNDU0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Library background"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-6 left-6 text-amber-200/20 dark:text-amber-800/20">
        <BookOpen className="w-12 h-12" />
      </div>
      <div className="absolute top-6 right-6 text-amber-200/15 dark:text-amber-800/15">
        <Library className="w-8 h-8" />
      </div>
      <div className="absolute bottom-6 left-6 text-amber-200/15 dark:text-amber-800/15">
        <Star className="w-8 h-8" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full">
        <div className="mb-6 text-center">
          <h2 className="text-4xl font-serif mb-3 text-amber-900 dark:text-amber-100 tracking-tight">
            BookTracker
          </h2>
          <p className="text-lg text-amber-800 dark:text-amber-200 leading-relaxed font-light italic">
            Tu biblioteca personal en la palma de tu mano
          </p>
        </div>

        <div className="space-y-3 max-w-sm mx-auto">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-amber-200/50 dark:bg-amber-800/50 rounded-lg">
              <BookOpen className="w-4 h-4 text-amber-800 dark:text-amber-200" />
            </div>
            <div>
              <h3 className="text-amber-900 dark:text-amber-100 mb-1 font-semibold">Organiza tu biblioteca</h3>
              <p className="text-amber-700 dark:text-amber-300 text-xs leading-relaxed">
                Lleva un registro de todos los libros que has leído
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-amber-200/50 dark:bg-amber-800/50 rounded-lg">
              <Star className="w-4 h-4 text-amber-800 dark:text-amber-200" />
            </div>
            <div>
              <h3 className="text-amber-900 dark:text-amber-100 mb-1 font-semibold">Califica y reseña</h3>
              <p className="text-amber-700 dark:text-amber-300 text-xs leading-relaxed">
                Comparte tus opiniones y descubre recomendaciones
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-amber-100/50 dark:bg-amber-900/50 rounded-lg max-w-sm mx-auto">
          <Quote className="w-4 h-4 text-amber-600 dark:text-amber-400 mb-2" />
          <p className="text-amber-800 dark:text-amber-200 italic text-xs leading-relaxed font-light">
            "Un lector vive mil vidas antes de morir."
          </p>
          <p className="text-amber-600 dark:text-amber-400 text-xs mt-1 font-medium">
            — George R.R. Martin
          </p>
        </div>
      </div>
    </div>
  );
}
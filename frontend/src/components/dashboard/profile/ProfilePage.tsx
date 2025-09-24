import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui';
import { Button } from '../../ui';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui';
import { Badge } from '../../ui';
import { 
  Edit, 
  BookOpen, 
  Star, 
  TrendingUp,
  Award,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const userStats = {
    booksRead: 47,
    booksReading: 3,
    totalPages: 12500,
    averageRating: 4.2,
    readingStreak: 15,
    yearlyGoal: 50,
    favoriteGenres: ["Fantasía", "Ciencia Ficción", "Misterio"]
  };

  const recentBooks = [
    { title: "Dune", author: "Frank Herbert", rating: 5, completed: "2024-01-15" },
    { title: "El Hobbit", author: "J.R.R. Tolkien", rating: 4, completed: "2024-01-10" },
    { title: "1984", author: "George Orwell", rating: 4, completed: "2024-01-05" }
  ];

  const achievements = [
    { name: "Primer Libro", description: "Completaste tu primer libro", icon: BookOpen, earned: true },
    { name: "Lector Veloz", description: "Leíste 10 libros en un mes", icon: TrendingUp, earned: true },
    { name: "Crítico Literario", description: "Escribiste 50 reseñas", icon: Star, earned: false },
    { name: "Maratón de Lectura", description: "Leyó por 30 días seguidos", icon: Clock, earned: false }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-neutral-900 mb-1">Mi Perfil</h1>
          <p className="text-neutral-500">Gestiona tu información y estadísticas de lectura</p>
        </div>
        
        <Button variant="outline" className="border-neutral-200">
          <Edit className="h-4 w-4 mr-2" />
          Editar perfil
        </Button>
      </div>

      {/* Profile Info */}
      <Card className="bg-white rounded-2xl shadow-sm border border-border">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face" 
                  alt="Avatar de María González"
                />
                <AvatarFallback className="bg-primary-500 text-white text-2xl font-bold">M</AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="font-display font-bold text-2xl text-neutral-900">María González</h2>
                <p className="text-neutral-500">Lectora desde 2020</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-blue-100 text-blue-700">
                    <Award className="h-3 w-3 mr-1" />
                    Lectora Avanzada
                  </Badge>
                  <Badge className="bg-emerald-100 text-emerald-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verificada
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-900">{userStats.booksRead}</div>
                  <div className="text-sm text-neutral-500">Libros leídos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-900">{userStats.booksReading}</div>
                  <div className="text-sm text-neutral-500">Leyendo ahora</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-900">{userStats.totalPages.toLocaleString()}</div>
                  <div className="text-sm text-neutral-500">Páginas leídas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-neutral-900">{userStats.averageRating}</div>
                  <div className="text-sm text-neutral-500">Rating promedio</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reading Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white rounded-2xl shadow-sm border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="font-display font-bold text-lg text-neutral-900 flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary-500" />
              Meta Anual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-500">Progreso anual</span>
                <span className="font-semibold text-neutral-900">
                  {userStats.booksRead} / {userStats.yearlyGoal}
                </span>
              </div>
              <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${(userStats.booksRead / userStats.yearlyGoal) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">Racha actual: {userStats.readingStreak} días</span>
              <Badge className="bg-emerald-100 text-emerald-700">
                <Clock className="h-3 w-3 mr-1" />
                Activa
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-2xl shadow-sm border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="font-display font-bold text-lg text-neutral-900 flex items-center">
              <Star className="h-5 w-5 mr-2 text-primary-500" />
              Géneros Favoritos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userStats.favoriteGenres.map((genre, index) => (
              <div key={genre} className="flex items-center justify-between">
                <span className="text-sm text-neutral-900">{genre}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${(index + 1) * 25}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-neutral-500">{(index + 1) * 25}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Books */}
      <Card className="bg-white rounded-2xl shadow-sm border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="font-display font-bold text-lg text-neutral-900 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-primary-500" />
            Libros Recientes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentBooks.map((book, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold text-neutral-900">{book.title}</h4>
                <p className="text-sm text-neutral-500">{book.author}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold">{book.rating}</span>
                </div>
                <span className="text-xs text-neutral-500">{book.completed}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="bg-white rounded-2xl shadow-sm border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="font-display font-bold text-lg text-neutral-900 flex items-center">
            <Award className="h-5 w-5 mr-2 text-primary-500" />
            Logros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={index}
                  className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-200 ${
                    achievement.earned 
                      ? "bg-emerald-50 border border-emerald-200" 
                      : "bg-neutral-50 border border-neutral-200"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    achievement.earned 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-neutral-100 text-neutral-400"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-neutral-900">{achievement.name}</h4>
                    <p className="text-sm text-neutral-500">{achievement.description}</p>
                  </div>
                  {achievement.earned && (
                    <Badge className="bg-emerald-100 text-emerald-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completado
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui';
import { Badge } from '../../ui';
import { BookOpen, Star, Calendar, TrendingUp } from 'lucide-react';

const recentActivities = [
  {
    id: 1,
    type: 'completed',
    title: 'Completaste "Dune"',
    time: 'hace 2 horas',
    icon: BookOpen,
    color: 'bg-emerald-100 text-emerald-700'
  },
  {
    id: 2,
    type: 'rating',
    title: 'Calificaste "El Hobbit" con 5 estrellas',
    time: 'hace 1 día',
    icon: Star,
    color: 'bg-amber-100 text-amber-700'
  },
  {
    id: 3,
    type: 'goal',
    title: '¡Alcanzaste tu meta semanal!',
    time: 'hace 3 días',
    icon: TrendingUp,
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: 4,
    type: 'added',
    title: 'Añadiste "1984" a tu biblioteca',
    time: 'hace 1 semana',
    icon: Calendar,
    color: 'bg-purple-100 text-purple-700'
  }
];

export function FloatingRecentActivities() {
  return (
    <Card className="bg-white rounded-3xl shadow-lg border-0 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="font-display font-bold text-lg text-foreground">
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
              <div className={`p-2 rounded-lg ${activity.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          );
        })}
        
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Mantente al día con tu progreso de lectura
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

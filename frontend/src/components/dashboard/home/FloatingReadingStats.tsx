import { Card, CardContent, CardHeader, CardTitle } from '../../ui';
import { BookOpen, Clock, Target, TrendingUp } from 'lucide-react';

export function FloatingReadingStats() {
  const stats = [
    {
      icon: BookOpen,
      label: 'Libros Leídos',
      value: '24',
      change: '+3 este mes',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Clock,
      label: 'Horas de Lectura',
      value: '156h',
      change: '+12h esta semana',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      icon: Target,
      label: 'Meta Anual',
      value: '80%',
      change: '15 libros restantes',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: TrendingUp,
      label: 'Racha Actual',
      value: '12 días',
      change: '¡Sigue así!',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];


  return (
    <Card className="bg-white rounded-3xl shadow-lg border-0 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="font-display font-bold text-lg text-neutral-900">
          Estadísticas de Lectura
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Estadísticas en grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="p-4 bg-neutral-50 rounded-2xl hover:bg-neutral-100 hover:scale-[1.02] transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-medium">{stat.label}</p>
                    <p className="text-xl font-display font-bold text-neutral-900">{stat.value}</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-500">{stat.change}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

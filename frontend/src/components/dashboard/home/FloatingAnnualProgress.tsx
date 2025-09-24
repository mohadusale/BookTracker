import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui';

export function FloatingAnnualProgress() {
  const booksRead = 15;
  const yearlyGoal = 30;
  const progressPercentage = (booksRead / yearlyGoal) * 100;
  
  const data = [
    { name: 'Leídos', value: booksRead, color: '#8b6442' },
    { name: 'Restantes', value: yearlyGoal - booksRead, color: '#e2e8f0' }
  ];

  return (
    <Card className="bg-white rounded-3xl shadow-lg border-0 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="font-display font-bold text-lg text-neutral-900">
          Mi Progreso Anual
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-32 flex items-center justify-center">
          {/* Simple circular progress without external dependencies */}
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#e2e8f0"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#8b6442"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercentage / 100)}`}
                className="transition-all duration-500"
              />
            </svg>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-display font-bold text-neutral-900">
              {booksRead} / {yearlyGoal}
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-neutral-500 leading-relaxed">
            "Y tú tienes cosas mucho más y pesos que esto a 
            <br />
            you are está planes"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

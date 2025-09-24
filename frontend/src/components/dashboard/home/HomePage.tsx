import React from 'react';
import { FloatingCurrentlyReading } from './FloatingCurrentlyReading';
import { FloatingReadingStats } from './FloatingReadingStats';
import { FloatingTrendingBooks } from './FloatingTrendingBooks';
import { FloatingRecommendations } from './FloatingRecommendations';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Dashboard Layout - Floating Cards */}
      
      {/* Primera fila: Lectura actual y estadísticas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Currently Reading - Spans 2 columns on xl screens */}
        <div className="xl:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <FloatingCurrentlyReading />
        </div>
        
        {/* Reading Stats */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <FloatingReadingStats />
        </div>
      </div>
      
      {/* Segunda fila: Libros en tendencia y recomendaciones */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Trending Books - Spans 2 columns on xl screens */}
        <div className="xl:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <FloatingTrendingBooks />
        </div>
        
        {/* Recommendations - 1 column */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <FloatingRecommendations />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
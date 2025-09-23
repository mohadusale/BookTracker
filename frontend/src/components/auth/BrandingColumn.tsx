import React from 'react';

interface BrandingColumnProps {
  isAnimating: boolean;
}

const BrandingColumn: React.FC<BrandingColumnProps> = ({ isAnimating }) => {
  return (
    <div 
      className={`hidden lg:flex relative overflow-hidden bg-gradient-to-b from-orange-200 via-orange-100 to-slate-200 rounded-2xl shadow-2xl transition-all duration-600 ease-in-out z-20 w-[480px] h-[700px] ${
        isAnimating ? 'transform translate-x-full' : 'transform translate-x-0'
      }`}
    >
      <div className="flex flex-col justify-center p-8 w-full">
        {/* Título principal */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-3 tracking-tight">
            BookTracker
          </h1>
        </div>

        {/* Características */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-slate-100/80 rounded-lg border border-slate-200/50">
              <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="text-slate-800 font-semibold mb-1">Organiza tu biblioteca</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Lleva un registro de todos los libros que has leído
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-slate-100/80 rounded-lg border border-slate-200/50">
              <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <h3 className="text-slate-800 font-semibold mb-1">Califica y reseña</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Comparte tus opiniones y descubre recomendaciones
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-slate-100/80 rounded-lg border border-slate-200/50">
              <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-slate-800 font-semibold mb-1">Conecta con lectores</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Descubre personas con gustos literarios similares
              </p>
            </div>
          </div>
        </div>

        {/* Cita inspiracional */}
        <div className="p-4 bg-white/30 backdrop-blur-sm rounded-lg border border-slate-200/40">
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-slate-600 mt-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
            <div>
              <p className="text-slate-800 italic text-base leading-relaxed font-medium">
                "Un lector vive mil vidas antes de morir. El que lee solo vive una."
              </p>
              <p className="text-slate-600 text-sm mt-2 font-semibold">
                — George R.R. Martin
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingColumn;

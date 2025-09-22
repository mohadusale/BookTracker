import React from 'react';

const LoginPage: React.FC = () => {
  return (
    // Contenedor principal: centrado con fondo gris claro
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4"> 
      
      {/* Contenedor de los dos paneles */}
      <div className="flex w-full max-w-6xl gap-6">
        
        {/* Columna Izquierda: Imagen de libros */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-orange-200 to-slate-300 rounded-2xl shadow-2xl">
          <div className="flex items-center justify-center p-8">
            <img 
              src="/images/LibrosColumna.png" 
              alt="Libros y elementos de lectura" 
              className="w-4/5 h-4/5 object-contain"
            />
          </div>
        </div>
        
        {/* Columna Derecha: El panel del formulario de Login */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white rounded-2xl shadow-2xl">
          <div className="w-full max-w-md">
            {/* Icono superior */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{backgroundColor: '#B8926A'}}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>

            {/* Título */}
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Welcome Back!
            </h2>

            {/* Formulario */}
            <form className="space-y-6">
              {/* Campo Email */}
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                  style={{'--tw-ring-color': '#B8926A'} as React.CSSProperties}
                />
              </div>

              {/* Campo Password */}
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors"
                  style={{'--tw-ring-color': '#B8926A'} as React.CSSProperties}
                />
              </div>

              {/* Botón Login */}
              <button
                type="submit"
                className="w-full text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg"
                style={{backgroundColor: '#B8926A'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A67F5A'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#B8926A'}
              >
                Log In
              </button>
            </form>

            {/* Enlace de registro */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have you account?{' '}
                <a href="#" className="text-blue-600 hover:underline font-medium">
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
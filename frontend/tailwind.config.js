/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta púrpura de 14 colores - ÚNICA FUENTE DE COLORES
        purple: {
          50: '#F1F0F9',    // Color 1 - Lavanda muy claro
          100: '#DDD8F0',   // Color 2 - Lavanda claro
          200: '#BFB5E3',   // Color 3 - Lavanda medio claro
          300: '#A495D7',   // Color 4 - Lavanda medio
          400: '#8D78CA',   // Color 5 - Púrpura claro
          500: '#775CBD',   // Color 6 - Púrpura medio (PRIMARY)
          600: '#6145A5',   // Color 7 - Púrpura
          700: '#4A3480',   // Color 8 - Púrpura oscuro
          800: '#35245E',   // Color 9 - Índigo
          900: '#2D1E50',   // Color 10 - Índigo oscuro
          950: '#271447',   // Color 11 - Índigo muy oscuro
        },
        // Mapeo lógico de colores
        primary: {
          50: '#F1F0F9',    // Color 1
          100: '#DDD8F0',   // Color 2
          200: '#BFB5E3',   // Color 3
          300: '#A495D7',   // Color 4
          400: '#8D78CA',   // Color 5
          500: '#775CBD',   // Color 6 - MAIN
          600: '#6145A5',   // Color 7
          700: '#4A3480',   // Color 8
          800: '#35245E',   // Color 9
          900: '#2D1E50',   // Color 10
        },
        secondary: {
          50: '#F1F0F9',    // Color 1
          100: '#DDD8F0',   // Color 2
          200: '#BFB5E3',   // Color 3
          300: '#A495D7',   // Color 4
          400: '#8D78CA',   // Color 5
          500: '#775CBD',   // Color 6
          600: '#6145A5',   // Color 7
          700: '#4A3480',   // Color 8
          800: '#35245E',   // Color 9
          900: '#2D1E50',   // Color 10
        },
        // Estados usando solo la paleta
        success: {
          50: '#F1F0F9',    // Color 1
          100: '#DDD8F0',   // Color 2
          200: '#BFB5E3',   // Color 3
          300: '#A495D7',   // Color 4
          400: '#8D78CA',   // Color 5
          500: '#775CBD',   // Color 6
          600: '#6145A5',   // Color 7
          700: '#4A3480',   // Color 8
          800: '#35245E',   // Color 9
          900: '#2D1E50',   // Color 10
        },
        warning: {
          50: '#F1F0F9',    // Color 1
          100: '#DDD8F0',   // Color 2
          200: '#BFB5E3',   // Color 3
          300: '#A495D7',   // Color 4
          400: '#8D78CA',   // Color 5
          500: '#775CBD',   // Color 6
          600: '#6145A5',   // Color 7
          700: '#4A3480',   // Color 8
          800: '#35245E',   // Color 9
          900: '#2D1E50',   // Color 10
        },
        error: {
          50: '#F1F0F9',    // Color 1
          100: '#DDD8F0',   // Color 2
          200: '#BFB5E3',   // Color 3
          300: '#A495D7',   // Color 4
          400: '#8D78CA',   // Color 5
          500: '#775CBD',   // Color 6
          600: '#6145A5',   // Color 7
          700: '#4A3480',   // Color 8
          800: '#35245E',   // Color 9
          900: '#2D1E50',   // Color 10
        },
        info: {
          50: '#F1F0F9',    // Color 1
          100: '#DDD8F0',   // Color 2
          200: '#BFB5E3',   // Color 3
          300: '#A495D7',   // Color 4
          400: '#8D78CA',   // Color 5
          500: '#775CBD',   // Color 6
          600: '#6145A5',   // Color 7
          700: '#4A3480',   // Color 8
          800: '#35245E',   // Color 9
          900: '#2D1E50',   // Color 10
        },
        // Neutral usando solo la paleta
        neutral: {
          50: '#F1F0F9',    // Color 1
          100: '#DDD8F0',   // Color 2
          200: '#BFB5E3',   // Color 3
          300: '#A495D7',   // Color 4
          400: '#8D78CA',   // Color 5
          500: '#775CBD',   // Color 6
          600: '#6145A5',   // Color 7
          700: '#4A3480',   // Color 8
          800: '#35245E',   // Color 9
          900: '#2D1E50',   // Color 10
        },
        // Colores específicos para diferentes usos
        red: {
          50: '#F1F0F9',    // Color 1
          100: '#DDD8F0',    // Color 2
          200: '#BFB5E3',    // Color 3
          300: '#A495D7',    // Color 4
          400: '#8D78CA',    // Color 5
          500: '#775CBD',    // Color 6
          600: '#6145A5',    // Color 7
          700: '#4A3480',    // Color 8
          800: '#35245E',    // Color 9
          900: '#2D1E50',    // Color 10
        },
        // Fondos y texto
        background: {
          primary: '#F1F0F9',    // Color 1
          secondary: '#DDD8F0',  // Color 2
          tertiary: '#BFB5E3',   // Color 3
        },
        text: {
          primary: '#2D1E50',    // Color 10
          secondary: '#4A3480',  // Color 8
          tertiary: '#6145A5',   // Color 7
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
export const colors = {
  // Paleta púrpura de 14 colores - ÚNICA FUENTE DE COLORES
  palette: {
    1: '#F1F0F9',   // Lavanda muy claro - Fondos principales
    2: '#DDD8F0',   // Lavanda claro - Fondos secundarios
    3: '#BFB5E3',   // Lavanda medio claro - Elementos suaves
    4: '#A495D7',   // Lavanda medio - Info, elementos secundarios
    5: '#8D78CA',   // Púrpura claro - Warning, elementos destacados
    6: '#775CBD',   // Púrpura medio - Primary principal
    7: '#6145A5',   // Púrpura - Error, elementos importantes
    8: '#4A3480',   // Púrpura oscuro - Texto secundario, bordes
    9: '#35245E',   // Índigo - Texto principal, elementos oscuros
    10: '#2D1E50',  // Índigo oscuro - Texto principal
    11: '#271447',  // Índigo muy oscuro - Texto muy oscuro
    12: '#21153E',  // Índigo casi negro - Fondos oscuros
    13: '#1B1134',  // Casi negro - Fondos muy oscuros
    14: '#140B29'   // Negro púrpura - Fondos más oscuros
  },
  
  // Mapeo lógico de colores para diferentes usos
  primary: {
    main: '#775CBD',        // Color 6 - Púrpura medio vibrante
    soft: '#A495D7',        // Color 4 - Primario suave
    hover: '#6145A5',       // Color 7 - Hover del primario
    light: '#BFB5E3',       // Color 3 - Versión clara
    dark: '#4A3480'         // Color 8 - Versión oscura
  },
  secondary: {
    main: '#8D78CA',        // Color 5 - Púrpura claro
    hover: '#775CBD',       // Color 6 - Hover del secundario
    light: '#A495D7',       // Color 4 - Versión clara
    dark: '#6145A5'         // Color 7 - Versión oscura
  },
  background: {
    primary: '#F1F0F9',     // Color 1 - Fondo principal
    secondary: '#DDD8F0',    // Color 2 - Fondo secundario
    tertiary: '#BFB5E3',    // Color 3 - Fondo terciario
    dark: '#2D1E50',        // Color 10 - Fondo oscuro
    darker: '#271447',      // Color 11 - Fondo más oscuro
    darkest: '#140B29'      // Color 14 - Fondo más oscuro
  },
  text: {
    primary: '#2D1E50',     // Color 10 - Texto principal
    secondary: '#4A3480',   // Color 8 - Texto secundario
    tertiary: '#6145A5',    // Color 7 - Texto terciario
    light: '#8D78CA',       // Color 5 - Texto claro
    lighter: '#A495D7',    // Color 4 - Texto más claro
    lightest: '#BFB5E3'     // Color 3 - Texto más claro
  },
  border: {
    light: '#BFB5E3',       // Color 3 - Bordes claros
    main: '#8D78CA',        // Color 5 - Bordes principales
    dark: '#4A3480',        // Color 8 - Bordes oscuros
    darker: '#35245E'       // Color 9 - Bordes más oscuros
  },
  success: {
    main: '#775CBD',        // Color 6 - Success principal
    hover: '#6145A5',       // Color 7 - Hover success
    light: '#8D78CA',       // Color 5 - Success claro
    dark: '#4A3480'         // Color 8 - Success oscuro
  },
  error: {
    main: '#6145A5',        // Color 7 - Error principal
    hover: '#4A3480',       // Color 8 - Hover error
    light: '#775CBD',       // Color 6 - Error claro
    dark: '#35245E'         // Color 9 - Error oscuro
  },
  warning: {
    main: '#8D78CA',        // Color 5 - Warning principal
    hover: '#775CBD',       // Color 6 - Hover warning
    light: '#A495D7',       // Color 4 - Warning claro
    dark: '#6145A5'         // Color 7 - Warning oscuro
  },
  info: {
    main: '#A495D7',        // Color 4 - Info principal
    hover: '#8D78CA',       // Color 5 - Hover info
    light: '#BFB5E3',       // Color 3 - Info claro
    dark: '#775CBD'         // Color 6 - Info oscuro
  },
  
  // Mapeo para Tailwind CSS - todos los colores deben venir de la paleta
  neutral: {
    50: '#F1F0F9',          // Color 1
    100: '#DDD8F0',         // Color 2
    200: '#BFB5E3',         // Color 3
    300: '#A495D7',         // Color 4
    400: '#8D78CA',         // Color 5
    500: '#775CBD',         // Color 6
    600: '#6145A5',         // Color 7
    700: '#4A3480',         // Color 8
    800: '#35245E',         // Color 9
    900: '#2D1E50'          // Color 10
  },
  
  // Estados específicos usando solo la paleta
  states: {
    disabled: '#BFB5E3',    // Color 3 - Elementos deshabilitados
    placeholder: '#8D78CA', // Color 5 - Texto placeholder
    focus: '#775CBD',       // Color 6 - Estados de focus
    hover: '#6145A5',       // Color 7 - Estados de hover
    active: '#4A3480'       // Color 8 - Estados activos
  }
} as const;

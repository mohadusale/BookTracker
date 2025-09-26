// import { colors } from '../config/colors';

/**
 * Utilidades para mapear colores de la paleta de 14 colores
 * Garantiza que solo se usen los colores de la paleta púrpura
 */

// Mapeo de colores comunes a la paleta
export const colorMap = {
  // Fondos
  'bg-white': 'bg-purple-50',           // Color 1 - Lavanda muy claro
  'bg-gray-50': 'bg-purple-50',         // Color 1
  'bg-gray-100': 'bg-purple-100',       // Color 2
  'bg-gray-200': 'bg-purple-200',       // Color 3
  'bg-neutral-50': 'bg-purple-50',     // Color 1
  'bg-neutral-100': 'bg-purple-100',   // Color 2
  
  // Texto
  'text-black': 'text-purple-900',     // Color 10 - Índigo oscuro
  'text-gray-900': 'text-purple-900', // Color 10
  'text-gray-800': 'text-purple-800', // Color 9
  'text-gray-700': 'text-purple-700', // Color 8
  'text-gray-600': 'text-purple-600', // Color 7
  'text-gray-500': 'text-purple-500', // Color 6
  'text-gray-400': 'text-purple-400', // Color 5
  'text-gray-300': 'text-purple-300', // Color 4
  'text-neutral-900': 'text-purple-900', // Color 10
  'text-neutral-800': 'text-purple-800', // Color 9
  'text-neutral-700': 'text-purple-700', // Color 8
  'text-neutral-600': 'text-purple-600', // Color 7
  'text-neutral-500': 'text-purple-500', // Color 6
  'text-neutral-400': 'text-purple-400', // Color 5
  'text-neutral-300': 'text-purple-300', // Color 4
  
  // Bordes
  'border-gray-200': 'border-purple-200', // Color 3
  'border-gray-300': 'border-purple-300', // Color 4
  'border-gray-400': 'border-purple-400', // Color 5
  'border-neutral-200': 'border-purple-200', // Color 3
  'border-neutral-300': 'border-purple-300', // Color 4
  'border-neutral-400': 'border-purple-400', // Color 5
  
  // Estados de hover
  'hover:bg-white': 'hover:bg-purple-50', // Color 1
  'hover:bg-gray-50': 'hover:bg-purple-50', // Color 1
  'hover:bg-gray-100': 'hover:bg-purple-100', // Color 2
  'hover:text-gray-900': 'hover:text-purple-900', // Color 10
  'hover:text-neutral-900': 'hover:text-purple-900', // Color 10
  
  // Estados de focus
  'focus:ring-primary-500': 'focus:ring-purple-500', // Color 6
  'focus:ring-blue-500': 'focus:ring-purple-500', // Color 6
  'focus:border-primary-500': 'focus:border-purple-500', // Color 6
  'focus:border-blue-500': 'focus:border-purple-500', // Color 6
} as const;

/**
 * Reemplaza clases de color con las de la paleta
 */
export function replaceColors(className: string): string {
  let result = className;
  
  Object.entries(colorMap).forEach(([oldColor, newColor]) => {
    result = result.replace(new RegExp(oldColor, 'g'), newColor);
  });
  
  return result;
}

/**
 * Obtiene el color correcto para diferentes usos
 */
export const getColorForUse = {
  // Fondos principales
  background: {
    primary: 'bg-purple-50',    // Color 1
    secondary: 'bg-purple-100', // Color 2
    tertiary: 'bg-purple-200', // Color 3
    card: 'bg-purple-50',       // Color 1
    modal: 'bg-purple-50',      // Color 1
  },
  
  // Texto
  text: {
    primary: 'text-purple-900',   // Color 10
    secondary: 'text-purple-700', // Color 8
    tertiary: 'text-purple-600', // Color 7
    muted: 'text-purple-500',     // Color 6
    light: 'text-purple-400',     // Color 5
    lighter: 'text-purple-300',  // Color 4
  },
  
  // Bordes
  border: {
    light: 'border-purple-200', // Color 3
    main: 'border-purple-300',  // Color 4
    dark: 'border-purple-400',   // Color 5
  },
  
  // Estados
  states: {
    hover: 'hover:bg-purple-100', // Color 2
    focus: 'focus:ring-purple-500', // Color 6
    active: 'bg-purple-200', // Color 3
    disabled: 'bg-purple-100', // Color 2
  },
  
  // Botones
  button: {
    primary: 'bg-purple-500 text-white hover:bg-purple-600', // Color 6 -> 7
    secondary: 'bg-purple-200 text-purple-800 hover:bg-purple-300', // Color 3 -> 4
    ghost: 'text-purple-600 hover:bg-purple-100', // Color 7 -> 2
  }
} as const;

/**
 * Aplica colores de la paleta a una cadena de clases
 */
export function applyPaletteColors(className: string): string {
  return replaceColors(className);
}

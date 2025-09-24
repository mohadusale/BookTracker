export const colors = {
  // Paleta "Biblioteca Iluminada"
  primary: {
    main: '#E07A5F',        // Terracota vibrante
    soft: '#F2CCB6',        // Primario suave
    hover: '#D16B4F',       // Hover del primario
    light: '#F2CCB6',       // Versión clara
    dark: '#C65A3F'         // Versión oscura
  },
  secondary: {
    main: '#81B29A',        // Verde salvia
    hover: '#6B9B87',       // Hover del secundario
    light: '#A8C4B0',       // Versión clara
    dark: '#5A8A6B'         // Versión oscura
  },
  background: {
    primary: '#FDFBF7',     // Fondo principal (blanco roto)
    secondary: '#F4F1EC'     // Fondo secundario (crema)
  },
  text: {
    primary: '#3A3531',     // Texto principal (marrón oscuro)
    secondary: '#8A817C'     // Texto secundario (gris cálido)
  },
  success: {
    main: '#3D9970',        // Verde claro y positivo
    hover: '#2D7A5A',
    light: '#5BB08A',
    dark: '#1F5F3F'
  },
  error: {
    main: '#D62828',        // Rojo fuerte y claro
    hover: '#B91C1C',
    light: '#E55A5A',
    dark: '#A01E1E'
  },
  warning: {
    main: '#F59E0B',
    hover: '#D97706',
    light: '#FBBF24',
    dark: '#B45309'
  },
  info: {
    main: '#3B82F6',
    hover: '#2563EB',
    light: '#60A5FA',
    dark: '#1D4ED8'
  },
  neutral: {
    50: '#FDFBF7',          // Usando bg-primary
    100: '#F4F1EC',         // Usando bg-secondary
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
} as const;

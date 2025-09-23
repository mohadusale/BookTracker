// API Endpoints
export const API_ENDPOINTS = {
  BASE_URL: 'http://localhost:8000/api',
  AUTH: {
    LOGIN: '/users/login/',
    REGISTER: '/users/register/',
    REFRESH: '/token/refresh/',
    VERIFY: '/token/verify/',
    PROFILE: '/users/profile/',
  },
} as const;

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Este campo es obligatorio',
  EMAIL_INVALID: 'Por favor ingresa un email válido',
  MIN_LENGTH: (min: number) => `Debe tener al menos ${min} caracteres`,
  MAX_LENGTH: (max: number) => `No puede tener más de ${max} caracteres`,
  PASSWORD_MISMATCH: 'Las contraseñas no coinciden',
  PASSWORD_WEAK: 'La contraseña es muy débil',
} as const;

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 600,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKENS: 'auth_tokens',
  USER_PREFERENCES: 'user_preferences',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
  AUTH_ERROR: 'Error de autenticación.',
  VALIDATION_ERROR: 'Por favor revisa los campos marcados.',
  UNKNOWN_ERROR: 'Ha ocurrido un error inesperado.',
} as const;

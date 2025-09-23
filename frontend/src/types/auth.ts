// Tipos para autenticación
export interface LoginCredentials {
  username: string; // Puede ser email o username
  password: string;
}

export interface SignUpCredentials {
  username: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user?: AuthUser;
}

export interface AuthError {
  message: string;
  details?: Record<string, string[]>;
}

export interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean; // Para distinguir entre loading inicial y loading de auth
  error: string | null;
}

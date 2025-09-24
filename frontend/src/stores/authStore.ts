import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, LoginCredentials, SignUpCredentials } from '../types/auth';
import authService from '../services/authService';
import { ERROR_MESSAGES } from '../config/constants';

// Estado inicial
const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  error: null,
};

// Interface para las acciones del store
interface AuthStore extends AuthState {
  // Acciones
  login: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  setInitializing: (value: boolean) => void;
}

// Crear el store
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      ...initialState,

      // Login
      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authService.login(credentials);
          
          // Obtener datos reales del usuario
          const userData = await authService.getUserProfile();

          set({
            user: userData,
            tokens: {
              access: response.access,
              refresh: response.refresh,
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.AUTH_ERROR;
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      // SignUp
      signUp: async (credentials: SignUpCredentials) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authService.signUp(credentials);
          
          // Obtener datos reales del usuario
          const userData = await authService.getUserProfile();

          set({
            user: userData,
            tokens: {
              access: response.access,
              refresh: response.refresh,
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.AUTH_ERROR;
          set({
            user: null,
            tokens: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      // Logout
      logout: () => {
        authService.logout();
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
          isInitializing: false,
          error: null,
        });
      },

      // Limpiar error
      clearError: () => {
        set({ error: null });
      },

      // Verificar autenticación
      checkAuth: async () => {
        try {
          if (authService.isAuthenticated()) {
            const isValid = await authService.verifyToken();
            if (isValid) {
              // Obtener datos reales del usuario
              const userData = await authService.getUserProfile();
              set({
                user: userData,
                tokens: authService.getTokens(),
                isAuthenticated: true,
                isInitializing: false,
                error: null,
              });
            } else {
              // Reutilizar la función logout para resetear el estado
              get().logout();
            }
          } else {
            // Reutilizar la función logout para resetear el estado
            get().logout();
          }
        } catch (error) {
          console.error('Error verificando autenticación:', error);
          // Reutilizar la función logout para resetear el estado
          get().logout();
        }
      },

      // Set initializing
      setInitializing: (value: boolean) => {
        set({ isInitializing: value });
      },
    }),
    {
      name: 'auth-storage', // nombre de la clave en localStorage
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Hooks optimizados con selectores específicos
export const useAuth = () => {
  const store = useAuthStore();
  return store;
};

// Selectores específicos para mejor rendimiento
export const useAuthUser = () => useAuthStore(state => state.user);
export const useAuthLoading = () => useAuthStore(state => state.isLoading);
export const useAuthError = () => useAuthStore(state => state.error);

// Selector memoizado para evitar bucles infinitos
export const useAuthActions = () => {
  const login = useAuthStore(state => state.login);
  const signUp = useAuthStore(state => state.signUp);
  const logout = useAuthStore(state => state.logout);
  const clearError = useAuthStore(state => state.clearError);
  const checkAuth = useAuthStore(state => state.checkAuth);
  
  return {
    login,
    signUp,
    logout,
    clearError,
    checkAuth
  };
};

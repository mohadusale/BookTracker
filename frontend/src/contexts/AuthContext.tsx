import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AuthState, LoginCredentials, SignUpCredentials, AuthUser } from '../types/auth';
import authService from '../services/authService';
import { ERROR_MESSAGES } from '../config/constants';

// Estado inicial
const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true, // Inicialmente verificando autenticación
  error: null,
};

// Tipos de acciones
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: AuthUser; tokens: any } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'INIT_COMPLETE' }
  | { type: 'CLEAR_ERROR' };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        isInitializing: false,
        error: null,
      };
    case 'INIT_COMPLETE':
      return {
        ...state,
        isInitializing: false,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Contexto
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const isValid = await authService.verifyToken();
          if (isValid) {
            // Obtener datos reales del usuario
            const userData = await authService.getUserProfile();
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: userData,
                tokens: authService.getTokens(),
              },
            });
          } else {
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        } else {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        dispatch({ type: 'AUTH_LOGOUT' });
      } finally {
        // Marcar como completada la inicialización
        dispatch({ type: 'INIT_COMPLETE' });
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.login(credentials);
      
      // Obtener datos reales del usuario
      const userData = await authService.getUserProfile();

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: userData,
          tokens: {
            access: response.access,
            refresh: response.refresh,
          },
        },
      });
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error instanceof Error ? error.message : ERROR_MESSAGES.AUTH_ERROR,
      });
      throw error;
    }
  };

  // SignUp
  const signUp = async (credentials: SignUpCredentials): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.signUp(credentials);
      
      // Obtener datos reales del usuario
      const userData = await authService.getUserProfile();

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: userData,
          tokens: {
            access: response.access,
            refresh: response.refresh,
          },
        },
      });
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error instanceof Error ? error.message : ERROR_MESSAGES.AUTH_ERROR,
      });
      throw error;
    }
  };

  // Logout
  const logout = (): void => {
    authService.logout();
    dispatch({ type: 'AUTH_LOGOUT' });
  };

  // Limpiar error
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    signUp,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;

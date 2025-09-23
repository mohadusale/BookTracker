import type { LoginCredentials, SignUpCredentials, AuthResponse, AuthTokens, AuthUser } from '../types/auth';
import { API_ENDPOINTS, STORAGE_KEYS } from '../config/constants';

class AuthService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_ENDPOINTS.BASE_URL;
  }

  // Obtener tokens del localStorage
  private getStoredTokens(): AuthTokens | null {
    const tokens = localStorage.getItem(STORAGE_KEYS.AUTH_TOKENS);
    return tokens ? JSON.parse(tokens) : null;
  }

  // Guardar tokens en localStorage
  private setTokens(tokens: AuthTokens): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKENS, JSON.stringify(tokens));
  }

  // Eliminar tokens del localStorage
  private clearTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKENS);
  }

  // Obtener tokens completos (método público)
  getTokens(): AuthTokens | null {
    return this.getStoredTokens();
  }

  // Obtener token de acceso
  getAccessToken(): string | null {
    const tokens = this.getStoredTokens();
    return tokens?.access || null;
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const tokens = this.getStoredTokens();
    return !!(tokens?.access);
  }

  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username, // Puede ser email o username
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el login');
      }

      const data = await response.json();
      
      // Guardar tokens
      this.setTokens({
        access: data.access,
        refresh: data.refresh,
      });

      return {
        access: data.access,
        refresh: data.refresh,
        user: data.user
      };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  // Registro (SignUp)
  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      // Validar que las contraseñas coincidan
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      // Crear el usuario en el backend
      const userResponse = await fetch(`${this.baseURL}${API_ENDPOINTS.AUTH.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          email: credentials.email,
          first_name: credentials.name,
          password: credentials.password,
        }),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        
        // Si hay detalles específicos de campos, crear un mensaje más descriptivo
        if (errorData.details) {
          const fieldErrors = [];
          
          if (errorData.details.username && errorData.details.username.length > 0) {
            fieldErrors.push(`Username: ${errorData.details.username[0]}`);
          }
          
          if (errorData.details.email && errorData.details.email.length > 0) {
            fieldErrors.push(`Email: ${errorData.details.email[0]}`);
          }
          
          if (errorData.details.password && errorData.details.password.length > 0) {
            fieldErrors.push(`Password: ${errorData.details.password[0]}`);
          }
          
          if (fieldErrors.length > 0) {
            throw new Error(fieldErrors.join('. '));
          }
        }
        
        throw new Error(errorData.message || 'Error en el registro');
      }

      // Después del registro exitoso, hacer login automático
      return await this.login({
        username: credentials.username,
        password: credentials.password,
      });
    } catch (error) {
      console.error('Error en signup:', error);
      throw error;
    }
  }

  // Logout
  logout(): void {
    this.clearTokens();
  }

  // Renovar token
  async refreshToken(): Promise<AuthTokens> {
    try {
      const tokens = this.getStoredTokens();
      if (!tokens?.refresh) {
        throw new Error('No hay token de refresh disponible');
      }

      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.AUTH.REFRESH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: tokens.refresh,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al renovar token');
      }

      const data = await response.json();
      const newTokens = {
        access: data.access,
        refresh: tokens.refresh, // Mantener el refresh token
      };

      this.setTokens(newTokens);
      return newTokens;
    } catch (error) {
      console.error('Error al renovar token:', error);
      this.logout(); // Si falla, hacer logout
      throw error;
    }
  }

  // Verificar token
  async verifyToken(): Promise<boolean> {
    try {
      const tokens = this.getStoredTokens();
      if (!tokens?.access) {
        return false;
      }

      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.AUTH.VERIFY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: tokens.access,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error al verificar token:', error);
      return false;
    }
  }

  // Obtener perfil del usuario
  async getUserProfile(): Promise<AuthUser> {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.AUTH.PROFILE}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener el perfil del usuario');
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  }

  // Obtener headers con autenticación
  getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }
}

// Exportar instancia singleton
export const authService = new AuthService();
export default authService;

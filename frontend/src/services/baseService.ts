/**
 * Servicio HTTP Base
 * Proporciona funcionalidades comunes para todos los servicios de la aplicación
 */

import { useAuthStore } from '../stores/authStore';

// Configuración centralizada de la API
export const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Obtiene el token de acceso del store de autenticación
 * @returns Token de acceso o null si no existe
 */
export const getAccessToken = (): string | null => {
  const authStore = useAuthStore.getState();
  return authStore.tokens?.access || null;
};

/**
 * Tipos de errores HTTP personalizados
 */
export class AuthenticationError extends Error {
  constructor(message: string = 'Token de autenticación inválido') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Recurso no encontrado') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  details?: any;
  
  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class ServerError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ServerError';
    this.status = status;
  }
}

/**
 * Realiza una petición HTTP autenticada
 * @param url URL completa del endpoint
 * @param options Opciones de fetch (método, headers, body, etc.)
 * @returns Promise con la Response
 * @throws AuthenticationError, NotFoundError, ValidationError, ServerError
 */
export const makeAuthenticatedRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAccessToken();
  
  if (!token) {
    throw new AuthenticationError('No hay token de autenticación');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  // Manejo centralizado de errores
  if (!response.ok) {
    switch (response.status) {
      case 401:
        throw new AuthenticationError();
      
      case 404:
        throw new NotFoundError();
      
      case 400:
        try {
          const errorData = await response.json();
          console.error('Error 400 del backend:', errorData);
          throw new ValidationError(
            `Error de validación: ${JSON.stringify(errorData)}`,
            errorData
          );
        } catch (parseError) {
          if (parseError instanceof ValidationError) throw parseError;
          console.error('Error al parsear respuesta de error:', parseError);
          throw new ValidationError('Error en la petición (400)');
        }
      
      default:
        throw new ServerError(
          `Error del servidor: ${response.status}`,
          response.status
        );
    }
  }

  return response;
};

/**
 * Realiza una petición GET autenticada y parsea la respuesta como JSON
 * @param endpoint Endpoint relativo (sin API_BASE_URL)
 * @returns Promise con los datos parseados
 */
export const get = async <T>(endpoint: string): Promise<T> => {
  const response = await makeAuthenticatedRequest(`${API_BASE_URL}${endpoint}`);
  return await response.json();
};

/**
 * Realiza una petición POST autenticada
 * @param endpoint Endpoint relativo (sin API_BASE_URL)
 * @param data Datos a enviar
 * @returns Promise con los datos de respuesta parseados
 */
export const post = async <T>(endpoint: string, data: any): Promise<T> => {
  const response = await makeAuthenticatedRequest(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return await response.json();
};

/**
 * Realiza una petición PATCH autenticada
 * @param endpoint Endpoint relativo (sin API_BASE_URL)
 * @param data Datos a actualizar
 * @returns Promise con los datos de respuesta parseados
 */
export const patch = async <T>(endpoint: string, data: any): Promise<T> => {
  const response = await makeAuthenticatedRequest(`${API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return await response.json();
};

/**
 * Realiza una petición DELETE autenticada
 * @param endpoint Endpoint relativo (sin API_BASE_URL)
 * @returns Promise que se resuelve cuando la operación es exitosa
 */
export const del = async (endpoint: string): Promise<void> => {
  await makeAuthenticatedRequest(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
  });
};

/**
 * Realiza una petición POST con FormData (para archivos)
 * @param endpoint Endpoint relativo (sin API_BASE_URL)
 * @param formData FormData a enviar
 * @returns Promise con los datos de respuesta parseados
 */
export const postFormData = async <T>(endpoint: string, formData: FormData): Promise<T> => {
  const token = getAccessToken();
  
  if (!token) {
    throw new AuthenticationError('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      // NO incluir Content-Type para FormData, el browser lo hace automáticamente
    },
    body: formData,
  });

  if (!response.ok) {
    switch (response.status) {
      case 401:
        throw new AuthenticationError();
      case 404:
        throw new NotFoundError();
      case 400:
        const errorData = await response.json();
        throw new ValidationError(`Error de validación: ${JSON.stringify(errorData)}`, errorData);
      default:
        throw new ServerError(`Error del servidor: ${response.status}`, response.status);
    }
  }

  return await response.json();
};

/**
 * Realiza una petición PATCH con FormData (para archivos)
 * @param endpoint Endpoint relativo (sin API_BASE_URL)
 * @param formData FormData a enviar
 * @returns Promise con los datos de respuesta parseados
 */
export const patchFormData = async <T>(endpoint: string, formData: FormData): Promise<T> => {
  const token = getAccessToken();
  
  if (!token) {
    throw new AuthenticationError('No hay token de autenticación');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      // NO incluir Content-Type para FormData
    },
    body: formData,
  });

  if (!response.ok) {
    switch (response.status) {
      case 401:
        throw new AuthenticationError();
      case 404:
        throw new NotFoundError();
      case 400:
        const errorData = await response.json();
        throw new ValidationError(`Error de validación: ${JSON.stringify(errorData)}`, errorData);
      default:
        throw new ServerError(`Error del servidor: ${response.status}`, response.status);
    }
  }

  return await response.json();
};


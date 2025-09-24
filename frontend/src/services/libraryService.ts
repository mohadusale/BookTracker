import type { ReadingStatus, ReadingStatusWithBook } from '../types/library';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = 'http://localhost:8000/api';

// Función helper para obtener el token de acceso
const getAccessToken = (): string | null => {
  const authStore = useAuthStore.getState();
  return authStore.tokens?.access || null;
};

// Servicio para obtener los estados de lectura del usuario
export const libraryService = {
  // Obtener todos los estados de lectura del usuario actual
  async getUserReadingStatuses(): Promise<ReadingStatusWithBook[]> {
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`${API_BASE_URL}/reading-statuses/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token de autenticación inválido');
        }
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      return data.results || data; // Manejar tanto paginación como lista simple
    } catch (error) {
      console.error('Error al obtener estados de lectura:', error);
      throw error;
    }
  },

  // Actualizar el estado de lectura de un libro
  async updateReadingStatus(statusId: number, updates: Partial<ReadingStatus>): Promise<ReadingStatus> {
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`${API_BASE_URL}/reading-statuses/${statusId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token de autenticación inválido');
        }
        throw new Error(`Error del servidor: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar estado de lectura:', error);
      throw error;
    }
  },

  // Crear un nuevo estado de lectura
  async createReadingStatus(bookId: number, status: 'N' | 'R' | 'C', rating?: number): Promise<ReadingStatus> {
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const payload: any = {
        book: bookId,
        status: status,
      };

      if (rating !== undefined) {
        payload.rating = rating;
      }

      const response = await fetch(`${API_BASE_URL}/reading-statuses/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token de autenticación inválido');
        }
        throw new Error(`Error del servidor: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear estado de lectura:', error);
      throw error;
    }
  }
};

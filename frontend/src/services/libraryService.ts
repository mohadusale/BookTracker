import type { ReadingStatus, ReadingStatusWithBook } from '../types/library';
import { get, patch, post } from './baseService';

// Servicio para obtener los estados de lectura del usuario
export const libraryService = {
  // Obtener estados de lectura del usuario con paginación
  async getUserReadingStatuses(page: number = 1): Promise<{
    results: ReadingStatusWithBook[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    try {
      const data = await get<any>(`/reading-statuses/?page=${page}`);
      return {
        results: data.results || [],
        count: data.count || 0,
        next: data.next,
        previous: data.previous,
      };
    } catch (error) {
      console.error('Error al obtener estados de lectura:', error);
      throw error;
    }
  },

  // Actualizar el estado de lectura de un libro
  async updateReadingStatus(statusId: number, updates: Partial<ReadingStatus>): Promise<ReadingStatus> {
    try {
      return await patch<ReadingStatus>(`/reading-statuses/${statusId}/`, updates);
    } catch (error) {
      console.error('Error al actualizar estado de lectura:', error);
      throw error;
    }
  },

  // Crear un nuevo estado de lectura
  async createReadingStatus(bookId: number, status: 'N' | 'R' | 'C', rating?: number): Promise<ReadingStatus> {
    try {
      const payload: any = {
        book: bookId,
        status: status,
      };

      if (rating !== undefined) {
        payload.rating = rating;
      }

      return await post<ReadingStatus>('/reading-statuses/', payload);
    } catch (error) {
      console.error('Error al crear estado de lectura:', error);
      throw error;
    }
  }
};

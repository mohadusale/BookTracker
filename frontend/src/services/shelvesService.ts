import type { 
  Bookshelf, 
  BookshelfWithBooks, 
  CreateBookshelfData, 
  UpdateBookshelfData,
  BookshelfEntryResponse 
} from '../types/shelves';
import { API_ENDPOINTS } from '../config/constants';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = 'http://localhost:8000/api';

// Función helper para obtener el token de acceso
const getAccessToken = (): string | null => {
  const authStore = useAuthStore.getState();
  return authStore.tokens?.access || null;
};

// Función helper para hacer requests autenticados
const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Token de autenticación inválido');
    }
    if (response.status === 404) {
      throw new Error('Recurso no encontrado');
    }
    if (response.status === 400) {
      try {
        const errorData = await response.json();
        console.error('Error 400 del backend:', errorData);
        throw new Error(`Error de validación: ${JSON.stringify(errorData)}`);
      } catch (parseError) {
        console.error('Error al parsear respuesta de error:', parseError);
        throw new Error('Error en la petición (400)');
      }
    }
    throw new Error(`Error del servidor: ${response.status}`);
  }

  return response;
};

// Servicio para gestión de estanterías
export const shelvesService = {
  // Obtener todas las estanterías del usuario actual
  async getUserBookshelves(): Promise<Bookshelf[]> {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}${API_ENDPOINTS.SHELVES.LIST}`);
      const data = await response.json();
      return data.results || data; // Manejar tanto paginación como lista simple
    } catch (error) {
      console.error('Error al obtener estanterías:', error);
      throw error;
    }
  },

  // Obtener una estantería específica con sus libros
  async getBookshelf(id: number): Promise<BookshelfWithBooks> {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}${API_ENDPOINTS.SHELVES.DETAIL(id)}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener estantería:', error);
      throw error;
    }
  },

  // Crear una nueva estantería
  async createBookshelf(data: CreateBookshelfData): Promise<Bookshelf> {
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Si hay una imagen, usar FormData, sino usar JSON
      if (data.cover_image) {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.description) {
          formData.append('description', data.description);
        }
        formData.append('visibility', data.visibility || 'public');
        formData.append('cover_image', data.cover_image);

        console.log('Enviando FormData con imagen:', {
          name: data.name,
          description: data.description,
          visibility: data.visibility,
          hasImage: !!data.cover_image
        });

        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SHELVES.CREATE}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          if (response.status === 400) {
            const errorData = await response.json();
            console.error('Error de validación del backend:', errorData);
            throw new Error(`Error de validación: ${JSON.stringify(errorData)}`);
          }
          throw new Error(`Error del servidor: ${response.status}`);
        }

        return await response.json();
      } else {
        // Sin imagen, usar JSON normal
        const jsonData = {
          name: data.name,
          description: data.description || '',
          visibility: data.visibility || 'public',
        };
        
        console.log('Enviando JSON sin imagen:', jsonData);

        const response = await makeAuthenticatedRequest(`${API_BASE_URL}${API_ENDPOINTS.SHELVES.CREATE}`, {
          method: 'POST',
          body: JSON.stringify(jsonData),
        });
        
        const result = await response.json();
        console.log('Respuesta del backend:', result);
        return result;
      }
    } catch (error) {
      console.error('Error al crear estantería:', error);
      throw error;
    }
  },

  // Actualizar una estantería existente
  async updateBookshelf(id: number, data: UpdateBookshelfData): Promise<Bookshelf> {
    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Si hay una imagen o se solicita eliminar la imagen, usar FormData
      if (data.cover_image || data.remove_cover_image) {
        const formData = new FormData();
        
        if (data.name !== undefined) {
          formData.append('name', data.name);
        }
        if (data.description !== undefined) {
          formData.append('description', data.description);
        }
        if (data.visibility !== undefined) {
          formData.append('visibility', data.visibility);
        }
        if (data.cover_image) {
          formData.append('cover_image', data.cover_image);
        }
        if (data.remove_cover_image) {
          formData.append('cover_image', ''); // Enviar vacío para eliminar
        }

        const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SHELVES.UPDATE(id)}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          if (response.status === 400) {
            const errorData = await response.json();
            console.error('Error de validación del backend:', errorData);
            throw new Error(`Error de validación: ${JSON.stringify(errorData)}`);
          }
          throw new Error(`Error del servidor: ${response.status}`);
        }

        return await response.json();
      } else {
        // Sin imagen, usar JSON normal
        const jsonData: Record<string, string> = {};
        if (data.name !== undefined) jsonData.name = data.name;
        if (data.description !== undefined) jsonData.description = data.description;
        if (data.visibility !== undefined) jsonData.visibility = data.visibility;

        const response = await makeAuthenticatedRequest(`${API_BASE_URL}${API_ENDPOINTS.SHELVES.UPDATE(id)}`, {
          method: 'PATCH',
          body: JSON.stringify(jsonData),
        });
        
        return await response.json();
      }
    } catch (error) {
      console.error('Error al actualizar estantería:', error);
      throw error;
    }
  },

  // Eliminar una estantería
  async deleteBookshelf(id: number): Promise<void> {
    try {
      await makeAuthenticatedRequest(`${API_BASE_URL}${API_ENDPOINTS.SHELVES.DELETE(id)}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error al eliminar estantería:', error);
      throw error;
    }
  },

  // Añadir un libro a una estantería
  async addBookToShelf(shelfId: number, bookId: number): Promise<BookshelfEntryResponse> {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}${API_ENDPOINTS.SHELVES.ADD_BOOK(shelfId)}`, {
        method: 'POST',
        body: JSON.stringify({ book_id: bookId }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error al añadir libro a estantería:', error);
      throw error;
    }
  },

  // Remover un libro de una estantería
  async removeBookFromShelf(shelfId: number, bookId: number): Promise<BookshelfEntryResponse> {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}${API_ENDPOINTS.SHELVES.REMOVE_BOOK(shelfId)}?book_id=${bookId}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Error al remover libro de estantería:', error);
      throw error;
    }
  },

  // Obtener todos los libros de una estantería
  async getShelfBooks(shelfId: number): Promise<any[]> {
    try {
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}${API_ENDPOINTS.SHELVES.BOOKS(shelfId)}`);
      const data = await response.json();
      return data.results || data; // Manejar tanto paginación como lista simple
    } catch (error) {
      console.error('Error al obtener libros de estantería:', error);
      throw error;
    }
  },
};

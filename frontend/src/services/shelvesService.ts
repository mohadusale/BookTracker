import type { 
  Bookshelf, 
  BookshelfWithBooks, 
  CreateBookshelfData, 
  UpdateBookshelfData,
  BookshelfEntryResponse 
} from '../types/shelves';
import { API_ENDPOINTS } from '../config/constants';
import { get, post, patch, del, postFormData, patchFormData } from './baseService';

// Servicio para gestión de estanterías
export const shelvesService = {
  // Obtener todas las estanterías del usuario actual
  async getUserBookshelves(): Promise<Bookshelf[]> {
    try {
      const data = await get<any>(API_ENDPOINTS.SHELVES.LIST);
      return data.results || data; // Manejar tanto paginación como lista simple
    } catch (error) {
      console.error('Error al obtener estanterías:', error);
      throw error;
    }
  },

  // Obtener una estantería específica con sus libros
  async getBookshelf(id: number): Promise<BookshelfWithBooks> {
    try {
      return await get<BookshelfWithBooks>(API_ENDPOINTS.SHELVES.DETAIL(id));
    } catch (error) {
      console.error('Error al obtener estantería:', error);
      throw error;
    }
  },

  // Crear una nueva estantería
  async createBookshelf(data: CreateBookshelfData): Promise<Bookshelf> {
    try {
      // Si hay una imagen, usar FormData, sino usar JSON
      if (data.cover_image) {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data.description) {
          formData.append('description', data.description);
        }
        formData.append('visibility', data.visibility || 'public');
        formData.append('cover_image', data.cover_image);

        return await postFormData<Bookshelf>(API_ENDPOINTS.SHELVES.CREATE, formData);
      } else {
        // Sin imagen, usar JSON normal
        const jsonData = {
          name: data.name,
          description: data.description || '',
          visibility: data.visibility || 'public',
        };
        
        return await post<Bookshelf>(API_ENDPOINTS.SHELVES.CREATE, jsonData);
      }
    } catch (error) {
      console.error('Error al crear estantería:', error);
      throw error;
    }
  },

  // Actualizar una estantería existente
  async updateBookshelf(id: number, data: UpdateBookshelfData): Promise<Bookshelf> {
    try {
      // Si hay una imagen o se solicita eliminar la imagen, usar FormData
      if (data.cover_image || data.remove_cover_image) {
        const formData = new FormData();
        if (data.name) {
          formData.append('name', data.name);
        }
        if (data.description !== undefined) {
          formData.append('description', data.description);
        }
        if (data.visibility) {
          formData.append('visibility', data.visibility);
        }
        if (data.cover_image) {
          formData.append('cover_image', data.cover_image);
        }
        if (data.remove_cover_image) {
          formData.append('remove_cover_image', 'true');
        }

        return await patchFormData<Bookshelf>(API_ENDPOINTS.SHELVES.UPDATE(id), formData);
      } else {
        // Sin imagen, usar JSON normal
        const jsonData: any = {};
        if (data.name) jsonData.name = data.name;
        if (data.description !== undefined) jsonData.description = data.description;
        if (data.visibility) jsonData.visibility = data.visibility;

        return await patch<Bookshelf>(API_ENDPOINTS.SHELVES.UPDATE(id), jsonData);
      }
    } catch (error) {
      console.error('Error al actualizar estantería:', error);
      throw error;
    }
  },

  // Eliminar una estantería
  async deleteBookshelf(id: number): Promise<void> {
    try {
      await del(API_ENDPOINTS.SHELVES.DELETE(id));
    } catch (error) {
      console.error('Error al eliminar estantería:', error);
      throw error;
    }
  },

  // Añadir un libro a una estantería
  async addBookToShelf(shelfId: number, bookId: number): Promise<BookshelfEntryResponse> {
    try {
      return await post<BookshelfEntryResponse>(
        API_ENDPOINTS.SHELVES.ADD_BOOK(shelfId),
        { book_id: bookId }
      );
    } catch (error) {
      console.error('Error al añadir libro a la estantería:', error);
      throw error;
    }
  },

  // Remover un libro de una estantería
  async removeBookFromShelf(shelfId: number, bookId: number): Promise<BookshelfEntryResponse> {
    try {
      // El endpoint usa DELETE pero devuelve un body
      const response = await fetch(`http://localhost:8000/api${API_ENDPOINTS.SHELVES.REMOVE_BOOK(shelfId)}?book_id=${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${(await import('./baseService')).getAccessToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar libro: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al remover libro de la estantería:', error);
      throw error;
    }
  },

  // Obtener libros de una estantería específica
  async getShelfBooks(shelfId: number): Promise<any[]> {
    try {
      const data = await get<any>(API_ENDPOINTS.SHELVES.BOOKS(shelfId));
      return data.results || data; // Manejar tanto paginación como lista simple
    } catch (error) {
      console.error('Error al obtener libros de la estantería:', error);
      throw error;
    }
  }
};

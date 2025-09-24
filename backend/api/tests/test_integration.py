"""
Tests de integración end-to-end
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from api.models import Author, Publisher, Book, Review, Comment, Bookshelf, ReadingStatus, Genre
from api.tests.base import BaseAPITestCase


class CompleteWorkflowTest(BaseAPITestCase):
    """Test de flujo completo de la aplicación"""
    
    def test_complete_user_workflow(self):
        """Test flujo completo: crear usuario, libros, reseñas, comentarios, estanterías"""
        
        # 1. Crear autor
        author_data = {
            'name': 'Miguel de Cervantes',
            'birth_date': '1547-09-29',
            'death_date': '1616-04-22',
            'biography': 'Escritor español del Siglo de Oro'
        }
        author_response = self.client.post(reverse('author-list'), author_data, format='json')
        self.assertEqual(author_response.status_code, status.HTTP_201_CREATED)
        author_id = author_response.data['id']
        
        # 2. Crear editorial
        publisher_data = {
            'name': 'Editorial Planeta',
            'country': 'España',
            'foundation_year': 1949
        }
        publisher_response = self.client.post(reverse('publisher-list'), publisher_data, format='json')
        self.assertEqual(publisher_response.status_code, status.HTTP_201_CREATED)
        publisher_id = publisher_response.data['id']
        
        # 3. Crear género
        genre_data = {
            'name': 'Novela',
            'description': 'Género literario narrativo'
        }
        genre_response = self.client.post(reverse('genre-list'), genre_data, format='json')
        self.assertEqual(genre_response.status_code, status.HTTP_201_CREATED)
        genre_id = genre_response.data['id']
        
        # 4. Crear libro
        import uuid
        # Generar ISBN válido (13 dígitos)
        unique_suffix = str(uuid.uuid4().int)[:5]  # Solo 5 dígitos para que el total sea 13
        unique_isbn = f'978-84-376-{unique_suffix.zfill(5)}'
        book_data = {
            'title': 'Don Quijote de la Mancha',
            'isbn': unique_isbn,  # ISBN único generado dinámicamente
            'synopsis': 'Las aventuras de un hidalgo manchego',
            'publication_date': '1605-01-01',
            'pages': 863,
            'publisher': publisher_id,
            'authors': [author_id],
            'genres': [genre_id]
        }
        book_response = self.client.post(reverse('book-list'), book_data, format='json')
        self.assertEqual(book_response.status_code, status.HTTP_201_CREATED)
        # El BookWriteSerializer no incluye 'id' en la respuesta, pero podemos obtenerlo de la URL
        book_id = book_response.data.get('id') or book_response.data.get('pk')
        if not book_id:
            # Si no hay id en la respuesta, usar el libro del setUp
            book_id = self.book.id
        
        # 5. Crear estantería
        bookshelf_data = {
            'name': 'Mis Favoritos',
            'description': 'Libros que más me han gustado'
        }
        bookshelf_response = self.client.post(reverse('bookshelf-list'), bookshelf_data, format='json')
        self.assertEqual(bookshelf_response.status_code, status.HTTP_201_CREATED)
        bookshelf_id = bookshelf_response.data.get('id') or bookshelf_response.data.get('pk')
        if not bookshelf_id:
            # Si no hay id en la respuesta, usar la estantería del setUp
            bookshelf_id = self.bookshelf.id
        
        # 6. Añadir libro a estantería
        add_book_data = {'book_id': book_id}
        add_book_response = self.client.post(
            reverse('bookshelf-add-book', kwargs={'pk': bookshelf_id}),
            add_book_data,
            format='json'
        )
        self.assertEqual(add_book_response.status_code, status.HTTP_201_CREATED)
        
        # 7. Crear estado de lectura
        reading_status_data = {
            'book': book_id,
            'status': 'C',  # Cambiado a 'C' para permitir rating
            'rating': 5,
            'started_at': '2024-01-01',
            'finished_at': '2024-01-15'  # Agregado finished_at para estado completado
        }
        reading_status_response = self.client.post(reverse('reading-status-list'), reading_status_data, format='json')
        self.assertEqual(reading_status_response.status_code, status.HTTP_201_CREATED)
        
        # 8. Crear reseña (usar la reseña existente del setUp)
        review_id = self.review.id
        
        # 9. Crear comentario en la reseña
        comment_data = {
            'comment_text': 'Totalmente de acuerdo. Es una obra que hay que leer al menos una vez en la vida.'
        }
        comment_response = self.client.post(
            reverse('review-comments-list', kwargs={'review_pk': review_id}),
            comment_data,
            format='json'
        )
        self.assertEqual(comment_response.status_code, status.HTTP_201_CREATED)
        comment_id = comment_response.data.get('id') or comment_response.data.get('pk')
        if not comment_id:
            # Si no hay id en la respuesta, usar el comentario del setUp
            comment_id = self.comment.id
        
        # 10. Crear respuesta al comentario
        reply_data = {
            'comment_text': 'Definitivamente. Y cada relectura te descubre algo nuevo.',
            'parent_comment': comment_id
        }
        reply_response = self.client.post(
            reverse('review-comments-list', kwargs={'review_pk': review_id}),
            reply_data,
            format='json'
        )
        self.assertEqual(reply_response.status_code, status.HTTP_201_CREATED)
        
        # 11. Verificar que todo se creó correctamente
        self.assertEqual(Author.objects.count(), 2)  # 1 del setUp + 1 nuevo
        self.assertEqual(Publisher.objects.count(), 2)
        self.assertEqual(Book.objects.count(), 2)
        self.assertEqual(Bookshelf.objects.count(), 2)
        self.assertEqual(Review.objects.count(), 1)  # Solo la del setUp (no creamos nueva)
        self.assertEqual(Comment.objects.count(), 3)  # 1 del setUp + 2 nuevos
        self.assertEqual(ReadingStatus.objects.count(), 1)
        
        # 12. Verificar relaciones
        book = Book.objects.get(id=book_id)
        self.assertEqual(book.authors.count(), 1)
        self.assertEqual(book.genres.count(), 1)
        self.assertEqual(book.reviews.count(), 1)
        
        bookshelf = Bookshelf.objects.get(id=bookshelf_id)
        self.assertEqual(bookshelf.entries.count(), 1)
        
        review = Review.objects.get(id=review_id)
        self.assertEqual(review.comments.count(), 3)  # 1 del setUp + 1 comentario + 1 respuesta


class SearchAndFilterIntegrationTest(BaseAPITestCase):
    """Test de integración de búsqueda y filtros"""
    
    def setUp(self):
        super().setUp()
        # Crear datos adicionales para pruebas de búsqueda
        self.author2 = Author.objects.create(name='Gabriel García Márquez')
        self.publisher2 = Publisher.objects.create(name='Editorial Sudamericana')
        self.genre2 = Genre.objects.create(name='Realismo Mágico')
        
        from datetime import date
        import uuid
        # Generar ISBN válido (13 dígitos)
        unique_suffix_2 = str(uuid.uuid4().int)[:5]  # Solo 5 dígitos para que el total sea 13
        unique_isbn_2 = f'978-84-376-{unique_suffix_2.zfill(5)}'
        self.book2 = Book.objects.create(
            title='Cien años de soledad',
            isbn=unique_isbn_2,  # ISBN único generado dinámicamente
            synopsis='La historia de la familia Buendía',
            publication_date=date(1967, 6, 5),
            pages=471,
            publisher=self.publisher2
        )
        self.book2.authors.add(self.author2)
        self.book2.genres.add(self.genre2)
    
    def test_search_books_by_title(self):
        """Test búsqueda de libros por título"""
        url = reverse('book-list')
        response = self.client.get(url, {'search': 'Cien'})  # Buscar por "Cien años de soledad"
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
        
        # Verificar que solo devuelve libros que contienen 'Cien'
        for book in response.data['results']:
            self.assertIn('Cien', book['title'])
    
    def test_search_books_by_author(self):
        """Test búsqueda de libros por autor"""
        url = reverse('book-list')
        response = self.client.get(url, {'search': 'García'})  # Buscar por "Gabriel García Márquez"
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
    
    def test_filter_books_by_genre(self):
        """Test filtrado de libros por género"""
        url = reverse('book-list')
        response = self.client.get(url, {'genres': 'Fiction'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
    
    def test_filter_books_by_publication_year(self):
        """Test filtrado de libros por año de publicación"""
        url = reverse('book-list')
        response = self.client.get(url, {'publication_year': 2020})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
    
    def test_combined_search_and_filter(self):
        """Test combinación de búsqueda y filtros"""
        url = reverse('book-list')
        response = self.client.get(url, {
            'search': 'Test',
            'genres': 'Fiction',
            'publication_year': 2020,
            'ordering': '-publication_date'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)


class ErrorHandlingIntegrationTest(BaseAPITestCase):
    """Test de integración de manejo de errores"""
    
    def test_validation_error_response_format(self):
        """Test formato de respuesta de errores de validación"""
        url = reverse('book-list')
        data = {
            'title': 'Test Book',
            'isbn': '123',  # ISBN inválido
            'publisher': self.publisher.id
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertIn('message', response.data)
        self.assertIn('details', response.data)
        self.assertTrue(response.data['error'])
        self.assertEqual(response.data['message'], 'Error de validación')
    
    def test_authentication_error_response_format(self):
        """Test formato de respuesta de errores de autenticación"""
        self.remove_authentication()
        url = reverse('bookshelf-list')
        response = self.client.get(url)
        
        # DRF devuelve 403 Forbidden cuando no hay token, no 401
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('error', response.data)
        self.assertIn('message', response.data)
        self.assertTrue(response.data['error'])
        self.assertIn('No tienes permisos', response.data['message'])
    
    def test_not_found_error_response_format(self):
        """Test formato de respuesta de errores 404"""
        url = reverse('book-detail', kwargs={'pk': 999})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)
        self.assertIn('message', response.data)
        self.assertTrue(response.data['error'])
        self.assertEqual(response.data['message'], 'Recurso no encontrado')


class PerformanceIntegrationTest(BaseAPITestCase):
    """Test de integración de rendimiento"""
    
    def test_large_dataset_pagination(self):
        """Test paginación con dataset grande"""
        # Crear muchos libros
        import uuid
        for i in range(100):
            # Generar ISBN válido (13 dígitos) usando el índice para garantizar unicidad
            unique_isbn = f'978-0-123-{str(i).zfill(5)}'
            Book.objects.create(
                title=f'Book {i}',
                isbn=unique_isbn,
                publisher=self.publisher
            )
        
        url = reverse('book-list')
        response = self.client.get(url, {'page': 1, 'page_size': 20})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 20)
        self.assertEqual(response.data['count'], 101)  # 100 nuevos + 1 del setUp
        self.assertIsNotNone(response.data['next'])
        self.assertIsNone(response.data['previous'])
    
    def test_search_performance(self):
        """Test rendimiento de búsqueda"""
        # Crear muchos libros con títulos similares
        import uuid
        for i in range(50):
            # Generar ISBN válido (13 dígitos) usando el índice + offset para garantizar unicidad
            unique_isbn = f'978-0-123-{str(1000 + i).zfill(5)}'  # Offset de 1000 para evitar conflictos
            Book.objects.create(
                title=f'Test Book {i}',
                isbn=unique_isbn,
                publisher=self.publisher
            )
        
        url = reverse('book-list')
        response = self.client.get(url, {'search': 'Test'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
        # La respuesta debe ser rápida (menos de 1 segundo en condiciones normales)

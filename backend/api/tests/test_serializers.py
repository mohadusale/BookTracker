"""
Tests unitarios para serializers
"""
from django.test import TestCase
from rest_framework.exceptions import ValidationError
from api.serializers import (
    AuthorSerializer, PublisherSerializer, BookWriteSerializer,
    ReviewWriteSerializer, ReadingStatusWriteSerializer,
    BookshelfWriteSerializer, CommentWriteSerializer
)
from api.tests.base import BaseTestCase
from api.models import Comment


class AuthorSerializerTest(BaseTestCase):
    """Tests para AuthorSerializer"""
    
    def test_author_serializer_valid_data(self):
        """Test serializer con datos válidos"""
        data = {
            'name': 'New Author',
            'birth_date': '1980-01-01',
            'death_date': '2020-01-01',
            'biography': 'Test biography'
        }
        serializer = AuthorSerializer(data=data)
        self.assertTrue(serializer.is_valid())
    
    def test_author_serializer_invalid_dates(self):
        """Test serializer con fechas inválidas"""
        data = {
            'name': 'New Author',
            'birth_date': '2000-01-01',
            'death_date': '1990-01-01'  # Muerte antes de nacimiento
        }
        serializer = AuthorSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        # La validación se hace en el método validate() del serializer
        self.assertIn('non_field_errors', serializer.errors)
    
    def test_author_serializer_future_dates(self):
        """Test serializer con fechas futuras"""
        from django.utils import timezone
        from datetime import timedelta
        
        future_date = timezone.now().date() + timedelta(days=1)
        data = {
            'name': 'New Author',
            'birth_date': str(future_date)
        }
        serializer = AuthorSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        # La validación se hace en el método validate() del serializer
        self.assertIn('non_field_errors', serializer.errors)


class PublisherSerializerTest(BaseTestCase):
    """Tests para PublisherSerializer"""
    
    def test_publisher_serializer_valid_data(self):
        """Test serializer con datos válidos"""
        data = {
            'name': 'New Publisher',
            'country': 'France',
            'foundation_year': 1995
        }
        serializer = PublisherSerializer(data=data)
        self.assertTrue(serializer.is_valid())
    
    def test_publisher_serializer_invalid_year(self):
        """Test serializer con año inválido"""
        from django.utils import timezone
        
        future_year = timezone.now().year + 1
        data = {
            'name': 'New Publisher',
            'foundation_year': future_year
        }
        serializer = PublisherSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('foundation_year', serializer.errors)


class BookWriteSerializerTest(BaseTestCase):
    """Tests para BookWriteSerializer"""
    
    def test_book_serializer_valid_data(self):
        """Test serializer con datos válidos"""
        data = {
            'title': 'New Book',
            'isbn': '978-0-987-65432-1',
            'synopsis': 'Test synopsis',
            'publication_date': '2020-01-01',
            'pages': 300,
            'publisher': self.publisher.id,
            'authors': [self.author.id],
            'genres': [self.genre.id]
        }
        serializer = BookWriteSerializer(data=data)
        self.assertTrue(serializer.is_valid())
    
    def test_book_serializer_invalid_isbn(self):
        """Test serializer con ISBN inválido"""
        data = {
            'title': 'New Book',
            'isbn': '123',  # ISBN muy corto
            'publisher': self.publisher.id
        }
        serializer = BookWriteSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('isbn', serializer.errors)
    
    def test_book_serializer_valid_isbn_with_dashes(self):
        """Test serializer con ISBN válido con guiones"""
        data = {
            'title': 'New Book',
            'isbn': '978-0-987-65432-1',  # ISBN con guiones
            'publisher': self.publisher.id
        }
        serializer = BookWriteSerializer(data=data)
        self.assertTrue(serializer.is_valid())
    
    def test_book_serializer_invalid_url(self):
        """Test serializer con URL inválida"""
        data = {
            'title': 'New Book',
            'isbn': '978-0-987-65432-1',
            'cover_image_url': 'invalid-url',  # URL inválida
            'publisher': self.publisher.id
        }
        serializer = BookWriteSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('cover_image_url', serializer.errors)


class ReviewWriteSerializerTest(BaseTestCase):
    """Tests para ReviewWriteSerializer"""
    
    def test_review_serializer_valid_data(self):
        """Test serializer con datos válidos"""
        data = {
            'review_text': 'This is a valid review with enough characters to pass validation.'
        }
        serializer = ReviewWriteSerializer(data=data)
        self.assertTrue(serializer.is_valid())
    
    def test_review_serializer_short_text(self):
        """Test serializer con texto muy corto"""
        data = {
            'review_text': 'Short'  # Muy corto
        }
        serializer = ReviewWriteSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        # La validación se hace en el método validate() del serializer
        self.assertIn('non_field_errors', serializer.errors)


class ReadingStatusWriteSerializerTest(BaseTestCase):
    """Tests para ReadingStatusWriteSerializer"""
    
    def test_reading_status_serializer_valid_data(self):
        """Test serializer con datos válidos"""
        data = {
            'book': self.book.id,
            'status': 'C',  # Cambiado a 'C' para permitir rating
            'rating': 4,
            'started_at': '2024-01-01',
            'finished_at': '2024-01-15'
        }
        serializer = ReadingStatusWriteSerializer(data=data)
        self.assertTrue(serializer.is_valid())
    
    def test_reading_status_serializer_invalid_dates(self):
        """Test serializer con fechas inválidas"""
        data = {
            'book': self.book.id,
            'status': 'R',
            'started_at': '2024-01-15',
            'finished_at': '2024-01-01'  # Finalización antes de inicio
        }
        serializer = ReadingStatusWriteSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        # La validación se hace en el método validate() del serializer
        self.assertIn('non_field_errors', serializer.errors)
    
    def test_reading_status_serializer_completed_without_finished_date(self):
        """Test serializer con estado completado sin fecha de finalización"""
        data = {
            'book': self.book.id,
            'status': 'C'  # Completado sin finished_at
        }
        serializer = ReadingStatusWriteSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        # La validación se hace en el método validate() del serializer
        self.assertIn('non_field_errors', serializer.errors)
    
    def test_reading_status_serializer_not_started_with_dates(self):
        """Test serializer con estado no iniciado con fechas"""
        data = {
            'book': self.book.id,
            'status': 'N',
            'started_at': '2024-01-01'  # No iniciado con fecha
        }
        serializer = ReadingStatusWriteSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        # La validación se hace en el método validate() del serializer
        self.assertIn('non_field_errors', serializer.errors)


class BookshelfWriteSerializerTest(BaseTestCase):
    """Tests para BookshelfWriteSerializer"""
    
    def test_bookshelf_serializer_valid_data(self):
        """Test serializer con datos válidos"""
        data = {
            'name': 'New Bookshelf',
            'description': 'New description'
        }
        serializer = BookshelfWriteSerializer(data=data)
        self.assertTrue(serializer.is_valid())
    
    def test_bookshelf_serializer_empty_name(self):
        """Test serializer con nombre vacío"""
        data = {
            'name': '',
            'description': 'New description'
        }
        serializer = BookshelfWriteSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)


class CommentWriteSerializerTest(BaseTestCase):
    """Tests para CommentWriteSerializer"""
    
    def test_comment_serializer_valid_data(self):
        """Test serializer con datos válidos"""
        data = {
            'comment_text': 'This is a valid comment.'
        }
        serializer = CommentWriteSerializer(data=data)
        self.assertTrue(serializer.is_valid())
    
    def test_comment_serializer_short_text(self):
        """Test serializer con texto muy corto"""
        data = {
            'comment_text': 'OK'  # Muy corto
        }
        serializer = CommentWriteSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        # La validación se hace en el método validate() del serializer
        self.assertIn('non_field_errors', serializer.errors)
    
    def test_comment_serializer_with_parent_comment(self):
        """Test serializer con comentario padre"""
        data = {
            'comment_text': 'This is a reply comment.',
            'parent_comment': self.comment.id
        }
        # Pasar contexto con review_id para que funcione el filtrado
        context = {'review_id': self.review.id}
        serializer = CommentWriteSerializer(data=data, context=context)
        self.assertTrue(serializer.is_valid())
    
    def test_comment_serializer_self_parent_validation(self):
        """Test validación de comentario como su propio padre"""
        # Crear instancia para simular actualización
        comment = Comment.objects.create(
            user=self.user,
            review=self.review,
            comment_text='Original comment'
        )
        
        data = {
            'comment_text': 'Updated comment',
            'parent_comment': comment.id
        }
        # Pasar contexto con review_id para que funcione el filtrado
        context = {'review_id': self.review.id}
        serializer = CommentWriteSerializer(instance=comment, data=data, context=context)
        # La validación se hace en el método validate_parent_comment del serializer
        self.assertFalse(serializer.is_valid())
        self.assertIn('parent_comment', serializer.errors)

"""
Tests unitarios para modelos
"""
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import date, timedelta
from api.models import Author, Publisher, Book, ReadingStatus, Review, Comment, Bookshelf
from api.tests.base import BaseTestCase


class AuthorModelTest(BaseTestCase):
    """Tests para el modelo Author"""
    
    def test_author_creation(self):
        """Test creación básica de autor"""
        author = Author.objects.create(
            name='New Author',
            birth_date='1990-01-01'
        )
        self.assertEqual(author.name, 'New Author')
        self.assertEqual(str(author), 'New Author')
    
    def test_author_clean_valid_dates(self):
        """Test validación de fechas válidas"""
        author = Author(
            name='Test Author',
            birth_date=date(1980, 1, 1),
            death_date=date(2020, 1, 1)
        )
        # No debe lanzar excepción
        author.clean()
    
    def test_author_clean_invalid_dates(self):
        """Test validación de fechas inválidas"""
        author = Author(
            name='Test Author',
            birth_date=date(2000, 1, 1),
            death_date=date(1990, 1, 1)  # Muerte antes de nacimiento
        )
        with self.assertRaises(ValidationError):
            author.clean()
    
    def test_author_clean_future_birth_date(self):
        """Test validación de fecha de nacimiento futura"""
        future_date = timezone.now().date() + timedelta(days=1)
        author = Author(
            name='Test Author',
            birth_date=future_date
        )
        with self.assertRaises(ValidationError):
            author.clean()
    
    def test_author_clean_future_death_date(self):
        """Test validación de fecha de muerte futura"""
        future_date = timezone.now().date() + timedelta(days=1)
        author = Author(
            name='Test Author',
            death_date=future_date
        )
        with self.assertRaises(ValidationError):
            author.clean()


class PublisherModelTest(BaseTestCase):
    """Tests para el modelo Publisher"""
    
    def test_publisher_creation(self):
        """Test creación básica de editorial"""
        publisher = Publisher.objects.create(
            name='New Publisher',
            country='France',
            foundation_year=1995
        )
        self.assertEqual(publisher.name, 'New Publisher')
        self.assertEqual(str(publisher), 'New Publisher')
    
    def test_publisher_clean_valid_year(self):
        """Test validación de año válido"""
        publisher = Publisher(
            name='Test Publisher',
            foundation_year=2000
        )
        # No debe lanzar excepción
        publisher.clean()
    
    def test_publisher_clean_future_year(self):
        """Test validación de año futuro"""
        future_year = timezone.now().year + 1
        publisher = Publisher(
            name='Test Publisher',
            foundation_year=future_year
        )
        with self.assertRaises(ValidationError):
            publisher.clean()


class BookModelTest(BaseTestCase):
    """Tests para el modelo Book"""
    
    def test_book_creation(self):
        """Test creación básica de libro"""
        book = Book.objects.create(
            title='New Book',
            isbn='978-0-987-65432-1',
            publisher=self.publisher
        )
        self.assertEqual(book.title, 'New Book')
        self.assertEqual(str(book), 'New Book')
    
    def test_book_clean_future_publication_date(self):
        """Test validación de fecha de publicación futura"""
        future_date = timezone.now().date() + timedelta(days=1)
        book = Book(
            title='Test Book',
            isbn='978-0-987-65432-1',
            publisher=self.publisher,
            publication_date=future_date
        )
        with self.assertRaises(ValidationError):
            book.clean()
    
    def test_book_clean_no_authors(self):
        """Test validación de libro sin autores"""
        book = Book(
            title='Test Book',
            isbn='978-0-987-65432-1',
            publisher=self.publisher
        )
        # No debe lanzar excepción al crear (antes de save)
        book.clean()


class ReadingStatusModelTest(BaseTestCase):
    """Tests para el modelo ReadingStatus"""
    
    def test_reading_status_creation(self):
        """Test creación básica de estado de lectura"""
        status = ReadingStatus.objects.create(
            user=self.user,
            book=self.book,
            status='R',
            started_at=date.today()
        )
        self.assertEqual(status.status, 'R')
        self.assertEqual(str(status), f'{self.user.username} - {self.book.title} - Reading')
    
    def test_reading_status_clean_invalid_dates(self):
        """Test validación de fechas inválidas"""
        status = ReadingStatus(
            user=self.user,
            book=self.book,
            status='R',
            started_at=date.today(),
            finished_at=date.today() - timedelta(days=1)  # Finalización antes de inicio
        )
        with self.assertRaises(ValidationError):
            status.clean()
    
    def test_reading_status_clean_not_started_with_dates(self):
        """Test validación de estado no iniciado con fechas"""
        status = ReadingStatus(
            user=self.user,
            book=self.book,
            status='N',
            started_at=date.today()
        )
        with self.assertRaises(ValidationError):
            status.clean()
    
    def test_reading_status_clean_completed_without_finished_date(self):
        """Test validación de estado completado sin fecha de finalización"""
        status = ReadingStatus(
            user=self.user,
            book=self.book,
            status='C'
        )
        with self.assertRaises(ValidationError):
            status.clean()
    
    def test_reading_status_clean_reading_without_started_date(self):
        """Test validación de estado en lectura sin fecha de inicio"""
        status = ReadingStatus(
            user=self.user,
            book=self.book,
            status='R'
        )
        with self.assertRaises(ValidationError):
            status.clean()


class ReviewModelTest(BaseTestCase):
    """Tests para el modelo Review"""
    
    def test_review_creation(self):
        """Test creación básica de reseña"""
        # Crear un libro diferente para evitar conflicto con el setUp
        new_book = Book.objects.create(
            title='New Book for Review',
            isbn='978-0-987-65432-1',
            publisher=self.publisher
        )
        new_book.authors.add(self.author)
        
        review = Review.objects.create(
            user=self.user,
            book=new_book,
            review_text='This is a valid review with enough characters.'
        )
        self.assertEqual(review.review_text, 'This is a valid review with enough characters.')
        self.assertEqual(str(review), f'Review by {self.user.username} for {new_book.title}')
    
    def test_review_clean_empty_text(self):
        """Test validación de reseña vacía"""
        review = Review(
            user=self.user,
            book=self.book,
            review_text=''
        )
        with self.assertRaises(ValidationError):
            review.clean()
    
    def test_review_clean_short_text(self):
        """Test validación de reseña muy corta"""
        review = Review(
            user=self.user,
            book=self.book,
            review_text='Short'
        )
        with self.assertRaises(ValidationError):
            review.clean()


class CommentModelTest(BaseTestCase):
    """Tests para el modelo Comment"""
    
    def test_comment_creation(self):
        """Test creación básica de comentario"""
        comment = Comment.objects.create(
            user=self.user,
            review=self.review,
            comment_text='This is a valid comment.'
        )
        self.assertEqual(comment.comment_text, 'This is a valid comment.')
        self.assertEqual(str(comment), f'Comment ID: {comment.id}')
    
    def test_comment_clean_empty_text(self):
        """Test validación de comentario vacío"""
        comment = Comment(
            user=self.user,
            review=self.review,
            comment_text=''
        )
        with self.assertRaises(ValidationError):
            comment.clean()
    
    def test_comment_clean_short_text(self):
        """Test validación de comentario muy corto"""
        comment = Comment(
            user=self.user,
            review=self.review,
            comment_text='OK'
        )
        with self.assertRaises(ValidationError):
            comment.clean()
    
    def test_comment_clean_self_parent(self):
        """Test validación de comentario como su propio padre"""
        comment = Comment(
            user=self.user,
            review=self.review,
            comment_text='This is a valid comment.',
            parent_comment=self.comment
        )
        comment.id = self.comment.id  # Simular mismo ID
        with self.assertRaises(ValidationError):
            comment.clean()


class BookshelfModelTest(BaseTestCase):
    """Tests para el modelo Bookshelf"""
    
    def test_bookshelf_creation(self):
        """Test creación básica de estantería"""
        bookshelf = Bookshelf.objects.create(
            user=self.user,
            name='New Bookshelf',
            description='New description'
        )
        self.assertEqual(bookshelf.name, 'New Bookshelf')
        self.assertEqual(str(bookshelf), f'New Bookshelf by {self.user.username}')
    
    def test_bookshelf_unique_constraint(self):
        """Test constraint único de usuario-nombre"""
        with self.assertRaises(Exception):  # IntegrityError
            Bookshelf.objects.create(
                user=self.user,
                name='Test Bookshelf',  # Mismo nombre para mismo usuario
                description='Another description'
            )

"""
Base test classes and utilities
"""
from django.test import TestCase
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import date
from api.models import Author, Publisher, Genre, Book, ReadingStatus, Review, Bookshelf, Comment


class BaseTestCase(TestCase):
    """
    Base test case with common setup
    """
    
    def setUp(self):
        """Set up test data"""
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Create test author
        self.author = Author.objects.create(
            name='Test Author',
            birth_date=date(1980, 1, 1),
            biography='Test biography'
        )
        
        # Create test publisher
        self.publisher = Publisher.objects.create(
            name='Test Publisher',
            country='Spain',
            foundation_year=2000
        )
        
        # Create test genre
        self.genre = Genre.objects.create(
            name='Fiction',
            description='Fiction genre'
        )
        
        # Create test book
        self.book = Book.objects.create(
            title='Test Book',
            isbn='978-0-123-45678-9',
            synopsis='Test synopsis',
            publication_date=date(2020, 1, 1),
            pages=300,
            publisher=self.publisher
        )
        self.book.authors.add(self.author)
        self.book.genres.add(self.genre)
        
        # Create test bookshelf
        self.bookshelf = Bookshelf.objects.create(
            user=self.user,
            name='Test Bookshelf',
            description='Test description'
        )
        
        # Create test review
        self.review = Review.objects.create(
            user=self.user,
            book=self.book,
            review_text='This is a test review with enough characters to pass validation.'
        )
        
        # Create test comment
        self.comment = Comment.objects.create(
            user=self.user,
            review=self.review,
            comment_text='This is a test comment.'
        )


class BaseAPITestCase(APITestCase):
    """
    Base API test case with authentication
    """
    
    def setUp(self):
        """Set up test data and authentication"""
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Create another user for permission tests
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='testpass123'
        )
        
        # Get JWT token
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        
        # Set authentication header
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        
        # Create test data (same as BaseTestCase)
        self.author = Author.objects.create(
            name='Test Author',
            birth_date=date(1980, 1, 1),
            biography='Test biography'
        )
        
        self.publisher = Publisher.objects.create(
            name='Test Publisher',
            country='Spain',
            foundation_year=2000
        )
        
        self.genre = Genre.objects.create(
            name='Fiction',
            description='Fiction genre'
        )
        
        self.book = Book.objects.create(
            title='Test Book',
            isbn='978-0-123-45678-9',
            synopsis='Test synopsis',
            publication_date=date(2020, 1, 1),
            pages=300,
            publisher=self.publisher
        )
        self.book.authors.add(self.author)
        self.book.genres.add(self.genre)
        
        self.bookshelf = Bookshelf.objects.create(
            user=self.user,
            name='Test Bookshelf',
            description='Test description'
        )
        
        self.review = Review.objects.create(
            user=self.user,
            book=self.book,
            review_text='This is a test review with enough characters to pass validation.'
        )
        
        self.comment = Comment.objects.create(
            user=self.user,
            review=self.review,
            comment_text='This is a test comment.'
        )
    
    def authenticate_other_user(self):
        """Authenticate as other user"""
        refresh = RefreshToken.for_user(self.other_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(refresh.access_token)}')
    
    def remove_authentication(self):
        """Remove authentication"""
        self.client.credentials()

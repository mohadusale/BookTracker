from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db import IntegrityError
from .exceptions import DuplicateEntryException, ResourceNotFoundException
from .filters import BookFilter, ReviewFilter, CommentFilter, ReadingStatusFilter, BookshelfFilter
from .models import Author, Book, Genre, Review, ReadingStatus, Bookshelf, Comment, Publisher, BookshelfEntry  
from .serializers import (
    AuthorSerializer, 
    PublisherSerializer,
    BookReadSerializer, BookWriteSerializer, 
    GenreSerializer,
    ReviewReadSerializer, ReviewWriteSerializer,
    ReadingStatusReadSerializer, ReadingStatusWriteSerializer,
    BookshelfReadSerializer, BookshelfWriteSerializer,
    CommentReadSerializer, CommentWriteSerializer,
)
from .permissions import IsOwnerOrReadOnly

# AuthorViewSet
class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

# PublisherViewSet
class PublisherViewSet(viewsets.ModelViewSet):
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer

# BookViewSet
class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = BookFilter
    search_fields = ['title', 'synopsis', 'authors__name', 'publisher__name']
    ordering_fields = ['title', 'publication_date', 'pages', 'created_at']
    ordering = ['title']  # Ordenamiento por defecto
    
    # Usamos este método para elegir el serizalizador dinámicamente
    def get_serializer_class(self):
        # Si la acción es list (ver la lista) o retrieve (ver un solo libro)
        if self.action in ['list', 'retrieve']:
            return BookReadSerializer
        # Para cualquier otra acción (create, update, destroy)
        return BookWriteSerializer

# GenreViewSet
class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

# ReviewViewSet
class ReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ReviewFilter
    search_fields = ['review_text', 'book__title', 'user__username']
    ordering_fields = ['created_at', 'updated_at', 'book__title']
    ordering = ['-created_at']  # Más recientes primero

    def get_queryset(self):
        """
        Esta vista puede devolver una lista de todas las reseñas de un libro
        o una lista de las reseñas del usuario actual.
        """
        # Si la URL contiene un 'book_pk', filtramos por el libro
        if 'book_pk' in self.kwargs:
            return Review.objects.filter(book__id=self.kwargs['book_pk'])
        
        # Si no, devolvemos las reseñas del usuario actual
        if self.request.user.is_authenticated:
            return Review.objects.filter(user=self.request.user)
        
        # Si no está autenticado y no pide por libro, no devolvemos nada
        return Review.objects.none()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ReviewReadSerializer
        return ReviewWriteSerializer

    def create(self, request, *args, **kwargs):
        # Comprobamos si la petición viene de la ruta anidada
        if 'book_pk' not in self.kwargs:
            # Si no, prohibimos el método POST en esta URL
            raise MethodNotAllowed(
                'POST', 
                detail="No se pueden crear reseñas desde este endpoint. Usa /api/books/<book_pk>/reviews/"
            )
        
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            raise DuplicateEntryException("Ya has escrito una reseña para este libro")

    def perform_create(self, serializer):
        if 'book_pk' in self.kwargs:
            book = Book.objects.get(pk=self.kwargs['book_pk'])
            serializer.save(user=self.request.user, book=book)
        else:
            serializer.save(user=self.request.user)

# ReadingStatusViewSet
class ReadingStatusViewSet(viewsets.ModelViewSet):
    queryset = ReadingStatus.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ReadingStatusFilter
    search_fields = ['book__title', 'book__authors__name']
    ordering_fields = ['started_at', 'finished_at', 'book__title', 'rating']
    ordering = ['-started_at']  # Más recientes primero

    # Un usuario solo puede ver sus propios ReadingStatus
    def get_queryset(self):
        return ReadingStatus.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ReadingStatusReadSerializer
        return ReadingStatusWriteSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# BookshelfViewSet
class BookshelfViewSet(viewsets.ModelViewSet):
    queryset = Bookshelf.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = BookshelfFilter
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']  # Más recientes primero

    # Un usuario solo puede ver sus estanterías
    def get_queryset(self):
        return Bookshelf.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return BookshelfReadSerializer
        return BookshelfWriteSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_book(self, request, pk=None):
        bookshelf = self.get_object()
        book_id = request.data.get('book_id')

        if not book_id:
            return Response(
                {
                    'error': True,
                    'message': 'El ID del libro es requerido',
                    'details': {'book_id': ['Este campo es obligatorio']}
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            book = Book.objects.get(id=book_id)
            BookshelfEntry.objects.create(bookshelf=bookshelf, book=book)
            return Response(
                {
                    'error': False,
                    'message': 'Libro añadido a la estantería exitosamente',
                    'data': {
                        'book_id': book.id,
                        'book_title': book.title,
                        'bookshelf_id': bookshelf.id,
                        'bookshelf_name': bookshelf.name
                    }
                },
                status=status.HTTP_201_CREATED
            )
        except Book.DoesNotExist:
            raise ResourceNotFoundException("Libro no encontrado")
        except IntegrityError:
            raise DuplicateEntryException("El libro ya está en esta estantería")
    
    @action(detail=True, methods=['delete'])
    def remove_book(self, request, pk=None):
        bookshelf = self.get_object()
        book_id = request.query_params.get('book_id')
        
        if not book_id:
            return Response(
                {
                    'error': True,
                    'message': 'El ID del libro es requerido',
                    'details': {'book_id': ['Este campo es obligatorio']}
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            book = Book.objects.get(pk=book_id)
            entry = BookshelfEntry.objects.get(bookshelf=bookshelf, book=book)
            entry.delete()
            return Response(
                {
                    'error': False,
                    'message': 'Libro eliminado de la estantería exitosamente',
                    'data': {
                        'book_id': book.id,
                        'book_title': book.title,
                        'bookshelf_id': bookshelf.id,
                        'bookshelf_name': bookshelf.name
                    }
                },
                status=status.HTTP_200_OK
            )
        except Book.DoesNotExist:
            raise ResourceNotFoundException("Libro no encontrado")
        except BookshelfEntry.DoesNotExist:
            raise ResourceNotFoundException("El libro no está en esta estantería")
    
    @action(detail=True, methods=['get'])
    def books(self, request, pk=None):
        """Obtener todos los libros de una estantería"""
        bookshelf = self.get_object()
        books = Book.objects.filter(entries__bookshelf=bookshelf)
        serializer = BookReadSerializer(books, many=True)
        return Response(serializer.data)

# CommentViewSet
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = CommentFilter
    search_fields = ['comment_text', 'user__username']
    ordering_fields = ['created_at']
    ordering = ['created_at']  # Más antiguos primero (para conversación)

    def get_queryset(self):
        # Filtra los comentarios por el 'review_pk' de la URL
        # Ahora incluye tanto comentarios principales como respuestas
        return Comment.objects.filter(review__id=self.kwargs['review_pk'])
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return CommentReadSerializer
        return CommentWriteSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['review_id'] = self.kwargs.get('review_pk')
        return context

    def perform_create(self, serializer):
        review = Review.objects.get(pk=self.kwargs['review_pk'])
        serializer.save(user=self.request.user, review=review)

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from .models import Author, Book, Genre, Review, ReadingStatus, Bookshelf, Comment
from .serializers import (
    AuthorSerializer, 
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

# BookViewSet
class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    
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

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# ReadingStatusViewSet
class ReadingStatusViewSet(viewsets.ModelViewSet):
    queryset = ReadingStatus.objects.all()
    permission_classes = [IsAuthenticated]

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

    # Un usuario solo puede ver sus estanterías
    def get_queryset(self):
        return Bookshelf.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return BookshelfReadSerializer
        return BookshelfWriteSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# CommentViewSet
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        # Filtra los comentarios por el 'review_pk' de la URL
        # Ahora incluye tanto comentarios principales como respuestas
        return Comment.objects.filter(review__id=self.kwargs['review_pk'])
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return CommentReadSerializer
        return CommentWriteSerializer

    def perform_create(self, serializer):
        review = Review.objects.get(pk=self.kwargs['review_pk'])
        serializer.save(user=self.request.user, review=review)

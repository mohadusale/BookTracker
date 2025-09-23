from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework.exceptions import MethodNotAllowed
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db import IntegrityError
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
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


# Endpoint para login personalizado
@api_view(['POST'])
@permission_classes([AllowAny])
def custom_login(request):
    """
    Endpoint para login que acepta email o username
    """
    try:
        # Obtener datos del request
        username_or_email = request.data.get('username')
        password = request.data.get('password')
        
        # Validar datos requeridos
        if not username_or_email or not password:
            return Response({
                'error': True,
                'message': 'Username/email y password son requeridos',
                'details': {
                    'username': ['Este campo es obligatorio'] if not username_or_email else [],
                    'password': ['Este campo es obligatorio'] if not password else []
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Intentar autenticar con username primero
        user = authenticate(username=username_or_email, password=password)
        
        # Si no funciona, intentar con email
        if user is None:
            try:
                user_obj = User.objects.get(email=username_or_email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass
        
        if user is not None:
            # Generar tokens JWT
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'error': False,
                'message': 'Login exitoso',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': True,
                'message': 'Credenciales inválidas',
                'details': {
                    'username': ['Username/email o password incorrectos'],
                    'password': ['Username/email o password incorrectos']
                }
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except Exception as e:
        return Response({
            'error': True,
            'message': 'Error interno del servidor',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Endpoint para registro de usuarios
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Endpoint para registrar nuevos usuarios
    """
    try:
        # Obtener datos del request
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        
        # Validar datos requeridos
        if not username or not email or not password:
            return Response({
                'error': True,
                'message': 'Username, email y password son requeridos',
                'details': {
                    'username': ['Este campo es obligatorio'] if not username else [],
                    'email': ['Este campo es obligatorio'] if not email else [],
                    'password': ['Este campo es obligatorio'] if not password else []
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar si el usuario ya existe
        if User.objects.filter(username=username).exists():
            return Response({
                'error': True,
                'message': 'El nombre de usuario ya existe',
                'details': {
                    'username': ['Este nombre de usuario ya está en uso']
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({
                'error': True,
                'message': 'El email ya está registrado',
                'details': {
                    'email': ['Este email ya está en uso']
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Crear el usuario
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        return Response({
            'error': False,
            'message': 'Usuario creado exitosamente',
            'data': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'date_joined': user.date_joined
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': True,
            'message': 'Error interno del servidor',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

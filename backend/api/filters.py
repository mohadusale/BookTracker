import django_filters
from .models import Book, Review, Comment, ReadingStatus, Bookshelf


class BookFilter(django_filters.FilterSet):
    """
    Filtros para libros
    """
    # Búsqueda por título
    title = django_filters.CharFilter(field_name='title', lookup_expr='icontains')
    
    # Filtro por género
    genres = django_filters.CharFilter(field_name='genres__name', lookup_expr='icontains')
    
    # Filtro por autor
    authors = django_filters.CharFilter(field_name='authors__name', lookup_expr='icontains')
    
    # Filtro por editorial
    publisher = django_filters.CharFilter(field_name='publisher__name', lookup_expr='icontains')
    
    # Filtro por año de publicación
    publication_year = django_filters.NumberFilter(field_name='publication_date__year')
    
    # Filtro por rango de páginas
    min_pages = django_filters.NumberFilter(field_name='pages', lookup_expr='gte')
    max_pages = django_filters.NumberFilter(field_name='pages', lookup_expr='lte')
    
    # Filtro por ISBN
    isbn = django_filters.CharFilter(field_name='isbn', lookup_expr='icontains')
    
    class Meta:
        model = Book
        fields = ['title', 'genres', 'authors', 'publisher', 'publication_year', 'min_pages', 'max_pages', 'isbn']


class ReviewFilter(django_filters.FilterSet):
    """
    Filtros para reviews
    """
    # Búsqueda por texto de reseña
    review_text = django_filters.CharFilter(field_name='review_text', lookup_expr='icontains')
    
    # Filtro por usuario
    user = django_filters.CharFilter(field_name='user__username', lookup_expr='icontains')
    
    # Filtro por libro
    book = django_filters.CharFilter(field_name='book__title', lookup_expr='icontains')
    
    # Filtro por fecha de creación
    created_after = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')
    
    class Meta:
        model = Review
        fields = ['review_text', 'user', 'book', 'created_after', 'created_before']


class CommentFilter(django_filters.FilterSet):
    """
    Filtros para comentarios
    """
    # Búsqueda por texto de comentario
    comment_text = django_filters.CharFilter(field_name='comment_text', lookup_expr='icontains')
    
    # Filtro por usuario
    user = django_filters.CharFilter(field_name='user__username', lookup_expr='icontains')
    
    # Filtro por fecha de creación
    created_after = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')
    
    class Meta:
        model = Comment
        fields = ['comment_text', 'user', 'created_after', 'created_before']


class ReadingStatusFilter(django_filters.FilterSet):
    """
    Filtros para estados de lectura
    """
    # Filtro por estado
    status = django_filters.ChoiceFilter(choices=ReadingStatus.STATUS_CHOICES)
    
    # Filtro por libro
    book = django_filters.CharFilter(field_name='book__title', lookup_expr='icontains')
    
    # Filtro por rating
    min_rating = django_filters.NumberFilter(field_name='rating', lookup_expr='gte')
    max_rating = django_filters.NumberFilter(field_name='rating', lookup_expr='lte')
    
    # Filtro por fechas
    started_after = django_filters.DateFilter(field_name='started_at', lookup_expr='gte')
    started_before = django_filters.DateFilter(field_name='started_at', lookup_expr='lte')
    finished_after = django_filters.DateFilter(field_name='finished_at', lookup_expr='gte')
    finished_before = django_filters.DateFilter(field_name='finished_at', lookup_expr='lte')
    
    class Meta:
        model = ReadingStatus
        fields = ['status', 'book', 'min_rating', 'max_rating', 'started_after', 'started_before', 'finished_after', 'finished_before']


class BookshelfFilter(django_filters.FilterSet):
    """
    Filtros para estanterías
    """
    # Búsqueda por nombre
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    
    # Búsqueda por descripción
    description = django_filters.CharFilter(field_name='description', lookup_expr='icontains')
    
    # Filtro por fecha de creación
    created_after = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')
    
    class Meta:
        model = Bookshelf
        fields = ['name', 'description', 'created_after', 'created_before']

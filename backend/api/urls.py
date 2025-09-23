from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedSimpleRouter
from .views import (
    AuthorViewSet, 
    PublisherViewSet,
    BookViewSet, 
    GenreViewSet,
    ReviewViewSet,
    ReadingStatusViewSet,
    BookshelfViewSet,
    CommentViewSet,
    register_user,
    custom_login,
)

# Crear el router
router = DefaultRouter()
router.register(r'authors', AuthorViewSet, basename='author')
router.register(r'publishers', PublisherViewSet, basename='publisher')
router.register(r'books', BookViewSet, basename='book')
router.register(r'genres', GenreViewSet, basename='genre')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'reading-statuses', ReadingStatusViewSet, basename='reading-status')
router.register(r'bookshelves', BookshelfViewSet, basename='bookshelf')

# Router anidad para 'books/{book_pk}/reviews/'
book_router = NestedSimpleRouter(router, r'books', lookup='book')
book_router.register(r'reviews', ReviewViewSet, basename='book-reviews')

# Routero anidado para 'reviews/{review_pk}/comments/'
review_router = NestedSimpleRouter(router, r'reviews', lookup='review')
review_router.register(r'comments', CommentViewSet, basename='review-comments')


# URL patterns
urlpatterns = [
    path('', include(router.urls)),
    path('', include(book_router.urls)),
    path('', include(review_router.urls)),
    path('users/register/', register_user, name='register_user'),
    path('users/login/', custom_login, name='custom_login'),
]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedSimpleRouter
from .views import (
    AuthorViewSet, 
    BookViewSet, 
    GenreViewSet,
    ReviewViewSet,
    ReadingStatusViewSet,
)

# Crear el router
router = DefaultRouter()
router.register(r'authors', AuthorViewSet, basename='author')
router.register(r'books', BookViewSet, basename='book')
router.register(r'genres', GenreViewSet, basename='genre')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'reading-statuses', ReadingStatusViewSet, basename='reading-status')

# Router anidad para 'books/{book_pk}/reviews/'
book_router = NestedSimpleRouter(router, r'books', lookup='book')
book_router.register(r'reviews', ReviewViewSet, basename='book-reviews')

# URL patterns
urlpatterns = [
    path('', include(router.urls)),
    path('', include(book_router.urls)),
]
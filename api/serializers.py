from rest_framework import serializers
from .models import (
    Author,
    Publisher,
    Genre,
    Book,
    ReadingStatus,
    Review,
    Bookshelf,
    Comment,
    BookshelfEntry,
)

# Author Serializers
class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'

# Book Serializers
# Serializador solo para leer datos de Books (GET)
class BookReadSerializer(serializers.ModelSerializer):
    # Usamos StringRelatedField para mostrar nombres legibles
    publisher = serializers.StringRelatedField()
    authors = serializers.StringRelatedField(many=True)
    genres = serializers.StringRelatedField(many=True)

    class Meta:
        model = Book
        fields = '__all__'

# Serializador para crear y actualizar Books (POST, PUT, PATCH)
class BookWriteSerializer(serializers.ModelSerializer):
    # Aquí no definimos los campos de relación, así que DRF
    # usará por defecte el campo PrimaryKeyRelatedField que nos da
    # el cuadro de selecció con IDs que necesitamos

    class Meta:
        model = Book
        fields = [
            'title', 'isbn', 'synopsis', 'publication_date', 'pages', 'cover_image_url',
            'publisher', 'authors', 'genres',
        ]

# Genre Serializers
class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'

# Review Serializers
class ReviewReadSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    book = serializers.StringRelatedField()
    
    class Meta:
        model = Review
        fields = '__all__'

class ReviewWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['book', 'review_text']

# ReadingStatus Serializers
class ReadingStatusReadSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    book = serializers.StringRelatedField()

    class Meta:
        model = ReadingStatus
        fields = '__all__'

class ReadingStatusWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadingStatus
        fields = ['book', 'status', 'rating', 'started_at', 'finished_at']

# Bookshelf Serializers
class BookshelfReadSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Bookshelf
        fields = '__all__'

class BookshelfWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookshelf
        fields = ['name','description']

# Comment Serializers
class CommentReadSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    parent_comment = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'

class CommentWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['comment_text', 'parent_comment']


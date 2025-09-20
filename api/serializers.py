from rest_framework import serializers
import re
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

# Validadores personalizados
def validate_isbn(value):
    """
    Valida que el ISBN tenga un formato correcto (ISBN-10 o ISBN-13)
    Permite guiones en cualquier posición
    """
    if not value:
        raise serializers.ValidationError("El ISBN es requerido")
    
    # Remover guiones para validar
    isbn_clean = re.sub(r'[-\s]', '', value)
    
    # Verificar que solo contenga dígitos (excepto el último que puede ser X para ISBN-10)
    if not re.match(r'^\d{9}[\dX]$|^\d{13}$', isbn_clean):
        raise serializers.ValidationError(
            "El ISBN debe tener 10 dígitos (ISBN-10) o 13 dígitos (ISBN-13). "
            "Se permiten guiones en cualquier posición. "
            "Ejemplos válidos: '0-123-45678-9', '978-0-123-45678-9', '0123456789'"
        )
    
    return value

def validate_url(value):
    """
    Valida que la URL tenga un formato correcto
    """
    if not value:
        return value  # Permitir URLs vacías
    
    url_pattern = re.compile(
        r'^https?://'  # http:// o https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # dominio
        r'localhost|'  # localhost
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # IP
        r'(?::\d+)?'  # puerto opcional
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    
    if not url_pattern.match(value):
        raise serializers.ValidationError("Formato de URL inválido. Debe empezar con http:// o https://")
    
    return value

# Author Serializers
class AuthorSerializer(serializers.ModelSerializer):
    picture_url = serializers.URLField(validators=[validate_url], required=False, allow_blank=True)
    
    class Meta:
        model = Author
        fields = '__all__'
    
    def validate(self, data):
        """
        Valida que la fecha de nacimiento sea anterior a la fecha de muerte
        """
        from django.utils import timezone
        
        birth_date = data.get('birth_date')
        death_date = data.get('death_date')
        today = timezone.now().date()
        
        if birth_date and death_date and birth_date >= death_date:
            raise serializers.ValidationError(
                "La fecha de nacimiento debe ser anterior a la fecha de muerte"
            )
        
        # Validar que las fechas no sean futuras
        if birth_date and birth_date > today:
            raise serializers.ValidationError(
                "La fecha de nacimiento no puede ser futura"
            )
        
        if death_date and death_date > today:
            raise serializers.ValidationError(
                "La fecha de fallecimiento no puede ser futura"
            )
        
        return data

# Publisher Serializers
class PublisherSerializer(serializers.ModelSerializer):
    logo_url = serializers.URLField(validators=[validate_url], required=False, allow_blank=True)
    
    class Meta:
        model = Publisher
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
    isbn = serializers.CharField(validators=[validate_isbn])
    cover_image_url = serializers.URLField(validators=[validate_url], required=False, allow_blank=True)

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
        fields = ['review_text']
    
    def validate(self, data):
        """
        Valida la lógica de negocio del Review
        """
        review_text = data.get('review_text')
        
        if not review_text or not review_text.strip():
            raise serializers.ValidationError(
                "La reseña no puede estar vacía"
            )
        
        if len(review_text.strip()) < 10:
            raise serializers.ValidationError(
                "La reseña debe tener al menos 10 caracteres"
            )
        
        return data

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
    
    def validate(self, data):
        """
        Valida la lógica de negocio del ReadingStatus
        """
        started_at = data.get('started_at')
        finished_at = data.get('finished_at')
        status = data.get('status')
        
        # Si hay fecha de finalización, debe ser posterior a la de inicio
        if started_at and finished_at and started_at >= finished_at:
            raise serializers.ValidationError(
                "La fecha de finalización debe ser posterior a la fecha de inicio"
            )
        
        # Si el estado es 'Completed', debe tener fecha de finalización
        if status == 'C' and not finished_at:
            raise serializers.ValidationError(
                "Un libro completado debe tener fecha de finalización"
            )
        
        # Si el estado es 'Not Started', no debe tener fechas
        if status == 'N' and (started_at or finished_at):
            raise serializers.ValidationError(
                "Un libro no iniciado no puede tener fechas de inicio o finalización"
            )
        
        return data

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
    parent_comment = serializers.PrimaryKeyRelatedField(
        queryset=Comment.objects.none(),  # Se establecerá dinámicamente
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = Comment
        fields = ['comment_text', 'parent_comment']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Filtrar parent_comment para que solo muestre comentarios de la review actual
        if 'context' in kwargs and 'review_id' in kwargs['context']:
            review_id = kwargs['context']['review_id']
            self.fields['parent_comment'].queryset = Comment.objects.filter(review_id=review_id)
    
    def validate(self, data):
        """
        Valida la lógica de negocio del Comment
        """
        comment_text = data.get('comment_text')
        
        if not comment_text or not comment_text.strip():
            raise serializers.ValidationError(
                "El comentario no puede estar vacío"
            )
        
        if len(comment_text.strip()) < 3:
            raise serializers.ValidationError(
                "El comentario debe tener al menos 3 caracteres"
            )
        
        return data
    
    def validate_parent_comment(self, value):
        """
        Valida que un comentario no pueda ser su propio padre
        """
        if value and self.instance and value.id == self.instance.id:
            raise serializers.ValidationError(
                "Un comentario no puede ser su propio padre"
            )
        return value


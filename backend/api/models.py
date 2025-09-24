from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.db.models.signals import m2m_changed
from django.dispatch import receiver

# Create your models here.
class Author(models.Model):
    name = models.CharField(max_length=255, help_text="Nombre completo del autor")
    birth_date = models.DateField(null=True, blank=True, help_text="Fecha de nacimiento")
    death_date = models.DateField(null=True, blank=True, help_text="Fecha de fallecimiento")
    biography = models.TextField(blank=True, help_text="Biografía del autor")
    picture_url = models.URLField(blank=True, help_text="URL de la imagen del autor")

    class Meta:
        ordering = ['name']
        verbose_name = 'Autor'
        verbose_name_plural = 'Autores'

    def clean(self):
        """
        Validaciones de negocio para el modelo Author
        """
        super().clean()
        
        # Validar que la fecha de nacimiento sea anterior a la de muerte
        if self.birth_date and self.death_date:
            if self.birth_date >= self.death_date:
                raise ValidationError({
                    'death_date': 'La fecha de fallecimiento debe ser posterior a la fecha de nacimiento.'
                })
        
        # Validar que las fechas no sean futuras
        today = timezone.now().date()
        if self.birth_date and self.birth_date > today:
            raise ValidationError({
                'birth_date': 'La fecha de nacimiento no puede ser futura.'
            })
        
        if self.death_date and self.death_date > today:
            raise ValidationError({
                'death_date': 'La fecha de fallecimiento no puede ser futura.'
            })

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Publisher(models.Model):
    name = models.CharField(max_length=255, unique=True, help_text="Nombre de la editorial")
    country = models.CharField(max_length=100, blank=True, help_text="País de origen")
    foundation_year = models.PositiveIntegerField(
        null=True, 
        blank=True, 
        validators=[MinValueValidator(1000), MaxValueValidator(2024)],
        help_text="Año de fundación"
    )
    logo_url = models.URLField(blank=True, help_text="URL del logo de la editorial")

    class Meta:
        ordering = ['name']
        verbose_name = 'Editorial'
        verbose_name_plural = 'Editoriales'

    def clean(self):
        """
        Validaciones de negocio para el modelo Publisher
        """
        super().clean()
        
        # Validar que el año de fundación no sea futuro
        if self.foundation_year:
            current_year = timezone.now().year
            if self.foundation_year > current_year:
                raise ValidationError({
                    'foundation_year': 'El año de fundación no puede ser futuro.'
                })

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=255, help_text="Título del libro")
    isbn = models.CharField(max_length=13, unique=True, help_text="ISBN del libro")
    synopsis = models.TextField(blank=True, help_text="Sinopsis del libro")
    publication_date = models.DateField(null=True, blank=True, help_text="Fecha de publicación")
    pages = models.PositiveIntegerField(
        null=True, 
        blank=True, 
        validators=[MinValueValidator(1), MaxValueValidator(10000)],
        help_text="Número de páginas"
    )
    cover_image_url = models.URLField(blank=True, help_text="URL de la portada")

    # Relationships
    publisher = models.ForeignKey(Publisher, on_delete=models.PROTECT, related_name='books')
    authors = models.ManyToManyField(Author, related_name='books', blank=True)
    genres = models.ManyToManyField(Genre, related_name='books', blank=True)

    class Meta:
        ordering = ['title']
        verbose_name = 'Libro'
        verbose_name_plural = 'Libros'

    def clean(self):
        """
        Validaciones de negocio para el modelo Book
        """
        super().clean()
        
        # Validar que la fecha de publicación no sea futura
        if self.publication_date:
            today = timezone.now().date()
            if self.publication_date > today:
                raise ValidationError({
                    'publication_date': 'La fecha de publicación no puede ser futura.'
                })
        
        # La validación de autores se hace en el método save() después de guardar

    def save(self, *args, **kwargs):
        # Validar fechas antes de guardar
        if self.publication_date:
            today = timezone.now().date()
            if self.publication_date > today:
                raise ValidationError({
                    'publication_date': 'La fecha de publicación no puede ser futura.'
                })
        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class ReadingStatus(models.Model):
    STATUS_CHOICES = [
        ('N', 'Not Started'),
        ('R', 'Reading'),
        ('C', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reading_statuses')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reading_statuses')
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, help_text="Estado de lectura")
    rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        null=True, 
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        help_text="Calificación del 0 al 5 (incrementos de 0.5)"
    ) 
    started_at = models.DateField(null=True, blank=True, help_text="Fecha de inicio de lectura")
    finished_at = models.DateField(null=True, blank=True, help_text="Fecha de finalización de lectura")

    class Meta:
        unique_together = ['user', 'book']
        verbose_name = 'Estado de Lectura'
        verbose_name_plural = 'Estados de Lectura'

    def clean(self):
        """
        Validaciones de negocio para el modelo ReadingStatus
        """
        super().clean()
        
        # Validar rating - solo valores específicos permitidos (0.5 es el mínimo)
        if self.rating is not None:
            valid_ratings = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
            if float(self.rating) not in valid_ratings:
                raise ValidationError({
                    'rating': f'La calificación debe ser uno de los siguientes valores: {valid_ratings} (0.5 es la calificación mínima)'
                })
        
        # Validar fechas
        if self.started_at and self.finished_at:
            if self.started_at >= self.finished_at:
                raise ValidationError({
                    'finished_at': 'La fecha de finalización debe ser posterior a la fecha de inicio.'
                })
        
        # Validar que las fechas no sean futuras
        today = timezone.now().date()
        if self.started_at and self.started_at > today:
            raise ValidationError({
                'started_at': 'La fecha de inicio no puede ser futura.'
            })
        
        if self.finished_at and self.finished_at > today:
            raise ValidationError({
                'finished_at': 'La fecha de finalización no puede ser futura.'
            })
        
        # Validar que solo los libros completados puedan tener calificación
        if self.rating is not None and self.status != 'C':
            raise ValidationError({
                'status': 'Solo los libros completados pueden tener calificación. El estado debe ser "Finalizado" para poder calificar.'
            })
        
        # Validar lógica de estado
        if self.status == 'N' and (self.started_at or self.finished_at):
            raise ValidationError({
                'status': 'Un libro no iniciado no puede tener fechas de inicio o finalización.'
            })
        
        if self.status == 'C' and not self.finished_at:
            raise ValidationError({
                'status': 'Un libro completado debe tener fecha de finalización.'
            })
        
        if self.status == 'R' and not self.started_at:
            raise ValidationError({
                'status': 'Un libro en lectura debe tener fecha de inicio.'
            })

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.book.title} - {self.get_status_display()}"

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reviews')
    review_text = models.TextField(help_text="Texto de la reseña")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'book']
        verbose_name = 'Reseña'
        verbose_name_plural = 'Reseñas'
    
    def clean(self):
        """
        Validaciones de negocio para el modelo Review
        """
        super().clean()
        
        # Validar que la reseña no esté vacía
        if not self.review_text or not self.review_text.strip():
            raise ValidationError({
                'review_text': 'La reseña no puede estar vacía.'
            })
        
        # Validar longitud mínima de la reseña
        if len(self.review_text.strip()) < 10:
            raise ValidationError({
                'review_text': 'La reseña debe tener al menos 10 caracteres.'
            })

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Review by {self.user.username} for {self.book.title}"

class Bookshelf(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookshelves")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'name']
    
    def __str__(self):
        return f"{self.name} by {self.user.username}"

class BookshelfEntry(models.Model):
    bookshelf = models.ForeignKey(Bookshelf, on_delete=models.CASCADE, related_name="entries")
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="entries")
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['bookshelf', 'book']

    def __str__(self):
        return f"{self.book.title} in {self.bookshelf.name}"

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    review = models.ForeignKey(Review, on_delete=models.CASCADE, related_name="comments")
    comment_text = models.TextField(help_text="Texto del comentario")
    created_at = models.DateTimeField(auto_now_add=True)

    # Para respuestas a comentarios
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, related_name="replies", null=True, blank=True)

    class Meta:
        verbose_name = 'Comentario'
        verbose_name_plural = 'Comentarios'

    def clean(self):
        """
        Validaciones de negocio para el modelo Comment
        """
        super().clean()
        
        # Validar que el comentario no esté vacío
        if not self.comment_text or not self.comment_text.strip():
            raise ValidationError({
                'comment_text': 'El comentario no puede estar vacío.'
            })
        
        # Validar longitud mínima del comentario
        if len(self.comment_text.strip()) < 3:
            raise ValidationError({
                'comment_text': 'El comentario debe tener al menos 3 caracteres.'
            })
        
        # Validar que un comentario no sea su propio padre
        if self.parent_comment and self.parent_comment.id == self.id:
            raise ValidationError({
                'parent_comment': 'Un comentario no puede ser su propio padre.'
            })

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Comment ID: {self.id}"


# Señal para validar que un libro tenga al menos un autor
@receiver(m2m_changed, sender=Book.authors.through)
def validate_book_authors(sender, instance, action, **kwargs):
    """
    Valida que un libro tenga al menos un autor después de cambios en la relación ManyToMany
    """
    if action in ['post_add', 'post_remove', 'post_clear'] and instance.pk:
        if not instance.authors.exists():
            raise ValidationError({
                'authors': 'El libro debe tener al menos un autor.'
            })

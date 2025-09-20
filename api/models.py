from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class Author(models.Model):
    name = models.CharField(max_length=255)
    birth_date = models.DateField(null=True, blank=True)
    death_date = models.DateField(null=True, blank=True)
    biography = models.TextField(blank=True)
    picture_url = models.URLField(blank=True)

    def __str__(self):
        return self.name

class Publisher(models.Model):
    name = models.CharField(max_length=255, unique=True)
    country = models.CharField(max_length=100, blank=True)
    foundation_year = models.PositiveIntegerField(null=True, blank=True)
    logo_url = models.URLField(blank=True)

    def __str__(self):
        return self.name

class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=255)
    isbn = models.CharField(max_length=13, unique=True)
    synopsis = models.TextField(blank=True)
    publication_date = models.DateField(null=True, blank=True)
    pages = models.PositiveIntegerField(null=True, blank=True)
    cover_image_url = models.URLField(blank=True)

    # Relationships
    publisher = models.ForeignKey(Publisher, on_delete=models.PROTECT, related_name='books')
    authors = models.ManyToManyField(Author, related_name='books')
    genres = models.ManyToManyField(Genre, related_name='books')

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
    status = models.CharField(max_length=1, choices=STATUS_CHOICES)
    rating = models.PositiveIntegerField(
        null=True, 
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    ) 
    started_at = models.DateField(null=True, blank=True)
    finished_at = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ['user', 'book']

    def __str__(self):
        return f"{self.user.username} - {self.book.title} - {self.get_status_display()}"

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reviews')
    review_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'book']
    
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
    comment_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    # Para respuestas a comentarios
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, related_name="replies", null=True, blank=True)

    def __str__(self):
        return f"Comment ID: {self.id} on Review ID: {self.review.id}"

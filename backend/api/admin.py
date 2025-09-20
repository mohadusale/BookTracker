from django.contrib import admin

from .models import (
    Author,
    Publisher,
    Genre,
    Book,
    ReadingStatus,
    Review,
    Bookshelf,
    BookshelfEntry,
    Comment,
)

admin.site.register(Author)
admin.site.register(Publisher)
admin.site.register(Genre)
admin.site.register(Book)
admin.site.register(ReadingStatus)
admin.site.register(Review)
admin.site.register(Bookshelf)
admin.site.register(BookshelfEntry)
admin.site.register(Comment)

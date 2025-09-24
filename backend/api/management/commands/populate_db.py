import requests
import pandas as pd
import time
from django.core.management.base import BaseCommand
from django.core.exceptions import ValidationError
from django.db import transaction
from api.models import Author, Publisher, Book
from datetime import datetime

# --- CONFIGURACIÓN ---
CSV_PATH = 'datasets/BX_Books.csv'  # Ruta a tu archivo CSV dentro del proyecto
START_ROW = 0  # Fila desde la que empezar (0 es el inicio)
END_ROW = 500  # Fila en la que parar (¡empieza con un número pequeño como 500 para probar!)


class Command(BaseCommand):
    help = 'Populate the database with books from a CSV file using Google Books API for enrichment'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('--- Iniciando el script de población de la base de datos ---'))

        # Leemos el CSV con pandas
        try:
            df = pd.read_csv(
                CSV_PATH,
                sep=';',
                encoding='latin-1',  # Esta codificación suele funcionar bien con este dataset
                on_bad_lines='skip',
                low_memory=False
            )
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f'Error: No se encontró el archivo CSV en la ruta: {CSV_PATH}'))
            return

        # Seleccionamos el rango de filas a procesar
        df_subset = df.iloc[START_ROW:END_ROW]

        # Iteramos sobre cada libro en nuestro subconjunto del CSV
        for index, row in df_subset.iterrows():
            isbn = str(row['ISBN']).strip()
            book_title_csv = row['Book-Title']
            
            self.stdout.write(f"\nProcesando fila {index}: ISBN {isbn} - Título (CSV): {book_title_csv}")

            # --- 1. LLAMADA A LA API DE GOOGLE BOOKS ---
            try:
                response = requests.get(f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}")
                response.raise_for_status()
                data = response.json()

                if 'items' not in data or not data['items']:
                    self.stdout.write(self.style.WARNING(f'  -> No se encontró información en Google Books para el ISBN {isbn}'))
                    continue

                book_info = data['items'][0]['volumeInfo']
                
            except requests.exceptions.RequestException as e:
                self.stdout.write(self.style.ERROR(f'  -> Error en la API para el ISBN {isbn}: {e}'))
                time.sleep(5) # Esperamos 5 segundos si la API falla
                continue
            
            # --- 2. USAMOS UNA TRANSACCIÓN ATÓMICA ---
            # Esto asegura que si algo falla, no se guarde nada a medias para este libro.
            try:
                with transaction.atomic():
                    # --- 3. OBTENER O CREAR LA EDITORIAL (Publisher) ---
                    publisher_name = book_info.get('publisher', row['Publisher'])
                    if not publisher_name or pd.isna(publisher_name):
                        self.stdout.write(self.style.WARNING(f'  -> Editorial no encontrada. Saltando libro.'))
                        continue

                    publisher, created = Publisher.objects.get_or_create(name=publisher_name)
                    if created:
                        self.stdout.write(f'  -> Editorial creada: "{publisher.name}"')

                    # --- 4. OBTENER O CREAR AUTORES (Authors) ---
                    author_names = book_info.get('authors', [row['Book-Author']])
                    if not author_names or pd.isna(author_names[0]):
                         self.stdout.write(self.style.WARNING(f'  -> Autor no encontrado. Saltando libro.'))
                         continue

                    book_authors = []
                    for author_name in author_names:
                        author, created = Author.objects.get_or_create(name=author_name)
                        book_authors.append(author)
                        if created:
                            self.stdout.write(f'  -> Autor creado: "{author.name}"')

                    # --- 5. CREAR EL LIBRO (Book) ---
                    # Evitamos duplicados por ISBN
                    if Book.objects.filter(isbn=isbn).exists():
                        self.stdout.write(self.style.NOTICE(f'  -> El libro con ISBN {isbn} ya existe en la BD.'))
                        continue

                    # Limpiamos la fecha de publicación
                    publication_date_str = book_info.get('publishedDate')
                    publication_date = None
                    if publication_date_str:
                        try:
                            # La API puede devolver 'YYYY-MM-DD', 'YYYY-MM', or 'YYYY'
                            if len(publication_date_str) == 4:
                                publication_date = datetime.strptime(f'{publication_date_str}-01-01', '%Y-%m-%d').date()
                            elif len(publication_date_str) == 7:
                                publication_date = datetime.strptime(f'{publication_date_str}-01', '%Y-%m-%d').date()
                            else:
                                publication_date = datetime.strptime(publication_date_str, '%Y-%m-%d').date()
                        except ValueError:
                            publication_date = None # Si la fecha está mal formateada

                    book = Book.objects.create(
                        title=book_info.get('title', book_title_csv),
                        isbn=isbn,
                        synopsis=book_info.get('description', ''),
                        publication_date=publication_date,
                        pages=book_info.get('pageCount'),
                        cover_image_url=book_info.get('imageLinks', {}).get('thumbnail', ''),
                        publisher=publisher
                    )

                    # Asignamos los autores a la relación ManyToMany
                    book.authors.set(book_authors)
                    
                    self.stdout.write(self.style.SUCCESS(f'  -> ¡Libro "{book.title}" guardado con éxito!'))

            except ValidationError as e:
                self.stdout.write(self.style.ERROR(f'  -> Error de validación de Django para el ISBN {isbn}: {e}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'  -> Error inesperado guardando en BD para el ISBN {isbn}: {e}'))

            # Pausa para no saturar la API
            time.sleep(0.5)

        self.stdout.write(self.style.SUCCESS('--- ¡Script finalizado! ---'))
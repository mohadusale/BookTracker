# BookTracker Backend API

[![Estado de la Build](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/mohadusale/booktracker)
[![Cobertura de Tests](https://img.shields.io/badge/coverage-95%25-success)](./TESTING.md)
[![Django Version](https://img.shields.io/badge/django-5.2-blue)](https://www.djangoproject.com/)
[![DRF Version](https://img.shields.io/badge/DRF-3.15-blue)](https://www.django-rest-framework.org/)

## 📖 Descripción General

Esta es la API RESTful para **BookTracker**, una aplicación diseñada para gestionar libros, estanterías de lectura, reseñas y mucho más. Construida con Django y Django REST Framework, esta API proporciona todos los endpoints necesarios para que la aplicación frontend funcione de manera eficiente y segura.

**Stack Tecnológico Principal:**
- Python
- Django & Django REST Framework (DRF)
- PostgreSQL
- Autenticación con JSON Web Tokens (JWT)
- Documentación de API con `drf-spectacular` (Swagger/OpenAPI)

## ✨ Características Principales

- ✅ **Autenticación Segura:** Registro de usuarios y autenticación basada en JWT, con un endpoint de login que acepta email o nombre de usuario.
- 📚 **Gestión de Libros:** CRUD completo para Libros, Autores, Editoriales y Géneros.
- ✍️ **Reseñas y Comentarios:** Sistema anidado para que los usuarios puedan escribir reseñas de libros y comentar en otras reseñas.
- 🗂️ **Estanterías Personales:** Creación de estanterías personalizadas para organizar colecciones de libros, con la capacidad de añadir y eliminar libros.
- 📊 **Seguimiento de Lectura:** Posibilidad de registrar el estado de lectura de un libro (pendiente, leyendo, completado) y añadir una calificación.
- 🔍 **Búsqueda y Filtrado:** Potentes filtros y sistema de búsqueda en los endpoints principales.
- 📄 **Documentación Automática:** Endpoints de Swagger y Redoc para una fácil exploración de la API.

## 🚀 Empezando

Sigue estas instrucciones para tener una copia del proyecto funcionando en tu máquina local para desarrollo y pruebas.

### **Prerrequisitos**

Asegúrate de tener instalado el siguiente software:
- Python (se recomienda 3.10+)
- `pip` y `venv`
- PostgreSQL

### **Instalación y Configuración**

1.  **Clona el repositorio:**
    ```sh
    git clone https://github.com/mohadusale/booktracker.git
    cd booktracker/backend
    ```

2.  **Crea y activa un entorno virtual:**
    ```sh
    # En Windows
    python -m venv venv
    .\\venv\\Scripts\\activate

    # En macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Instala las dependencias:**
    ```sh
    pip install -r requirements.txt
    ```
    *(Nota: si no tienes un `requirements.txt`, puedes generarlo con `pip freeze > requirements.txt`)*

4.  **Configura las variables de entorno:**
    Crea un archivo `.env` en el directorio `backend/` a partir del siguiente ejemplo:
    ```env
    # .env
    SECRET_KEY='tu_super_secreto_aqui'
    DEBUG=True

    # Configuración de la Base de Datos PostgreSQL
    DB_NAME='booktracker_db'
    DB_USER='booktracker_user'
    DB_PASSWORD='tu_contraseña_segura'
    DB_HOST='localhost'
    DB_PORT='5432'
    ```
    *(Asegúrate de crear la base de datos y el usuario en PostgreSQL con estas credenciales)*

5.  **Aplica las migraciones de la base de datos:**
    ```sh
    python manage.py migrate
    ```

6.  **(Opcional) Crea un superusuario para acceder al admin de Django:**
    ```sh
    python manage.py createsuperuser
    ```

### **Ejecutando el Servidor de Desarrollo**

Una vez configurado, puedes iniciar el servidor de desarrollo:
```sh
python manage.py runserver
```
La API estará disponible en `http://localhost:8000/api/`.

## 🧪 Ejecutando los Tests

El proyecto cuenta con una suite de tests completa para garantizar la calidad del código. Para más detalles, consulta el archivo `TESTING.md`.

Para ejecutar todos los tests, utiliza el script personalizado:
```sh
python run_tests.py
```

## 🗺️ Documentación de la API

La API está auto-documentada usando OpenAPI. Puedes explorar todos los endpoints disponibles de forma interactiva a través de:

- **Swagger UI:** `http://localhost:8000/api/docs/`
- **Redoc:** `http://localhost:8000/api/redoc/`

## 🏗️ Estructura del Proyecto

```
backend/
├── api/                # Aplicación principal de Django
│   ├── migrations/
│   ├── tests/          # Todos los tests unitarios y de integración
│   ├── models.py       # Modelos de la base de datos
│   ├── serializers.py  # Serializers de DRF
│   ├── views.py        # Vistas y lógica de los endpoints
│   ├── urls.py         # Rutas de la API
│   └── ...
├── booktracker/        # Configuración del proyecto Django
│   ├── settings.py     # Configuración principal
│   └── urls.py         # Rutas principales del proyecto
├── manage.py           # Script de gestión de Django
├── run_tests.py        # Script para ejecutar tests
└── TESTING.md          # Guía detallada de testing
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue los siguientes pasos:
1.  Haz un Fork del proyecto.
2.  Crea tu rama de funcionalidad (`git checkout -b feature/AmazingFeature`).
3.  Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4.  Haz push a la rama (`git push origin feature/AmazingFeature`).
5.  Abre una Pull Request.

## 📜 Licencia

Distribuido bajo la Licencia MIT.
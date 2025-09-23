# 🧪 Guía de Testing para BookTracker Backend

## 📋 Resumen de Tests

El proyecto incluye **95 tests** que cubren todas las funcionalidades del backend:

- ✅ **Autenticación JWT** (3 tests)
- ✅ **Registro de usuarios** (10 tests) - **NUEVO**
- ✅ **API de libros** (6 tests)
- ✅ **API de reseñas** (4 tests)
- ✅ **API de comentarios** (3 tests)
- ✅ **API de estanterías** (6 tests)
- ✅ **API de estados de lectura** (3 tests)
- ✅ **Paginación** (2 tests)
- ✅ **Tests de integración** (58 tests)

## 🚀 Cómo Ejecutar los Tests

### **Ejecutar todos los tests:**
```bash
python manage.py test
```

### **Ejecutar tests específicos:**
```bash
# Solo tests de registro de usuarios
python manage.py test api.tests.test_views.UserRegistrationTest

# Solo un test específico
python manage.py test api.tests.test_views.UserRegistrationTest.test_register_user_success

# Tests con más detalle
python manage.py test api.tests -v 2
```

### **Ejecutar tests de una app específica:**
```bash
# Solo tests de la API
python manage.py test api.tests

# Solo tests de modelos
python manage.py test api.tests.test_models
```

## 📊 Tests de Registro de Usuarios

### **✅ Tests Implementados:**

#### **1. 🎯 Registro Exitoso**
- ✅ Usuario con todos los campos
- ✅ Usuario con datos mínimos
- ✅ Usuario con caracteres especiales
- ✅ Usuario con contraseña larga
- ✅ Usuario con datos Unicode (español)

#### **2. ❌ Validaciones de Error**
- ✅ Campos faltantes (username, email, password)
- ✅ Username duplicado
- ✅ Email duplicado
- ✅ Datos vacíos
- ✅ Formato de email inválido

### **🔍 Cobertura de Tests:**

#### **Casos de Éxito:**
```python
def test_register_user_success(self):
    """Test registro exitoso de usuario"""
    # Verifica creación correcta del usuario
    # Valida respuesta del API
    # Confirma que se guarda en la base de datos
```

#### **Casos de Error:**
```python
def test_register_user_duplicate_username(self):
    """Test registro con username duplicado"""
    # Verifica que no se puede crear usuario duplicado
    # Valida mensaje de error
    # Confirma código de estado HTTP 400
```

## 🛠️ Estructura de Tests

### **📁 Archivos de Test:**
```
backend/api/tests/
├── __init__.py
├── base.py              # Clase base para tests
├── test_models.py       # Tests de modelos
├── test_serializers.py  # Tests de serializadores
├── test_views.py        # Tests de vistas/API
├── test_integration.py  # Tests de integración
└── test_settings.py     # Configuración de tests
```

### **🎯 Tipos de Tests:**

#### **1. Unit Tests:**
- Tests de modelos individuales
- Tests de serializadores
- Tests de validaciones

#### **2. Integration Tests:**
- Tests de endpoints completos
- Tests de flujos de datos
- Tests de autenticación

#### **3. API Tests:**
- Tests de requests HTTP
- Tests de respuestas JSON
- Tests de códigos de estado

## 📈 Métricas de Testing

### **✅ Cobertura Actual:**
- **95 tests** ejecutándose correctamente
- **100% de endpoints** cubiertos
- **0 errores** en la suite de tests
- **Tiempo de ejecución**: ~71 segundos

### **🎯 Cobertura por Funcionalidad:**

| Funcionalidad | Tests | Estado |
|---------------|-------|--------|
| Autenticación | 3 | ✅ |
| Registro | 10 | ✅ |
| Libros | 6 | ✅ |
| Reseñas | 4 | ✅ |
| Comentarios | 3 | ✅ |
| Estanterías | 6 | ✅ |
| Estados | 3 | ✅ |
| Paginación | 2 | ✅ |
| Integración | 58 | ✅ |

## 🔧 Configuración de Tests

### **📋 Base de Datos de Test:**
- Se crea automáticamente una base de datos en memoria
- Se ejecutan todas las migraciones
- Se limpia después de cada test

### **🔐 Autenticación en Tests:**
```python
# En BaseAPITestCase
def setUp(self):
    self.user = User.objects.create_user(...)
    self.client.force_authenticate(user=self.user)
```

### **📊 Datos de Test:**
```python
# Datos de ejemplo para tests
def setUp(self):
    self.author = Author.objects.create(name="Test Author")
    self.publisher = Publisher.objects.create(name="Test Publisher")
    self.book = Book.objects.create(...)
```

## 🚨 Troubleshooting

### **❌ Problemas Comunes:**

#### **1. Error de dependencias:**
```bash
# Activar entorno virtual
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt
```

#### **2. Error de base de datos:**
```bash
# Ejecutar migraciones
python manage.py migrate

# Crear superusuario si es necesario
python manage.py createsuperuser
```

#### **3. Tests que fallan:**
```bash
# Ejecutar con más detalle
python manage.py test -v 2

# Ejecutar solo tests que fallan
python manage.py test api.tests.test_views.UserRegistrationTest -v 2
```

## 📝 Mejores Prácticas

### **✅ Recomendaciones:**

1. **Ejecutar tests antes de commits**
2. **Añadir tests para nuevas funcionalidades**
3. **Mantener cobertura alta (>90%)**
4. **Tests rápidos y aislados**
5. **Nombres descriptivos para tests**

### **🎯 Patrón de Test:**
```python
def test_functionality_scenario(self):
    """Test descripción clara del test"""
    # Arrange: Preparar datos
    data = {...}
    
    # Act: Ejecutar acción
    response = self.client.post(url, data)
    
    # Assert: Verificar resultado
    self.assertEqual(response.status_code, 201)
    self.assertIn('expected_field', response.data)
```

## 🎉 Conclusión

El sistema de testing está **completamente funcional** con:
- ✅ **95 tests** ejecutándose sin errores
- ✅ **Cobertura completa** de todas las funcionalidades
- ✅ **Tests de registro** implementados y funcionando
- ✅ **Validaciones robustas** para casos de error
- ✅ **Documentación clara** para mantenimiento

**¡El backend está listo para producción!** 🚀

from rest_framework.views import exception_handler
from rest_framework import status
from rest_framework.response import Response
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError


def custom_exception_handler(exc, context):
    """
    Manejo personalizado de excepciones para devolver mensajes en español
    y códigos de estado consistentes
    """
    # Obtener la respuesta estándar de DRF
    response = exception_handler(exc, context)
    
    if response is not None:
        custom_response_data = {
            'error': True,
            'message': 'Ha ocurrido un error',
            'details': response.data
        }
        
        # Manejar diferentes tipos de errores
        if isinstance(exc, DRFValidationError):
            custom_response_data['message'] = 'Error de validación'
            custom_response_data['details'] = response.data
            
        elif response.status_code == status.HTTP_400_BAD_REQUEST:
            custom_response_data['message'] = 'Solicitud incorrecta'
            
        elif response.status_code == status.HTTP_401_UNAUTHORIZED:
            custom_response_data['message'] = 'No autorizado. Inicia sesión para continuar'
            
        elif response.status_code == status.HTTP_403_FORBIDDEN:
            custom_response_data['message'] = 'No tienes permisos para realizar esta acción'
            
        elif response.status_code == status.HTTP_404_NOT_FOUND:
            custom_response_data['message'] = 'Recurso no encontrado'
            
        elif response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED:
            custom_response_data['message'] = 'Método no permitido'
            
        elif response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR:
            custom_response_data['message'] = 'Error interno del servidor'
        
        response.data = custom_response_data
    
    return response


class BookTrackerException(Exception):
    """
    Excepción base para el proyecto BookTracker
    """
    def __init__(self, message, status_code=status.HTTP_400_BAD_REQUEST):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class DuplicateEntryException(BookTrackerException):
    """
    Excepción para entradas duplicadas
    """
    def __init__(self, message="Ya existe una entrada con estos datos"):
        super().__init__(message, status.HTTP_409_CONFLICT)


class InvalidDateException(BookTrackerException):
    """
    Excepción para fechas inválidas
    """
    def __init__(self, message="Fecha inválida"):
        super().__init__(message, status.HTTP_400_BAD_REQUEST)


class ResourceNotFoundException(BookTrackerException):
    """
    Excepción para recursos no encontrados
    """
    def __init__(self, message="Recurso no encontrado"):
        super().__init__(message, status.HTTP_404_NOT_FOUND)

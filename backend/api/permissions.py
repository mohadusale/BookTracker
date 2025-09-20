from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado para permitir que solo los dueños
    de un objeto puedan editarlo.
    """
    def has_object_permission(self, request, view, obj):
        # Permisos de lectura para todos
        if request.method in permissions.SAFE_METHODS:
            return True
        # Permisos de escritura para el dueño del objeto
        return obj.user == request.user
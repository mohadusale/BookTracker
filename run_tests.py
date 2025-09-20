#!/usr/bin/env python
"""
Script para ejecutar tests con configuración específica
"""
import os
import sys
import django
from django.conf import settings
from django.test.utils import get_runner

if __name__ == "__main__":
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.tests.test_settings')
    django.setup()
    
    TestRunner = get_runner(settings)
    test_runner = TestRunner()
    
    # Ejecutar tests
    failures = test_runner.run_tests([
        "api.tests.test_models",
        "api.tests.test_serializers", 
        "api.tests.test_views",
        "api.tests.test_integration"
    ])
    
    if failures:
        sys.exit(bool(failures))

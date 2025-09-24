import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string, allValues?: { [key: string]: string }) => string | null;
}

export interface FieldError {
  message: string;
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
}

export interface FormErrors {
  [key: string]: FieldError | null;
}

export interface FormValidationConfig {
  [key: string]: ValidationRule;
}

// Validadores específicos
export const validators = {
  required: (value: string): string | null => {
    if (!value || value.trim() === '') {
      return 'Este campo es obligatorio';
    }
    return null;
  },

  email: (value: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return 'Por favor ingresa un email válido';
    }
    return null;
  },

  minLength: (min: number) => (value: string): string | null => {
    if (value && value.length < min) {
      return `Debe tener al menos ${min} caracteres`;
    }
    return null;
  },

  maxLength: (max: number) => (value: string): string | null => {
    if (value && value.length > max) {
      return `No puede tener más de ${max} caracteres`;
    }
    return null;
  },

  pattern: (regex: RegExp, message: string) => (value: string): string | null => {
    if (value && !regex.test(value)) {
      return message;
    }
    return null;
  },

  passwordStrength: (value: string): string | null => {
    if (!value) return null;
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isLongEnough = value.length >= 8;
    
    if (!isLongEnough) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (!hasUpperCase) {
      return 'La contraseña debe contener al menos una letra mayúscula';
    }
    
    if (!hasLowerCase) {
      return 'La contraseña debe contener al menos una letra minúscula';
    }
    
    if (!hasNumbers) {
      return 'La contraseña debe contener al menos un número';
    }
    
    if (!hasSpecialChar) {
      return 'La contraseña debe contener al menos un carácter especial (!@#$%^&*...)';
    }
    
    return null;
  },

  passwordMatch: (value: string, allValues?: { [key: string]: string }): string | null => {
    if (!value) return null;
    
    // Buscar el campo 'password' en todos los valores
    const passwordField = allValues?.password;
    if (passwordField && value !== passwordField) {
      return 'Las contraseñas no coinciden';
    }
    
    return null;
  },
};

export const useFormValidation = (config: FormValidationConfig) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = useCallback((name: string, value: string, allValues?: { [key: string]: string }): FieldError | null => {
    const rules = config[name];
    if (!rules) return null;

    // Aplicar todas las reglas de validación
    for (const [ruleName, ruleValue] of Object.entries(rules)) {
      let error: string | null = null;

      switch (ruleName) {
        case 'required':
          if (ruleValue) {
            error = validators.required(value);
          }
          break;
        case 'email':
          if (ruleValue) {
            error = validators.email(value);
          }
          break;
        case 'minLength':
          if (typeof ruleValue === 'number') {
            error = validators.minLength(ruleValue)(value);
          }
          break;
        case 'maxLength':
          if (typeof ruleValue === 'number') {
            error = validators.maxLength(ruleValue)(value);
          }
          break;
        case 'pattern':
          if (ruleValue instanceof RegExp) {
            error = validators.pattern(ruleValue, 'Formato inválido')(value);
          }
          break;
        case 'custom':
          if (typeof ruleValue === 'function') {
            error = ruleValue(value, allValues);
          }
          break;
      }

      if (error) {
        return {
          message: error,
          type: ruleName as FieldError['type'],
        };
      }
    }

    return null;
  }, [config]);

  const validateForm = useCallback((values: { [key: string]: string }): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    for (const [name, value] of Object.entries(values)) {
      const error = validateField(name, value, values);
      newErrors[name] = error;
      if (error) {
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [validateField]);

  const handleFieldChange = useCallback((name: string, value: string, allValues?: { [key: string]: string }) => {
    // Solo validar si el campo ya ha sido tocado
    if (touched[name]) {
      const error = validateField(name, value, allValues);
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  }, [validateField, touched]);

  const handleFieldBlur = useCallback((name: string, value: string, allValues?: { [key: string]: string }) => {
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value, allValues);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, [validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const getFieldError = useCallback((name: string): string | null => {
    return errors[name]?.message || null;
  }, [errors]);

  const hasFieldError = useCallback((name: string): boolean => {
    return !!errors[name];
  }, [errors]);

  const isFieldTouched = useCallback((name: string): boolean => {
    return !!touched[name];
  }, [touched]);

  return {
    errors,
    validateForm,
    handleFieldChange,
    handleFieldBlur,
    clearErrors,
    getFieldError,
    hasFieldError,
    isFieldTouched,
  };
};

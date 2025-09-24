import React, { useState, useEffect } from 'react';
import { FormIcon, FormInput, FormButton, FormNavigation, LoadingSpinner, ErrorMessage, PasswordInput } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { useForm, type FormValidationConfig } from '../../hooks/useForm';

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading, error, clearError } = useAuth();

  // Configuración de validación
  const validationConfig: FormValidationConfig = {
    username: {
      required: true,
    },
    password: {
      required: true,
    },
  };

  const { fields, validateForm, clearErrors } = useForm(
    { username: '', password: '' },
    validationConfig
  );

  // Limpiar errores cuando el formulario se monte
  useEffect(() => {
    clearError();
    clearErrors();
  }, []); // Solo ejecutar una vez al montar

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    clearErrors();
    
    // Validar todos los campos
    const formData = { 
      username: fields.username.value, 
      password: fields.password.value 
    };
    const isValid = validateForm(formData);
    
    if (!isValid) {
      return;
    }
    
    try {
      await login(formData);
      // La redirección se manejará en el componente padre
    } catch (error) {
      // El error ya se maneja en el contexto
      console.error('Error en login:', error);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      <FormIcon>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </FormIcon>

      <h2 className="text-2xl font-bold text-neutral-900 text-center mb-6">
        Welcome Back!
      </h2>

      {error && (
        <ErrorMessage 
          message={error} 
          onClose={clearError}
          className="mb-4"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          type="text"
          placeholder="Username o Email"
          value={fields.username.value}
          onChange={fields.username.onChange}
          onBlur={fields.username.onBlur}
          required
          disabled={isLoading}
          error={fields.username.error}
          hasError={fields.username.hasError}
        />

        <PasswordInput
          placeholder="Password"
          value={fields.password.value}
          onChange={fields.password.onChange}
          onBlur={fields.password.onBlur}
          required
          disabled={isLoading}
          error={fields.password.error}
          hasError={fields.password.hasError}
        />

        {/* Recordarme */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              disabled={isLoading}
            />
            <span className="ml-2 text-sm text-neutral-700 font-medium tracking-wide">Remember me</span>
          </label>
          
          <button
            type="button"
            className="text-sm text-primary-600 hover:text-primary-500 focus:outline-none focus:underline font-medium tracking-wide transition-colors duration-200"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        <FormButton type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Iniciando sesión...
            </div>
          ) : (
            'Log In'
          )}
        </FormButton>
      </form>

      <FormNavigation
        question="Don't have you account?"
        linkText="Sign Up"
        onToggle={onToggleMode}
      />
    </div>
  );
};

export default LoginForm;

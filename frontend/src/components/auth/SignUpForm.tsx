import React, { useEffect } from 'react';
import { FormIcon, FormInput, FormButton, FormNavigation, LoadingSpinner, ErrorMessage, PasswordInput, PasswordStrength } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { useForm, type FormValidationConfig } from '../../hooks/useForm';
import { validators } from '../../hooks/useFormValidation';

interface SignUpFormProps {
  onToggleMode: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onToggleMode }) => {
  const { signUp, isLoading, error, clearError } = useAuth();

  // Configuración de validación
  const validationConfig: FormValidationConfig = {
    username: {
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      required: true,
      email: true,
    },
    password: {
      required: true,
      custom: validators.passwordStrength,
    },
    confirmPassword: {
      required: true,
      custom: validators.passwordMatch,
    },
  };

  const { fields, validateForm, clearErrors } = useForm(
    { username: '', name: '', email: '', password: '', confirmPassword: '' },
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
    
    // Validar todos los campos (incluyendo la validación de contraseñas coincidentes)
    const formData = { 
      username: fields.username.value, 
      name: fields.name.value, 
      email: fields.email.value, 
      password: fields.password.value, 
      confirmPassword: fields.confirmPassword.value 
    };
    const isValid = validateForm(formData);
    
    if (!isValid) {
      return;
    }
    
    try {
      await signUp(formData);
      // La redirección se manejará en el componente padre
    } catch (error) {
      // El error ya se maneja en el contexto
      console.error('Error en signup:', error);
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
        Create Your Account!
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
          placeholder="Username"
          value={fields.username.value}
          onChange={fields.username.onChange}
          onBlur={fields.username.onBlur}
          required
          disabled={isLoading}
          error={fields.username.error}
          hasError={fields.username.hasError}
        />

        <FormInput
          type="text"
          placeholder="Full Name"
          value={fields.name.value}
          onChange={fields.name.onChange}
          onBlur={fields.name.onBlur}
          required
          disabled={isLoading}
          error={fields.name.error}
          hasError={fields.name.hasError}
        />

        <FormInput
          type="email"
          placeholder="Email"
          value={fields.email.value}
          onChange={fields.email.onChange}
          onBlur={fields.email.onBlur}
          required
          disabled={isLoading}
          error={fields.email.error}
          hasError={fields.email.hasError}
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
          showStrength={true}
          strengthComponent={
            <PasswordStrength 
              password={fields.password.value} 
              className="mt-2"
            />
          }
        />

        <PasswordInput
          placeholder="Confirm Password"
          value={fields.confirmPassword.value}
          onChange={fields.confirmPassword.onChange}
          onBlur={fields.confirmPassword.onBlur}
          required
          disabled={isLoading}
          error={fields.confirmPassword.error}
          hasError={fields.confirmPassword.hasError}
        />

        <FormButton type="submit" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Creando cuenta...
            </div>
          ) : (
            'Sign Up'
          )}
        </FormButton>
      </form>

      <FormNavigation
        question="Already have an account?"
        linkText="Log In"
        onToggle={onToggleMode}
      />
    </div>
  );
};

export default SignUpForm;

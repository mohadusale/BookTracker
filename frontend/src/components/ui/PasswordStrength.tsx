import React from 'react';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, className = '' }) => {
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    // Calcular puntuación
    score = Object.values(checks).filter(Boolean).length;
    
    if (score <= 2) {
      return { score, label: 'Débil', color: 'bg-error-500' };
    } else if (score <= 3) {
      return { score, label: 'Media', color: 'bg-warning-500' };
    } else if (score <= 4) {
      return { score, label: 'Buena', color: 'bg-primary-500' };
    } else {
      return { score, label: 'Fuerte', color: 'bg-success-500' };
    }
  };

  const strength = getPasswordStrength(password);
  const percentage = (strength.score / 5) * 100;

  if (!password) return null;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-neutral-600">Fortaleza de la contraseña:</span>
        <span className={`text-sm font-medium ${
          strength.score <= 2 ? 'text-error-600' : 
          strength.score <= 3 ? 'text-warning-600' : 
          strength.score <= 4 ? 'text-primary-600' : 'text-success-600'
        }`}>
          {strength.label}
        </span>
      </div>
      
      <div className="w-full bg-neutral-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="mt-2 text-xs text-neutral-500">
        <div className="grid grid-cols-2 gap-1">
          <div className={`flex items-center space-x-1 ${
            password.length >= 8 ? 'text-success-600' : 'text-neutral-400'
          }`}>
            <span>{password.length >= 8 ? '✓' : '○'}</span>
            <span>8+ caracteres</span>
          </div>
          <div className={`flex items-center space-x-1 ${
            /[a-z]/.test(password) ? 'text-success-600' : 'text-neutral-400'
          }`}>
            <span>{/[a-z]/.test(password) ? '✓' : '○'}</span>
            <span>Minúscula</span>
          </div>
          <div className={`flex items-center space-x-1 ${
            /[A-Z]/.test(password) ? 'text-success-600' : 'text-neutral-400'
          }`}>
            <span>{/[A-Z]/.test(password) ? '✓' : '○'}</span>
            <span>Mayúscula</span>
          </div>
          <div className={`flex items-center space-x-1 ${
            /\d/.test(password) ? 'text-success-600' : 'text-neutral-400'
          }`}>
            <span>{/\d/.test(password) ? '✓' : '○'}</span>
            <span>Número</span>
          </div>
          <div className={`flex items-center space-x-1 ${
            /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-success-600' : 'text-neutral-400'
          }`}>
            <span>{/[!@#$%^&*(),.?":{}|<>]/.test(password) ? '✓' : '○'}</span>
            <span>Especial</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrength;

import React, { useState } from 'react';
import { FormIcon, FormInput, FormButton, FormNavigation } from '../ui';

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      <FormIcon>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </FormIcon>

      <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
        Welcome Back!
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <FormInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <FormButton type="submit">
          Log In
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

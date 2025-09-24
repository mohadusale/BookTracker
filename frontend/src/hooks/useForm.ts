import { useState, useCallback } from 'react';
import { useFormValidation, type FormValidationConfig } from './useFormValidation';

export type { FormValidationConfig } from './useFormValidation';

export interface FormField {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error: string | null;
  hasError: boolean;
  setValue: (value: string) => void;
}

export interface UseFormReturn {
  fields: Record<string, FormField>;
  validateForm: (values: Record<string, string>) => boolean;
  clearErrors: () => void;
  setFieldValue: (fieldName: string, value: string) => void;
  getFieldValue: (fieldName: string) => string;
}

export const useForm = <T extends Record<string, string>>(
  initialValues: T,
  validationConfig: FormValidationConfig
): UseFormReturn => {
  const [values, setValues] = useState<T>(initialValues);
  
  const {
    validateForm,
    handleFieldChange,
    handleFieldBlur,
    getFieldError,
    hasFieldError,
    clearErrors: clearValidationErrors,
  } = useFormValidation(validationConfig);

  const createField = useCallback((fieldName: keyof T): FormField => {
    return {
      value: values[fieldName] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const updatedValues = { ...values, [fieldName]: newValue };
        setValues(updatedValues);
        handleFieldChange(fieldName as string, newValue, updatedValues);
      },
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
        handleFieldBlur(fieldName as string, e.target.value, values);
      },
      error: getFieldError(fieldName as string),
      hasError: hasFieldError(fieldName as string),
      setValue: (value: string) => {
        const updatedValues = { ...values, [fieldName]: value };
        setValues(updatedValues);
        handleFieldChange(fieldName as string, value, updatedValues);
      }
    };
  }, [values, handleFieldChange, handleFieldBlur, getFieldError, hasFieldError]);

  const fields = Object.keys(initialValues).reduce((acc, fieldName) => {
    acc[fieldName] = createField(fieldName as keyof T);
    return acc;
  }, {} as Record<string, FormField>);

  const clearErrors = useCallback(() => {
    clearValidationErrors();
  }, [clearValidationErrors]);

  const setFieldValue = useCallback((fieldName: string, value: string) => {
    const updatedValues = { ...values, [fieldName]: value };
    setValues(updatedValues);
    handleFieldChange(fieldName, value, updatedValues);
  }, [handleFieldChange, values]);

  const getFieldValue = useCallback((fieldName: string) => {
    return values[fieldName as keyof T] || '';
  }, [values]);

  const validateFormValues = useCallback((formValues: Record<string, string>) => {
    return validateForm(formValues);
  }, [validateForm]);

  return {
    fields,
    validateForm: validateFormValues,
    clearErrors,
    setFieldValue,
    getFieldValue,
  };
};

/**
 * FormTextField.tsx
 * Reusable text input component for form fields.
 * Integrates with React Hook Form for state management.
 * Handles: Rendering, validation errors, accessibility, Tailwind styling.
 */

import React, { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface FormTextFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  error?: FieldError;
  disabled?: boolean;
  maxLength?: number;
  type?: 'text' | 'email' | 'number';
}

/**
 * Reusable text input field with error display and accessibility.
 * @param name - Field name for form integration
 * @param label - Display label above input
 * @param error - React Hook Form error object
 * @returns Rendered form field with Tailwind styling
 */
export const FormTextField = forwardRef<HTMLInputElement, FormTextFieldProps & React.InputHTMLAttributes<HTMLInputElement>>(
  (
    {
      name,
      label,
      placeholder,
      error,
      disabled = false,
      maxLength,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const errorId = `${name}-error`;
    const hasError = !!error;

    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            ${hasError ? 'border-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            transition-colors
          `}
          {...props}
        />
        {hasError && (
          <p id={errorId} className="mt-1 text-sm text-red-500">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

FormTextField.displayName = 'FormTextField';

export default FormTextField;

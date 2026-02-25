/**
 * FormTextArea.tsx
 * Reusable textarea component for longer text inputs.
 * Mirrors FormTextField API for consistency.
 */

import React, { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface FormTextAreaProps {
  name: string;
  label?: string;
  placeholder?: string;
  error?: FieldError;
  disabled?: boolean;
  maxLength?: number;
  rows?: number;
}

/**
 * Reusable textarea field with error display and accessibility.
 */
export const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  (
    {
      name,
      label,
      placeholder,
      error,
      disabled = false,
      maxLength,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const errorId = `${name}-error`;
    const hasError = !!error;
    const charCount = (props.value as string | undefined)?.length || 0;

    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={name}
          name={name}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          rows={rows}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm font-sans
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            ${hasError ? 'border-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            transition-colors resize-none
          `}
          {...props}
        />
        <div className="mt-1 flex justify-between items-start">
          {hasError && (
            <p id={errorId} className="text-sm text-red-500">
              {error.message}
            </p>
          )}
          {maxLength && (
            <p className="text-xs text-gray-500 ml-auto">
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

FormTextArea.displayName = 'FormTextArea';

export default FormTextArea;

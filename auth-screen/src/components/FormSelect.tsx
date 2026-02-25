/**
 * FormSelect.tsx
 * Reusable select/dropdown component for form fields.
 */

import React, { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface FormSelectProps {
  name: string;
  label?: string;
  options: Array<{ value: string; label: string }>;
  error?: FieldError;
  disabled?: boolean;
}

/**
 * Reusable select field with error display and accessibility.
 */
export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps & React.SelectHTMLAttributes<HTMLSelectElement>>(
  (
    {
      name,
      label,
      options,
      error,
      disabled = false,
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
        <select
          ref={ref}
          id={name}
          name={name}
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
        >
          <option value="">Select {label?.toLowerCase() || 'option'}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {hasError && (
          <p id={errorId} className="mt-1 text-sm text-red-500">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';

export default FormSelect;

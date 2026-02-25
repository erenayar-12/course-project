# STORY-2.1 Implementation Guide

**Story ID:** STORY-2.1  
**Title:** Create Idea Submission Form with Validation  
**Start Date:** February 27, 2026  
**Estimated Duration:** 3-5 days  
**Owner:** [Developer Name]  
**Status:** IMPLEMENTATION READY

---

## I. Pre-Implementation Checklist

Before starting implementation, verify:

```
☐ Clarifications from CLARIFICATION-STORY-2.1.md approved by Product Owner
☐ EPIC-1 (Auth0 integration) is production-ready
☐ PostgreSQL + Prisma setup complete
☐ React 18 + Vite + TypeScript configured
☐ Jest + React Testing Library installed
☐ ESLint + Prettier configured
☐ Git feature branch created: git checkout -b feat/story-2.1-submission-form
☐ This implementation guide reviewed
```

---

## II. Architecture Overview

### Component Hierarchy

```
App
└── IdeaSubmissionForm (NEW)
    ├── FormTextField (NEW - reusable)
    ├── FormTextArea (NEW - reusable)
    ├── FormSelect (NEW - reusable)
    ├── SubmitButton
    └── CancelButton
```

### Data Flow

```
User Input
    ↓
React Hook Form (state management)
    ↓
Zod Validation (client-side)
    ↓
IdeasService.submitIdea()
    ↓
POST /api/ideas (with JWT token)
    ↓
Backend Validation (server-side)
    ↓
Prisma.idea.create()
    ↓
PostgreSQL Database
    ↓
Success Response (201) / Error Response (400/500)
    ↓
Toast Notification
    ↓
Redirect to Dashboard
```

### Technology Stack Summary

| Layer | Technology | Package |
|-------|-----------|---------|
| State Management | React Hook Form | `react-hook-form` |
| Validation | Zod | `zod` |
| HTTP Client | Axios | `axios` |
| UI Components | shadcn/ui | `@shadcn/ui/components` |
| Styling | Tailwind CSS | `tailwindcss` |
| Testing | Jest + RTL | `jest`, `@testing-library/react` |
| Backend Validation | Zod | `zod` |
| Database | Prisma | `@prisma/client` |

---

## III. Step-by-Step Implementation

### Phase 1: Setup & Scaffolding (30 minutes)

#### Step 1.1: Install Dependencies

```bash
# Frontend dependencies
npm install react-hook-form zod @hookform/resolvers axios

# Backend dependencies (if not already installed)
npm install zod multer

# Testing setup (if not already done)
npm install --save-dev @testing-library/react @testing-library/jest-dom jest ts-jest @types/jest msw
```

#### Step 1.2: Create Directory Structure

```bash
# Frontend
mkdir -p src/components/ideaSubmissionForm
mkdir -p src/components/__tests__
mkdir -p src/types/__tests__
mkdir -p src/services/__tests__
mkdir -p src/hooks

# Backend  
mkdir -p src/api/routes/__tests__
mkdir -p src/services/__tests__
```

#### Step 1.3: Verify Prisma Schema

Update `prisma/schema.prisma` to include ideas table:

```prisma
model Idea {
  id        String   @id @default(cuid())
  userId    String
  title     String   @db.VarChar(100)
  description String @db.Text
  category  String   @db.VarChar(50)
  status    String   @db.VarChar(20) @default("Submitted")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([status])
}
```

Run migration:

```bash
npx prisma migrate dev --name add_ideas_table
```

---

### Phase 2: Frontend Implementation (2-3 days)

#### Step 2.1: Create Zod Validation Schema

**File:** `src/types/ideaSchema.ts`

```typescript
/**
 * Zod validation schema for idea submission form.
 * Enforces business rules: title (3-100 chars), description (10-2000 chars), category enum.
 * Used for both client-side (React Hook Form) and server-side validation.
 */

import { z } from 'zod';

export const IDEA_CATEGORIES = ['Innovation', 'Process Improvement', 'Cost Reduction', 'Other'] as const;

export const ideaSubmissionSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must not exceed 2000 characters'),
  category: z
    .enum(IDEA_CATEGORIES)
    .refine(v => v !== '', 'Category is required'),
});

export type IdeaSubmissionFormData = z.infer<typeof ideaSubmissionSchema>;

/**
 * API response type after successful submission.
 */
export interface IdeaResponse {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  status: 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected';
  createdAt: string;
  updatedAt: string;
}

/**
 * Error response from API.
 */
export interface ErrorResponse {
  success: false;
  error: string;
  details?: Array<{ field: string; message: string }>;
}
```

**Test File:** `src/types/__tests__/ideaSchema.test.ts`

```typescript
/**
 * Unit tests for idea submission form validation schema.
 * RED-GREEN-REFACTOR: Write tests BEFORE implementation.
 */

import { ideaSubmissionSchema } from '../ideaSchema';

describe('ideaSubmissionSchema', () => {
  describe('title validation', () => {
    it('should accept valid title (3-100 chars)', () => {
      const result = ideaSubmissionSchema.safeParse({
        title: 'Modern Title',
        description: 'Valid description with enough characters',
        category: 'Innovation'
      });
      expect(result.success).toBe(true);
    });

    it('should reject title shorter than 3 characters', () => {
      const result = ideaSubmissionSchema.safeParse({
        title: 'AB',
        description: 'Valid description with enough characters',
        category: 'Innovation'
      });
      expect(result.success).toBe(false);
    });

    it('should reject title longer than 100 characters', () => {
      const result = ideaSubmissionSchema.safeParse({
        title: 'A'.repeat(101),
        description: 'Valid description with enough characters',
        category: 'Innovation'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('description validation', () => {
    it('should accept valid description (10-2000 chars)', () => {
      const result = ideaSubmissionSchema.safeParse({
        title: 'Valid Title',
        description: '1234567890',
        category: 'Innovation'
      });
      expect(result.success).toBe(true);
    });

    it('should reject description shorter than 10 characters', () => {
      const result = ideaSubmissionSchema.safeParse({
        title: 'Valid Title',
        description: 'Short',
        category: 'Innovation'
      });
      expect(result.success).toBe(false);
    });

    it('should reject description longer than 2000 characters', () => {
      const result = ideaSubmissionSchema.safeParse({
        title: 'Valid Title',
        description: 'A'.repeat(2001),
        category: 'Innovation'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('category validation', () => {
    it('should accept valid categories', () => {
      const validCategories = ['Innovation', 'Process Improvement', 'Cost Reduction', 'Other'];
      validCategories.forEach(cat => {
        const result = ideaSubmissionSchema.safeParse({
          title: 'Valid Title',
          description: 'Valid description',
          category: cat
        });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid category', () => {
      const result = ideaSubmissionSchema.safeParse({
        title: 'Valid Title',
        description: 'Valid description',
        category: 'InvalidCategory'
      });
      expect(result.success).toBe(false);
    });
  });

  // RUN TESTS FIRST: npm test -- ideaSchema.test.ts
});
```

**Run Tests (RED phase):**
```bash
npm test -- src/types/__tests__/ideaSchema.test.ts
# Tests will FAIL (code not implemented yet) ✓ RED
```

---

#### Step 2.2: Create Reusable Form Components

**File:** `src/components/formTextField.tsx`

```typescript
/**
 * FormTextField: Reusable text input component for form fields.
 * Integrates with React Hook Form for state management.
 * Handles: Rendering, validation errors, accessibility, Tailwind styling.
 */

import React from 'react';
import { FieldError } from 'react-hook-form';

interface FormTextFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  error?: FieldError;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
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
export const FormTextField: React.FC<FormTextFieldProps> = ({
  name,
  label,
  placeholder,
  error,
  disabled = false,
  value,
  onChange,
  onBlur,
  maxLength,
  type = 'text',
}) => {
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
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
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
      />
      {hasError && (
        <p id={errorId} className="mt-1 text-sm text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default FormTextField;
```

**File:** `src/components/formTextArea.tsx`

```typescript
/**
 * FormTextArea: Reusable textarea component for longer text inputs.
 * Mirrors FormTextField API for consistency.
 */

import React from 'react';
import { FieldError } from 'react-hook-form';

interface FormTextAreaProps {
  name: string;
  label?: string;
  placeholder?: string;
  error?: FieldError;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
  rows?: number;
}

/**
 * Reusable textarea field with error display and accessibility.
 */
export const FormTextArea: React.FC<FormTextAreaProps> = ({
  name,
  label,
  placeholder,
  error,
  disabled = false,
  value,
  onChange,
  onBlur,
  maxLength,
  rows = 4,
}) => {
  const errorId = `${name}-error`;
  const hasError = !!error;
  const charCount = value?.length || 0;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
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
};

export default FormTextArea;
```

**File:** `src/components/formSelect.tsx`

```typescript
/**
 * FormSelect: Reusable select/dropdown component for form fields.
 */

import React from 'react';
import { FieldError } from 'react-hook-form';

interface FormSelectProps {
  name: string;
  label?: string;
  options: Array<{ value: string; label: string }>;
  error?: FieldError;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

/**
 * Reusable select field with error display and accessibility.
 */
export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  options,
  error,
  disabled = false,
  value,
  onChange,
  onBlur,
}) => {
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
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
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
      >
        <option value="">Select {label?.toLowerCase() || 'option'}</option>
        {options.map(opt => (
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
};

export default FormSelect;
```

---

#### Step 2.3: Create Ideas Service

**File:** `src/services/ideas.service.ts`

```typescript
/**
 * IdeasService: Business logic for idea submission and management.
 * Handles: API communication, error handling, data transformation.
 */

import axios, { AxiosError } from 'axios';
import { IdeaSubmissionFormData, IdeaResponse, ErrorResponse } from '@/types/ideaSchema';

class IdeasService {
  private api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Submits a new idea to the backend.
   * @param data - Form data validated by Zod schema
   * @returns Promise<IdeaResponse> Created idea with ID and metadata
   * @throws Error with user-friendly message on failure
   */
  async submitIdea(data: IdeaSubmissionFormData): Promise<IdeaResponse> {
    try {
      // Get JWT token from localStorage (set by Auth0 from EPIC-1)
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Make API request with JWT in Authorization header
      const response = await this.api.post<{ success: boolean; data: IdeaResponse }>(
        '/ideas',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error('Failed to submit idea');
      }

      return response.data.data;
    } catch (error) {
      // Handle different error scenarios
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;

        if (axiosError.response?.status === 400) {
          // Validation error - includes field details
          const errorData = axiosError.response.data;
          throw new Error(errorData.error || 'Validation failed');
        }

        if (axiosError.response?.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }

        if (axiosError.response?.status === 500) {
          throw new Error('Server error. Please try again later.');
        }

        if (axiosError.code === 'ECONNABORTED') {
          throw new Error('Request timeout. Please try again.');
        }

        if (!axiosError.response) {
          throw new Error('Network error. Please check your connection.');
        }
      }

      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  }

  /**
   * Fetches ideas for current user with pagination and filters.
   * Used by STORY-2.3 (Dashboard).
   */
  async getIdeas(params?: { page?: number; limit?: number; status?: string; sortBy?: string }) {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Authentication required');

    return this.api.get('/ideas', {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export const ideasService = new IdeasService();
export default ideasService;
```

**Test File:** `src/services/__tests__/ideas.service.test.ts`

```typescript
/**
 * Unit tests for IdeasService.
 * Mocks axios to test business logic in isolation.
 */

import { ideasService } from '../ideas.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('IdeasService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('submitIdea', () => {
    it('should submit idea with valid data', async () => {
      // ARRANGE
      localStorage.setItem('auth_token', 'test-token');
      const ideaData = {
        title: 'Valid Title',
        description: 'Valid description text',
        category: 'Innovation' as const,
      };

      mockedAxios.create().post.mockResolvedValue({
        data: {
          success: true,
          data: {
            id: 'idea-123',
            userId: 'user-123',
            ...ideaData,
            status: 'Submitted',
            createdAt: '2026-02-25T10:00:00Z',
            updatedAt: '2026-02-25T10:00:00Z',
          },
        },
      });

      // ACT
      const result = await ideasService.submitIdea(ideaData);

      // ASSERT
      expect(result.id).toBe('idea-123');
      expect(result.status).toBe('Submitted');
    });

    it('should throw error when no auth token', async () => {
      // ARRANGE
      localStorage.removeItem('auth_token');

      // ACT & ASSERT
      await expect(ideasService.submitIdea({
        title: 'Title',
        description: 'Description',
        category: 'Innovation' as const,
      })).rejects.toThrow('Authentication required');
    });
  });
});
```

---

#### Step 2.4: Create Main Form Component

**File:** `src/components/ideaSubmissionForm.tsx`

```typescript
/**
 * IdeaSubmissionForm: Main form component for idea submission.
 * Integrates React Hook Form, Zod validation, and IdeasService.
 * 
 * Form Flow:
 * 1. User fills fields (title, description, category)
 * 2. React Hook Form tracks state
 * 3. On blur/change: Zod validates client-side
 * 4. Submit button enabled only when valid
 * 5. On submit: API call to backend
 * 6. Success: Show toast + redirect to dashboard
 * 7. Error: Show error message + keep form editable
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { ideaSubmissionSchema, IdeaSubmissionFormData, IDEA_CATEGORIES } from '@/types/ideaSchema';
import { FormTextField } from './formTextField';
import { FormTextArea } from './formTextArea';
import { FormSelect } from './formSelect';
import { ideasService } from '@/services/ideas.service';
import { useToast } from '@/hooks/useToast'; // Assuming this hook exists

interface IdeaSubmissionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Idea submission form component.
 * @param onSuccess - Callback after successful submission
 * @param onCancel - Callback when cancel is clicked
 */
export const IdeaSubmissionForm: React.FC<IdeaSubmissionFormProps> = ({ onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // React Hook Form setup with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
  } = useForm<IdeaSubmissionFormData>({
    resolver: zodResolver(ideaSubmissionSchema),
    mode: 'onBlur', // Validate on blur instead of onChange for UX
  });

  const titleValue = watch('title');
  const descValue = watch('description');

  /**
   * Form submission handler.
   * Validates, calls API, shows feedback, and redirects.
   */
  const onSubmit = async (data: IdeaSubmissionFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await ideasService.submitIdea(data);

      // Success feedback
      showToast({
        type: 'success',
        message: 'Idea submitted successfully!',
        duration: 3000,
      });

      // Callback to parent
      onSuccess?.();

      // Reset form and redirect after short delay
      reset();
      setTimeout(() => {
        navigate('/ideas');
      }, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to submit idea';
      setSubmitError(message);
      showToast({
        type: 'error',
        message,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle form cancellation.
   * Clears form and optionally calls parent callback.
   */
  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm('Discard unsaved changes?');
      if (!confirmed) return;
    }
    reset();
    onCancel?.();
  };

  /**
   * Handle keyboard shortcuts.
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Submit an Idea</h1>

      {/* General error message */}
      {submitError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800 text-sm">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} noValidate>
        {/* Title Field */}
        <FormTextField
          {...register('title')}
          name="title"
          label="Idea Title"
          placeholder="Give your idea a clear, concise title"
          error={errors.title}
          disabled={isSubmitting}
          maxLength={100}
          value={titleValue}
        />

        {/* Description Field */}
        <FormTextArea
          {...register('description')}
          name="description"
          label="Description"
          placeholder="Provide detailed description of your idea (minimum 10 characters)"
          error={errors.description}
          disabled={isSubmitting}
          maxLength={2000}
          rows={6}
          value={descValue}
        />

        {/* Category Dropdown */}
        <FormSelect
          {...register('category')}
          name="category"
          label="Category"
          options={IDEA_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
          error={errors.category}
          disabled={isSubmitting}
        />

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !isValid || !isDirty}
            className={`
              px-6 py-2 bg-blue-600 text-white rounded-md font-medium
              hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors flex items-center gap-2
            `}
          >
            {isSubmitting ? (
              <>
                <span className="inline-block animate-spin">⟳</span>
                Submitting...
              </>
            ) : (
              'Submit Idea'
            )}
          </button>
        </div>
      </form>

      {/* Keyboard shortcuts hint */}
      <p className="mt-6 text-xs text-gray-500 text-center">
        💡 Tip: Press Escape to cancel • Enter on any field to submit
      </p>
    </div>
  );
};

export default IdeaSubmissionForm;
```

**Test File:** `src/components/__tests__/ideaSubmissionForm.test.tsx`

```typescript
/**
 * Unit tests for IdeaSubmissionForm component.
 * Tests rendering, validation display, user interactions.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import IdeaSubmissionForm from '../ideaSubmissionForm';

const renderForm = (props = {}) => {
  return render(
    <BrowserRouter>
      <IdeaSubmissionForm {...props} />
    </BrowserRouter>
  );
};

describe('IdeaSubmissionForm', () => {
  describe('rendering', () => {
    it('should render all form fields', () => {
      // ARRANGE & ACT
      renderForm();

      // ASSERT
      expect(screen.getByLabelText(/idea title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    });

    it('should render Submit and Cancel buttons', () => {
      // ARRANGE & ACT
      renderForm();

      // ASSERT
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should keep Submit button disabled initially', () => {
      // ARRANGE & ACT
      renderForm();

      // ASSERT
      expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
    });
  });

  describe('validation errors', () => {
    it('should show error when title field is touched and empty', async () => {
      // ARRANGE
      renderForm();
      const titleInput = screen.getByLabelText(/idea title/i);

      // ACT
      fireEvent.focus(titleInput);
      fireEvent.blur(titleInput);

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText(/title must be at least 3/i)).toBeInTheDocument();
      });
    });

    it('should show error when description is too short', async () => {
      // ARRANGE
      renderForm();
      const descInput = screen.getByLabelText(/description/i);

      // ACT
      fireEvent.focus(descInput);
      fireEvent.change(descInput, { target: { value: 'Short' } });
      fireEvent.blur(descInput);

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText(/description must be at least 10/i)).toBeInTheDocument();
      });
    });
  });

  describe('form submission', () => {
    it('should enable Submit button only when all fields are valid', async () => {
      // ARRANGE
      renderForm();
      const submitButton = screen.getByRole('button', { name: /submit/i });

      // ASSERT - Initially disabled
      expect(submitButton).toBeDisabled();

      // ACT - Fill form validly
      await userEvent.type(screen.getByLabelText(/idea title/i), 'Valid Title');
      await userEvent.type(screen.getByLabelText(/description/i), 'Valid description text here');
      fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Innovation' } });

      // ASSERT - Now enabled
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('keyboard shortcuts', () => {
    it('should cancel form when Escape is pressed', async () => {
      // ARRANGE
      const handleCancel = jest.fn();
      renderForm({ onCancel: handleCancel });

      // ACT
      fireEvent.keyDown(screen.getByRole('button', { name: /submit/i }), {
        key: 'Escape',
        code: 'Escape',
      });

      // ASSERT
      expect(handleCancel).toHaveBeenCalled();
    });
  });
});
```

**Integration Test:** `src/components/__tests__/ideaSubmissionForm.integration.test.tsx`

```typescript
/**
 * Integration tests for IdeaSubmissionForm with API calls.
 * Uses Mock Service Worker (MSW) to mock API responses.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import IdeaSubmissionForm from '../ideaSubmissionForm';

// Mock API server
const server = setupServer(
  rest.post('http://localhost:3001/api/ideas', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: {
          id: 'idea-123',
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
          status: 'Submitted',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const renderForm = (props = {}) => {
  return render(
    <BrowserRouter>
      <IdeaSubmissionForm {...props} />
    </BrowserRouter>
  );
};

describe('IdeaSubmissionForm (Integration)', () => {
  beforeEach(() => {
    localStorage.setItem('auth_token', 'test-token');
  });

  it('should submit form and show success message', async () => {
    // ARRANGE
    renderForm();
    const mockOnSuccess = jest.fn();

    // ACT - Fill and submit form
    await userEvent.type(screen.getByLabelText(/idea title/i), 'Test Idea Title');
    await userEvent.type(screen.getByLabelText(/description/i), 'Test description text here');
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Innovation' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // ASSERT - Success feedback
    await waitFor(() => {
      expect(screen.getByText(/submitted successfully/i)).toBeInTheDocument();
    });
  });

  it('should show error on API failure', async () => {
    // ARRANGE
    server.use(
      rest.post('http://localhost:3001/api/ideas', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ success: false, error: 'Server error' })
        );
      })
    );

    renderForm();

    // ACT - Fill and submit form
    await userEvent.type(screen.getByLabelText(/idea title/i), 'Test Title');
    await userEvent.type(screen.getByLabelText(/description/i), 'Test description');
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Innovation' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // ASSERT - Error message shown
    await waitFor(() => {
      expect(screen.getByText(/server error/i)).toBeInTheDocument();
    });
  });

  it('should disable form during submission', async () => {
    // ARRANGE
    let resolveRequest: () => void;
    const requestPromise = new Promise<void>((resolve) => {
      resolveRequest = resolve;
    });

    server.use(
      rest.post('http://localhost:3001/api/ideas', async (req, res, ctx) => {
        await requestPromise;
        return res(ctx.status(201), ctx.json({ success: true, data: {} }));
      })
    );

    renderForm();

    // ACT - Fill form and start submission
    await userEvent.type(screen.getByLabelText(/idea title/i), 'Test Title');
    await userEvent.type(screen.getByLabelText(/description/i), 'Test description');
    fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Innovation' } });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // ASSERT - During submission, form is disabled
    expect((screen.getByLabelText(/idea title/i) as HTMLInputElement).disabled).toBe(true);
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/submitting/i)).toBeInTheDocument();

    // CLEANUP
    resolveRequest!();
  });
});
```

---

### Phase 3: Backend Implementation (1-2 days)

#### Step 3.1: Create Ideas Service (Backend)

**File:** `src/services/ideas.service.ts`

```typescript
/**
 * Backend Ideas Service: Business logic for idea operations.
 * Handles: Validation, database operations, error handling.
 */

import { Prisma, PrismaClient } from '@prisma/client';
import { ideaSubmissionSchema, IdeaSubmissionFormData } from '@/types/ideaSchema';

export class IdeasServiceBackend {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new idea.
   * @param userId - ID of user submitting idea
   * @param data - Form data (already validated by Zod)
   * @returns Created idea with all fields
   * @throws Error if database operation fails
   */
  async createIdea(userId: string, data: IdeaSubmissionFormData) {
    try {
      // Server-side validation (always validate even if client validated)
      const validatedData = ideaSubmissionSchema.parse(data);

      // Create idea in database
      const idea = await this.prisma.idea.create({
        data: {
          userId,
          title: validatedData.title,
          description: validatedData.description,
          category: validatedData.category,
          status: 'Submitted',
        },
      });

      return idea;
    } catch (error) {
      // Handle Prisma errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new Error(`User not found: ${userId}`);
        }
        if (error.code === 'P2002') {
          throw new Error('Duplicate entry detected');
        }
      }
      throw error;
    }
  }

  /**
   * Fetch ideas for a user with pagination.
   */
  async getUserIdeas(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [ideas, total] = await Promise.all([
      this.prisma.idea.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.idea.count({ where: { userId } }),
    ]);

    return {
      ideas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single idea by ID.
   */
  async getIdeaById(ideaId: string, userId: string) {
    const idea = await this.prisma.idea.findUnique({
      where: { id: ideaId },
    });

    // Verify ownership
    if (!idea || idea.userId !== userId) {
      throw new Error('Idea not found or unauthorized');
    }

    return idea;
  }
}
```

**Test File:** `src/services/__tests__/ideas.service.test.ts`

```typescript
/**
 * Unit tests for backend IdeasService.
 * Mocks Prisma to test business logic.
 */

import { IdeasServiceBackend } from '../ideas.service';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client');

describe('IdeasServiceBackend', () => {
  let service: IdeasServiceBackend;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      idea: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
      },
    };
    service = new IdeasServiceBackend(mockPrisma);
  });

  describe('createIdea', () => {
    it('should create idea with submitted status', async () => {
      // ARRANGE
      const ideaData = {
        title: 'Valid Title',
        description: 'Valid description text',
        category: 'Innovation' as const,
      };

      mockPrisma.idea.create.mockResolvedValue({
        id: 'idea-123',
        userId: 'user-123',
        ...ideaData,
        status: 'Submitted',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // ACT
      const result = await service.createIdea('user-123', ideaData);

      // ASSERT
      expect(result.status).toBe('Submitted');
      expect(result.title).toBe(ideaData.title);
      expect(mockPrisma.idea.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: ideaData.title,
          status: 'Submitted',
        }),
      });
    });

    it('should reject invalid data', async () => {
      // ARRANGE
      const invalidData = {
        title: 'AB', // Too short
        description: 'Short',
        category: 'InvalidCategory',
      };

      // ACT & ASSERT
      await expect(service.createIdea('user-123', invalidData as any)).rejects.toThrow();
    });
  });

  describe('getUserIdeas', () => {
    it('should fetch ideas with pagination', async () => {
      // ARRANGE
      const mockIdeas = [
        { id: 'idea-1', title: 'Idea 1', status: 'Submitted' },
        { id: 'idea-2', title: 'Idea 2', status: 'Under Review' },
      ];

      mockPrisma.idea.findMany.mockResolvedValue(mockIdeas);
      mockPrisma.idea.count.mockResolvedValue(2);

      // ACT
      const result = await service.getUserIdeas('user-123', 1, 10);

      // ASSERT
      expect(result.ideas).toEqual(mockIdeas);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.totalPages).toBe(1);
    });
  });
});
```

---

#### Step 3.2: Create Ideas Route / Controller

**File:** `src/api/routes/ideas.ts`

```typescript
/**
 * Ideas API routes.
 * POST /api/ideas - Create new idea
 * GET /api/ideas - List user's ideas
 * GET /api/ideas/:ideaId - Get single idea
 */

import { Router, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ideaSubmissionSchema } from '@/types/ideaSchema';
import { IdeasServiceBackend } from '@/services/ideas.service';
import { authenticateJWT } from '@/middleware/auth'; // Assumes JWT middleware exists
import { validateRequestBody } from '@/middleware/validation'; // Middleware for request validation

const router = Router();
const prisma = new PrismaClient();
const ideasService = new IdeasServiceBackend(prisma);

/**
 * @route POST /api/ideas
 * @desc Create a new idea
 * @auth Required (JWT)
 * @body { title, description, category }
 * @returns 201 Created with idea data
 */
router.post(
  '/',
  authenticateJWT,
  validateRequestBody(ideaSubmissionSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.sub; // From JWT token (set by auth middleware)
      if (!userId) {
        return res.status(401).json({ success: false, error: 'User ID not found in token' });
      }

      // Service handles all logic and validation
      const idea = await ideasService.createIdea(userId, req.body);

      res.status(201).json({
        success: true,
        message: 'Idea submitted successfully',
        data: idea,
      });
    } catch (error) {
      next(error); // Pass to error handler middleware
    }
  }
);

/**
 * @route GET /api/ideas
 * @desc Get all ideas for authenticated user (paginated)
 * @auth Required (JWT)
 * @query { page, limit }
 * @returns 200 OK with paginated ideas
 */
router.get(
  '/',
  authenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'User ID not found in token' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await ideasService.getUserIdeas(userId, page, limit);

      res.status(200).json({
        success: true,
        data: result.ideas,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route GET /api/ideas/:ideaId
 * @desc Get single idea (only if user is owner)
 * @auth Required (JWT)
 * @returns 200 OK with idea data
 */
router.get(
  '/:ideaId',
  authenticateJWT,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.sub;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'User ID not found in token' });
      }

      const idea = await ideasService.getIdeaById(req.params.ideaId, userId);

      res.status(200).json({
        success: true,
        data: idea,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
```

**Integration Test:** `src/api/routes/__tests__/ideas.integration.test.ts`

```typescript
/**
 * Integration tests for ideas API endpoints.
 * Tests with real/test database and HTTP requests.
 */

import request from 'supertest';
import { createExpressApp } from '@/app';
import { setupTestDatabase, rollbackDatabase, teardownTestDatabase } from '@/tests/helpers';

describe('POST /api/ideas (Integration)', () => {
  let app: any;

  beforeAll(async () => {
    app = createExpressApp();
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await rollbackDatabase();
  });

  it('should create idea and return 201', async () => {
    // ARRANGE
    const token = generateTestJWT({ sub: 'user-123' });
    const ideaData = {
      title: 'Reduce Processing Time',
      description: 'Implement automated workflow process',
      category: 'Process Improvement',
    };

    // ACT
    const response = await request(app)
      .post('/api/ideas')
      .set('Authorization', `Bearer ${token}`)
      .send(ideaData);

    // ASSERT
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      id: expect.any(String),
      ...ideaData,
      status: 'Submitted',
    });
  });

  it('should return 401 without auth', async () => {
    // ACT
    const response = await request(app)
      .post('/api/ideas')
      .send({
        title: 'Title',
        description: 'Description',
        category: 'Innovation',
      });

    // ASSERT
    expect(response.status).toBe(401);
  });

  it('should return 400 with invalid data', async () => {
    // ARRANGE
    const token = generateTestJWT({ sub: 'user-123' });

    // ACT
    const response = await request(app)
      .post('/api/ideas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'AB', // Too short
        description: 'Short', // Too short
        category: 'Invalid', // Invalid enum
      });

    // ASSERT
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.details).toBeDefined();
  });
});
```

---

### Phase 4: Integration & Testing (1 day)

#### Step 4.1: Run Tests (Green Phase - Make Tests Pass)

```bash
# 1. Run all tests to verify they fail (RED phase)
npm test -- --watch

# 2. As you implement code, tests should start passing (GREEN phase)
npm test -- STORY-2.1

# 3. Check coverage
npm test -- --coverage src/types/ideaSchema.ts
npm test -- --coverage src/components/ideaSubmissionForm.tsx
npm test -- --coverage src/services/ideas.service.ts

# 4. Target: 80% overall coverage
npm test -- --coverage --coverageThreshold='{"global":{"lines":80}}'
```

#### Step 4.2: Connect Route to Express App

**File:** `src/app.ts` (or wherever Express app is initialized)

```typescript
import ideasRouter from '@/api/routes/ideas';

// ... other middleware setup ...

// Register ideas routes
app.use('/api/ideas', ideasRouter);

export default app;
```

#### Step 4.3: Run E2E Test

```bash
# Start dev server in one terminal
npm run dev

# Run E2E test in another
npm run test:e2e -- tests/e2e/idea-submission-flow.spec.ts
```

---

### Phase 5: Refactoring (30 minutes)

Follow RED-GREEN-REFACTOR cycle:

1. **Refactor Frontend Components**
   - Extract common validation logic
   - Optimize re-renders (useMemo, useCallback)
   - Improve error messaging

2. **Refactor Backend Service**
   - Extract database queries into helper methods
   - Simplify error handling
   - Add logging

3. **Run Tests Again**
   ```bash
   npm test -- --coverage
   ```

---

## IV. Implementation Checklist

### Frontend Implementation

```
☐ Dependencies installed: react-hook-form, zod, axios, @hookform/resolvers
☐ ideaSchema.ts created with Zod validation
☐ ideaSchema.test.ts written and passing (11 unit tests)
☐ FormTextField.tsx created with accessibility
☐ FormTextArea.tsx created with char counter
☐ FormSelect.tsx created with dynamic options
☐ IdeasService created with API integration
☐ ideas.service.test.ts passing (unit tests)
☐ IdeaSubmissionForm.tsx created with React Hook Form
☐ ideaSubmissionForm.test.tsx passing (12 unit tests)
☐ ideaSubmissionForm.integration.test.tsx passing (15 integration tests)
☐ idea-submission-flow.spec.ts E2E test passing
☐ Code coverage >= 80% for all frontend files
☐ No ESLint warnings
☐ Prettier formatting applied
☐ Component properly exported and importable
```

### Backend Implementation

```
☐ Prisma schema updated with ideas table
☐ Prisma migration created and applied
☐ IdeasService created with business logic
☐ ideas.service.test.ts passing (unit tests)
☐ Database indexes created (userId, status)
☐ POST /api/ideas endpoint created
☐ GET /api/ideas endpoint created
☐ GET /api/ideas/:ideaId endpoint created
☐ ideas.integration.test.ts passing (12+ integration tests)
☐ Server-side validation using Zod
☐ JWT authentication middleware integrated
☐ Error handling middleware in place
☐ Request logging implemented
☐ CORS configured (allow frontend origin)
☐ Code coverage >= 80% for all backend files
```

### Testing

```
☐ Unit tests (70%): 35+ tests
  ☐ ideaSchema.test.ts: 11 tests ✓
  ☐ formTextField.test.tsx: 8 tests ✓
  ☐ ideaSubmissionForm.test.tsx: 12 tests ✓
  ☐ ideas.service.test.ts: 10 tests ✓

☐ Integration tests (20%): 8-12 tests
  ☐ ideaSubmissionForm.integration.test.tsx: 15 tests ✓
  ☐ ideas.integration.test.ts: 12+ tests ✓

☐ E2E tests (10%): 2-3 tests
  ☐ idea-submission-flow.spec.ts ✓

☐ Coverage Report
  ☐ Line coverage: >= 80%
  ☐ Branch coverage: >= 75%
  ☐ Function coverage: >= 80%
  ☐ HTML report generated: npm test -- --coverage --coverageReporters=html
```

### Code Quality

```
☐ TypeScript compilation: tsc --noEmit (0 errors)
☐ ESLint: npm run lint (0 warnings)
☐ Prettier: npm run format (all files formatted)
☐ JSDoc comments on all public APIs
☐ No console.log statements in prod code
☐ No any types (strict mode enabled)
☐ Error handling on all async operations
☐ No hardcoded API URLs or secrets
```

### Git & Review

```
☐ Feature branch created: feat/story-2.1-submission-form
☐ All changes committed with clear commit messages:
  ☐ [frontend] Add Zod validation schema
  ☐ [frontend] Add reusable form field components
  ☐ [frontend] Add IdeaSubmissionForm component
  ☐ [backend] Add ideas database schema
  ☐ [backend] Add ideas API endpoints
  ☐ [tests] Add comprehensive unit/integration/E2E tests
☐ PR created with reference to STORY-2.1-Submission-Form.md
☐ Code review approved by 2+ developers
☐ CI/CD pipeline passing (coverage, lint, tests)
☐ Merged to main branch
```

---

## V. Key Files Summary

| File | Lines | Purpose |
|------|-------|---------|
| `src/types/ideaSchema.ts` | ~50 | Zod validation schema |
| `src/components/ideaSubmissionForm.tsx` | ~200 | Main form component |
| `src/components/formTextField.tsx` | ~80 | Reusable text field |
| `src/components/formTextArea.tsx` | ~80 | Reusable textarea |
| `src/components/formSelect.tsx` | ~80 | Reusable select |
| `src/services/ideas.service.ts` | ~80 | Frontend API service |
| `src/api/routes/ideas.ts` | ~120 | Backend API routes |
| `src/services/ideas.service.ts` | ~100 | Backend business logic |
| **Tests** | **1500+** | Unit + Integration + E2E |

**Total Implementation:** ~2000 lines of code + tests

---

## VI. Debugging Tips

### If Tests Fail

1. **Unit Tests Failing:**
   ```bash
   npm test -- --verbose src/types/__tests__/ideaSchema.test.ts
   ```

2. **Integration Tests Failing:**
   - Verify test database is set up: `npm run db:test:setup`
   - Verify JWT token generation works: check `generateTestJWT` helper
   - Check MSW server is listening: `server.listen()`

3. **E2E Tests Failing:**
   - Start dev server: `npm run dev`
   - Check frontend loads: http://localhost:5173
   - Check backend API: http://localhost:3001/api/ideas

### If API Doesn't Work

1. **401 Unauthorized:**
   - JWT token missing from Authorization header
   - Token expired or invalid format
   - Check `authenticateJWT` middleware

2. **400 Bad Request:**
   - Validation error, check response.body.details
   - Missing required fields
   - Invalid field values

3. **500 Internal Server Error:**
   - Check backend logs
   - Verify Prisma connection
   - Check database migrations applied: `npx prisma migrate status`

---

## VII. Verification Steps

After implementation, verify everything works:

```bash
# 1. All tests pass
npm test -- --coverage
# Expected: >= 80% coverage

# 2. No type errors
npx tsc --noEmit
# Expected: 0 errors

# 3. No lint errors
npm run lint
# Expected: 0 warnings

# 4. Frontend builds
npm run build
# Expected: Build succeeds

# 5. Backend starts
npm run dev
# Expected: Server runs without errors

# 6. Form loads
# Navigate to: http://localhost:5173/ideas/submit
# Expected: Form displays with all fields

# 7. Submission works
# Fill form with valid data
# Click Submit
# Expected: Success toast + redirect to dashboard

# 8. Error handling works
# Fill form with invalid data
# Expected: Validation errors display

# 9. Create PR
git push origin feat/story-2.1-submission-form
# Open PR on GitHub with reference to STORY-2.1-Submission-Form.md
```

---

## References

- **Story Spec:** [STORY-2.1-Submission-Form.md](STORY-2.1-Submission-Form.md)
- **Test Suite:** [TESTSUITE-STORY-2.1.md](TESTSUITE-STORY-2.1.md)
- **Project Conventions:** [agents.md](../../agents.md)
- **Constitution:** `/speckit-lab/.specify/memory/constitution.md`
- **React Hook Form:** https://react-hook-form.com/
- **Zod:** https://zod.dev/
- **Jest:** https://jestjs.io/

---

**Status:** READY FOR IMPLEMENTATION  
**Start Date:** February 27, 2026  
**Target Completion:** March 3, 2026  
**Last Updated:** February 25, 2026

/**
 * ideaSchema.ts
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
  category: z.enum(IDEA_CATEGORIES),
  file: z
    .instanceof(File)
    .optional()
    .nullable(),
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

import { z } from 'zod';

export const ideasSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  category: z.enum(['PRODUCT', 'PROCESS', 'MARKETING', 'OTHER']),
});

export const updateIdeaSchema = ideasSchema.partial();

export const paginationSchema = z.object({
  limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .default(10),
  offset: z.coerce
    .number()
    .min(0)
    .default(0),
});

export const fileUploadSchema = z.object({
  mimeType: z.enum([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
  ]),
  fileSize: z.number().max(10 * 1024 * 1024, 'File must not exceed 10MB'),
});

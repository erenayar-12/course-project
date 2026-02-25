import { z } from 'zod';

// Allowed MIME types for file upload
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
] as const;

export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.xls', '.xlsx'];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size must be less than 10MB (current: ${((file: any) => (file.size / (1024 * 1024)).toFixed(2))})`,
    })
    .refine((file) => ALLOWED_MIME_TYPES.includes(file.type as any), {
      message: `File format not supported. Allowed: PDF, Word, Excel, or Image files`,
    })
    .optional()
    .nullable(),
});

export type FileUploadData = z.infer<typeof fileUploadSchema>;

/**
 * Utility function to format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Utility function to validate file before upload
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File size exceeds 10MB limit (${formatFileSize(file.size)})` };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type as any)) {
    return { valid: false, error: 'File format not supported. Allowed: PDF, Word, Excel, or Image files' };
  }

  return { valid: true };
};

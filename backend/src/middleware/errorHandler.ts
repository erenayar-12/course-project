import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  details?: unknown;
}

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = (err as AppError).statusCode || 500;
  const isDev = process.env.NODE_ENV === 'development';

  // Validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors,
    });
  }

  // Multer errors
  if (err.name === 'MulterError') {
    let message = 'File upload error';
    let code = 400;

    if ((err as any).code === 'LIMIT_FILE_SIZE') {
      message = 'File too large (max 10MB)';
      code = 413;
    } else if ((err as any).code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files (max 1)';
      code = 400;
    }

    return res.status(code).json({
      success: false,
      message,
    });
  }

  // Default error response
  const response: any = {
    success: false,
    message: err.message || 'Internal server error',
  };

  if (isDev) {
    response.details = (err as AppError).details;
    response.stack = err.stack;
  }

  console.error('Error:', {
    statusCode,
    message: err.message,
    stack: err.stack,
    details: (err as AppError).details,
  });

  res.status(statusCode).json(response);
};

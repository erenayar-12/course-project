/**
 * file.service.ts
 * Service for handling file uploads with progress tracking and validation
 */

import axios, { AxiosProgressEvent } from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface UploadProgressEvent {
  progress: number;
}

export interface FileUploadResponse {
  success: boolean;
  data: {
    attachmentId: string;
    ideaId: string;
    originalFileName: string;
    fileSize: number;
    uploadedAt: string;
  };
}

/**
 * File upload service with progress tracking
 */
export const fileService = {
  /**
   * Upload file to idea submission endpoint
   * @param ideaId - ID of the submitted idea
   * @param file - File to upload
   * @param onProgress - Progress callback (0-100)
   * @returns Promise with upload response
   */
  async uploadFile(
    ideaId: string,
    file: File,
    onProgress?: (event: UploadProgressEvent) => void
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('auth0_access_token') || localStorage.getItem('auth_token');

    if (!token) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await axios.post<FileUploadResponse>(
        `${API_URL}/ideas/${ideaId}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total && progressEvent.total > 0) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress?.({ progress: Math.min(percentCompleted, 99) });
            }
          },
          timeout: 60000, // 60 second timeout
        }
      );

      // Ensure progress reaches 100%
      onProgress?.({ progress: 100 });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 413) {
          throw new Error('File size exceeds server limit');
        } else if (error.response?.status === 400) {
          throw new Error(
            error.response?.data?.error || 'Invalid file format or size'
          );
        } else if (error.response?.status === 401) {
          throw new Error('Unauthorized - please log in again');
        } else if (error.code === 'ECONNABORTED') {
          throw new Error('Upload timeout - please try again');
        }
      }
      throw error;
    }
  },

  /**
   * Validate file before upload (client-side)
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (file.size > MAX_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return { valid: false, error: `File size exceeds 10MB limit (${sizeMB} MB)` };
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'File format not supported. Allowed: PDF, Word, Excel, or Image files',
      };
    }

    return { valid: true };
  },
};

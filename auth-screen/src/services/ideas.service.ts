/**
 * ideas.service.ts
 * Frontend service for idea submission and management.
 * Handles: API communication, error handling, data transformation.
 */

import { IdeaSubmissionFormData, IdeaResponse, ErrorResponse } from '@/types/ideaSchema';
import { apiPost, apiGet, apiPut, apiDelete } from '@/api/client';

class IdeasService {
  /**
   * Submits a new idea to the backend.
   * @param data - Form data validated by Zod schema
   * @returns Promise<IdeaResponse> Created idea with ID and metadata
   * @throws Error with user-friendly message on failure
   */
  async submitIdea(data: IdeaSubmissionFormData): Promise<IdeaResponse> {
    try {
      const response = await apiPost<{ success: boolean; data: IdeaResponse }>(
        '/ideas',
        data
      );

      if (!response.success) {
        throw new Error('Failed to submit idea');
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error('Session expired. Please log in again.');
      }

      if (error instanceof Error && error.message.includes('500')) {
        throw new Error('Server error. Please try again later.');
      }

      throw error instanceof Error ? error : new Error('An unexpected error occurred');
    }
  }

  /**
   * Fetches ideas for current user with pagination and filters.
   * Used by STORY-2.3 (Dashboard).
   */
  async getIdeas(params?: { page?: number; limit?: number; status?: string; sortBy?: string }) {
    return apiGet<{ ideas: any[] }>('/ideas', { params });
  }

  /**
   * Fetches detailed information about a specific idea.
   * Implements AC1 from STORY-2.5: Page loads with idea information
   */
  async getIdeaDetail(ideaId: string): Promise<IdeaResponse> {
    try {
      const response = await apiGet<{ success: boolean; data: IdeaResponse }>(`/ideas/${ideaId}`);

      if (!response.success) {
        throw new Error('Failed to fetch idea details');
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('403')) {
          throw new Error("You don't have permission to view this idea");
        }

        if (error.message.includes('404')) {
          throw new Error('Idea not found');
        }

        if (error.message.includes('401')) {
          throw new Error('Session expired. Please log in again.');
        }
      }

      throw error instanceof Error ? error : new Error('Failed to fetch idea details');
    }
  }

  /**
   * Deletes an idea (soft delete).
   * Implements AC5 from STORY-2.5: Delete button with confirmation
   */
  async deleteIdea(ideaId: string): Promise<void> {
    try {
      const response = await apiDelete<{ success: boolean }>(`/ideas/${ideaId}`);

      if (!response.success) {
        throw new Error('Failed to delete idea');
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('403')) {
          throw new Error("You don't have permission to delete this idea");
        }

        if (error.message.includes('404')) {
          throw new Error('Idea not found');
        }

        if (error.message.includes('401')) {
          throw new Error('Session expired. Please log in again.');
        }
      }

      throw error instanceof Error ? error : new Error('Failed to delete idea');
    }
  }

  /**
   * Updates an existing idea (STORY-2.6).
   */
  async updateIdea(
    ideaId: string,
    data: { title: string; description: string; category: string }
  ): Promise<IdeaResponse> {
    try {
      const response = await apiPut<{ success: boolean; data: IdeaResponse }>(
        `/ideas/${ideaId}`,
        data
      );

      if (!response.success) {
        throw new Error('Failed to update idea');
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('400')) {
          throw new Error(error.message || 'Validation failed');
        }

        if (error.message.includes('403')) {
          throw new Error("You don't have permission to edit this idea");
        }

        if (error.message.includes('404')) {
          throw new Error('Idea not found');
        }

        if (error.message.includes('401')) {
          throw new Error('Session expired. Please log in again.');
        }

        if (error.message.includes('500')) {
          throw new Error('Server error. Please try again later.');
        }
      }

      throw error instanceof Error ? error : new Error('Failed to update idea');
    }
  }

  /**
   * Uploads attachment files for an idea (STORY-2.6).
   * Uses FormData for multipart file upload.
   */
  async uploadAttachments(ideaId: string, files: File[]): Promise<void> {
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      // Get token and make direct fetch request (FormData shouldn't be stringified)
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:3001/api/ideas/${ideaId}/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || `Upload failed: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error('Failed to upload attachment files');
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('413')) {
          throw new Error('File size too large. Maximum 10MB per file.');
        }

        if (error.message.includes('400')) {
          throw new Error(error.message || 'Invalid file type or upload error');
        }

        if (error.message.includes('403')) {
          throw new Error("You don't have permission to upload files for this idea");
        }

        if (error.message.includes('404')) {
          throw new Error('Idea not found');
        }

        if (error.message.includes('401')) {
          throw new Error('Session expired. Please log in again.');
        }
      }

      throw error instanceof Error ? error : new Error('Failed to upload attachment files');
    }
  }

  /**
   * Fetches evaluation queue for current evaluator (STORY-3.1).
   * Returns ideas pending review sorted by submission date (FIFO).
   */
  async getEvaluationQueue(page: number = 1, limit: number = 25) {
    try {
      const response = await apiGet('/evaluation-queue', {
        params: { page, limit },
      });
      return response;
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error('Session expired. Please log in again.');
      }

      if (error instanceof Error && error.message.includes('403')) {
        throw new Error('You do not have permission to view the evaluation queue.');
      }

      throw error instanceof Error ? error : new Error('Failed to fetch evaluation queue');
    }
  }

  /**
   * Updates idea status during evaluation (STORY-3.2 & STORY-3.3).
   * Called when evaluator approves or rejects an idea.
   * AC4: Auto-status update "Submitted" → "Under Review" on panel load
   */
  async updateIdeaStatus(ideaId: string, status: string): Promise<IdeaResponse> {
    try {
      const response = await apiPut<{ success: boolean; data: IdeaResponse }>(
        `/ideas/${ideaId}/status`,
        { status }
      );

      if (!response.success) {
        throw new Error('Failed to update idea status');
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('403')) {
          throw new Error("You don't have permission to update this idea");
        }

        if (error.message.includes('404')) {
          throw new Error('Idea not found');
        }

        if (error.message.includes('401')) {
          throw new Error('Session expired. Please log in again.');
        }

        if (error.message.includes('409')) {
          throw new Error('Idea was already decided by another evaluator');
        }
      }

      throw error instanceof Error ? error : new Error('Failed to update idea status');
    }
  }
}

export const ideasService = new IdeasService();
export default ideasService;

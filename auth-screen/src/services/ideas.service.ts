/**
 * ideas.service.ts
 * Frontend service for idea submission and management.
 * Handles: API communication, error handling, data transformation.
 */

import axios, { AxiosError } from 'axios';
import { IdeaSubmissionFormData, IdeaResponse, ErrorResponse } from '@/types/ideaSchema';

// Get API URL from environment or use fallback
const API_URL = (() => {
  if (typeof window !== 'undefined') {
    // Browser environment
    return 'http://localhost:3001/api';
  }
  // Server/test environment
  return 'http://localhost:3001/api';
})();

class IdeasService {
  private api = axios.create({
    baseURL: API_URL,
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

  /**
   * Fetches detailed information about a specific idea.
   * Implements AC1 from STORY-2.5: Page loads with idea information
   * 
   * @param ideaId - The ID of the idea to fetch
   * @returns Promise<IdeaDetail> Detailed idea information including attachments and feedback
   * @throws Error on 403 (unauthorized), 404 (not found), or other failures
   */
  async getIdeaDetail(ideaId: string): Promise<IdeaResponse> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await this.api.get(`/ideas/${ideaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success) {
        throw new Error('Failed to fetch idea details');
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.response?.status === 403) {
          throw new Error("You don't have permission to view this idea");
        }

        if (axiosError.response?.status === 404) {
          throw new Error('Idea not found');
        }

        if (axiosError.response?.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
      }

      throw error instanceof Error ? error : new Error('Failed to fetch idea details');
    }
  }

  /**
   * Deletes an idea (soft delete).
   * Implements AC5 from STORY-2.5: Delete button with confirmation
   * 
   * @param ideaId - The ID of the idea to delete
   * @throws Error on 403 (unauthorized), 404 (not found), or other failures
   */
  async deleteIdea(ideaId: string): Promise<void> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const response = await this.api.delete(`/ideas/${ideaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success) {
        throw new Error('Failed to delete idea');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.response?.status === 403) {
          throw new Error("You don't have permission to delete this idea");
        }

        if (axiosError.response?.status === 404) {
          throw new Error('Idea not found');
        }

        if (axiosError.response?.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
      }

      throw error instanceof Error ? error : new Error('Failed to delete idea');
    }
  }
}

export const ideasService = new IdeasService();
export default ideasService;

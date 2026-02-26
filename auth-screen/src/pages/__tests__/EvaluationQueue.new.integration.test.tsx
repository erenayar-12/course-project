/**
 * Story-3.1: EvaluationQueue Page Integration Tests
 * 
 * Core integration tests for evaluation queue page focusing on:
 * - Rendering and basic functionality
 * - Error handling with retry
 * - Pagination state management
 * 
 * @file Integration tests for EvaluationQueue page
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { MockAuth0Provider } from '../../context/MockAuth0Context';
import EvaluationQueue from '../EvaluationQueue';
import '@testing-library/jest-dom';

// Mock the API client
jest.mock('../../api/client', () => ({
  apiGet: jest.fn(),
}));

const { apiGet } = require('../../api/client');

const mockQueueResponse = {
  success: true,
  data: [
    {
      id: '1',
      title: 'Improve Login Flow',
      submitterName: 'Alice Johnson',
      category: 'UX',
      createdAt: '2026-02-15T10:00:00Z',
      status: 'Submitted',
      daysInQueue: 5,
    },
  ],
  pagination: {
    page: 1,
    limit: 25,
    total: 1,
    totalPages: 1,
  },
};

const setupMockUser = (role: string = 'evaluator') => {
  const userData = {
    email: `${role}@example.com`,
    isAuthenticated: true,
    role: role.toUpperCase(),
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem('mock_user', JSON.stringify(userData));
  localStorage.setItem('auth_token', 'mock-token-' + role);
};

const renderWithContext = (component: React.ReactElement) => {
  return render(
    <MockAuth0Provider>
      <BrowserRouter>{component}</BrowserRouter>
    </MockAuth0Provider>
  );
};

describe('EvaluationQueue Integration Tests (STORY-3.1)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    setupMockUser('evaluator');
    apiGet.mockResolvedValue(mockQueueResponse);
  });

  describe('rendering', () => {
    it('should render page header', async () => {
      renderWithContext(<EvaluationQueue />);
      await waitFor(() => {
        expect(screen.getByText(/evaluation queue/i)).toBeInTheDocument();
      });
    });

    it('should fetch evaluation queue on mount', async () => {
      renderWithContext(<EvaluationQueue />);
      await waitFor(() => {
        expect(apiGet).toHaveBeenCalled();
      });
    });

    it('should render page pagination controls', async () => {
      renderWithContext(<EvaluationQueue />);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
      });
    });
  });

  describe('error handling', () => {
    it('should display error message when API fails', async () => {
      apiGet.mockRejectedValueOnce(new Error('Network error'));
      renderWithContext(<EvaluationQueue />);
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    it('should show retry button on error', async () => {
      apiGet.mockRejectedValueOnce(new Error('Failed'));
      renderWithContext(<EvaluationQueue />);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });
    });

    it('should retry fetch on retry button click', async () => {
      apiGet.mockRejectedValueOnce(new Error('Network error'));
      apiGet.mockResolvedValueOnce(mockQueueResponse);

      renderWithContext(<EvaluationQueue />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });

      const user = userEvent.setup();
      const retryBtn = screen.getByRole('button', { name: /retry/i });
      await user.click(retryBtn);

      await waitFor(() => {
        expect(apiGet).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('pagination state', () => {
    it('should fetch with default pagination (page 1, limit 25)', async () => {
      renderWithContext(<EvaluationQueue />);
      await waitFor(() => {
        expect(apiGet).toHaveBeenCalledWith('/evaluation-queue', {
          params: { page: 1, limit: 25 },
        });
      });
    });

    it('should use saved page size from localStorage', async () => {
      localStorage.setItem('evaluationQueue_pageSize', '50');
      renderWithContext(<EvaluationQueue />);
      await waitFor(() => {
        expect(apiGet).toHaveBeenCalledWith('/evaluation-queue', {
          params: { page: 1, limit: 50 },
        });
      });
    });
  });
});

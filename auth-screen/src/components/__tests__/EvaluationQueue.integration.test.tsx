/**
 * STORY-2.3b: EvaluationQueue Integration Tests
 * Test Category: Frontend Integration Tests (6 tests)
 * 
 * Tests: API integration, loading states, pagination
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import EvaluationQueue from '../../pages/evaluation-queue/EvaluationQueue';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockEvaluationQueue = {
  ideas: [
    {
      id: 'idea-1',
      title: 'First Idea',
      submitterEmail: 'user1@example.com',
      category: 'INNOVATION',
      createdAt: new Date(),
      status: 'SUBMITTED',
      attachmentCount: 1,
    },
    {
      id: 'idea-2',
      title: 'Second Idea',
      submitterEmail: 'user2@example.com',
      category: 'PROCESS',
      createdAt: new Date(),
      status: 'UNDER_REVIEW',
      attachmentCount: 0,
    },
  ],
  pagination: {
    total: 2,
    page: 1,
    pages: 1,
    limit: 10,
  },
};

describe('EvaluationQueue Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('should fetch and display evaluation queue on mount', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockEvaluationQueue });

    renderWithRouter(<EvaluationQueue />);

    await waitFor(() => {
      expect(screen.getByText('First Idea')).toBeInTheDocument();
      expect(screen.getByText('Second Idea')).toBeInTheDocument();
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/evaluation-queue')
    );
  });

  it('should display loading skeleton while fetching', async () => {
    mockedAxios.get.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve({ data: mockEvaluationQueue }), 100))
    );

    renderWithRouter(<EvaluationQueue />);

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
    });
  });

  it('should display error message on API failure', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));

    renderWithRouter(<EvaluationQueue />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load evaluation queue/i)).toBeInTheDocument();
    });
  });

  it('should reload queue on retry button click', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

    renderWithRouter(<EvaluationQueue />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load evaluation queue/i)).toBeInTheDocument();
    });

    mockedAxios.get.mockResolvedValueOnce({ data: mockEvaluationQueue });

    fireEvent.click(screen.getByRole('button', { name: /Retry/i }));

    await waitFor(() => {
      expect(screen.getByText('First Idea')).toBeInTheDocument();
    });
  });

  it('should handle pagination with next button', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockEvaluationQueue });

    renderWithRouter(<EvaluationQueue />);

    await waitFor(() => {
      expect(screen.getByText('First Idea')).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('offset=10')
      );
    });
  });

  it('should display empty state when no ideas in queue', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { ideas: [], pagination: { total: 0, page: 1, pages: 1 } },
    });

    renderWithRouter(<EvaluationQueue />);

    await waitFor(() => {
      expect(screen.getByText(/No ideas pending evaluation/i)).toBeInTheDocument();
    });
  });
});

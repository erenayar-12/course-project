/**
 * STORY-2.3b: EvaluationModal Integration Tests
 * Test Category: Frontend Integration Tests (4 tests)
 * 
 * Tests: Form submission, file upload, API integration
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import EvaluationModal from '../EvaluationModal';
import { IdeaStatus } from '../../types/evaluationTypes';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('EvaluationModal Integration Tests', () => {
  const mockIdea = {
    id: 'idea-1',
    title: 'Test Idea',
    description: 'Test Description',
    category: 'Technology',
    status: IdeaStatus.SUBMITTED,
    userId: 'user-1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should submit evaluation to API on form submit', async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockResolvedValue({
      data: { success: true, evaluation: { id: 'eval-1' } },
    });

    render(
      <EvaluationModal
        idea={mockIdea}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={jest.fn()}
      />
    );

    // Fill form
    const statusSelect = screen.getByDisplayValue('');
    await user.selectOptions(statusSelect, 'ACCEPTED');

    const commentsTextarea = screen.getByPlaceholderText(/comments/i);
    await user.type(commentsTextarea, 'This is approved!');

    // Submit
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `/api/ideas/idea-1/evaluate`,
        expect.objectContaining({
          status: 'ACCEPTED',
          comments: 'This is approved!',
        })
      );
    });
  });

  it('should handle file upload for evaluation notes', async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockResolvedValue({
      data: { success: true, evaluation: { id: 'eval-1' } },
    });

    render(
      <EvaluationModal
        idea={mockIdea}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={jest.fn()}
      />
    );

    const fileInput = screen.getByRole('input', { name: /Upload evaluation notes/i });
    const file = new File(['notes'], 'eval_notes.pdf', { type: 'application/pdf' });

    await user.upload(fileInput, file);

    expect(fileInput).toHaveProperty('files', [file]);
  });

  it('should show success toast after submission', async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockResolvedValue({
      data: { success: true, evaluation: { id: 'eval-1' } },
    });

    render(
      <EvaluationModal
        idea={mockIdea}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={jest.fn()}
      />
    );

    const statusSelect = screen.getByDisplayValue('');
    await user.selectOptions(statusSelect, 'ACCEPTED');

    const commentsTextarea = screen.getByPlaceholderText(/comments/i);
    await user.type(commentsTextarea, 'Good!');

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Eval evaluation submitted/i)).toBeInTheDocument();
    });
  });

  it('should display error message on API failure', async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockRejectedValue(new Error('API Error'));

    render(
      <EvaluationModal
        idea={mockIdea}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={jest.fn()}
      />
    );

    const statusSelect = screen.getByDisplayValue('');
    await user.selectOptions(statusSelect, 'REJECTED');

    const commentsTextarea = screen.getByPlaceholderText(/comments/i);
    await user.type(commentsTextarea, 'Needs work');

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to submit evaluation/i)).toBeInTheDocument();
    });
  });
});

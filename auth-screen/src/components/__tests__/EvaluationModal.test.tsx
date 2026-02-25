/**
 * STORY-2.3b: EvaluationModal Component Unit Tests
 * Test Category: Frontend Unit Tests (FE-UNIT-2.3b-015 through 019)
 * 
 * Tests: Modal header, status dropdown, comments textarea, submit button
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EvaluationModal from '../EvaluationModal';

describe('EvaluationModal', () => {
  const mockIdea = {
    id: 'idea-1',
    title: 'Test Idea',
    description: 'This is a test idea',
  };

  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  describe('rendering', () => {
    // FE-UNIT-2.3b-015
    it('should display idea title and summary in modal header', () => {
      render(
        <EvaluationModal
          idea={mockIdea}
          onSubmit={mockOnSubmit}
          onClose={mockOnClose}
          isOpen={true}
        />
      );
      expect(screen.getByText('Test Idea')).toBeInTheDocument();
      expect(screen.getByText('This is a test idea')).toBeInTheDocument();
    });

    // FE-UNIT-2.3b-016
    it('should render status dropdown with all open statuses', () => {
      render(
        <EvaluationModal
          idea={mockIdea}
          onSubmit={mockOnSubmit}
          onClose={mockOnClose}
          isOpen={true}
        />
      );
      const statusSelect = screen.getByDisplayValue('');
      expect(statusSelect).toBeInTheDocument();

      // Check for all three status options
      const options = screen.getAllByRole('option');
      const optionTexts = options.map((o: any) => o.textContent);
      expect(optionTexts).toContain('ACCEPTED');
      expect(optionTexts).toContain('REJECTED');
      expect(optionTexts).toContain('NEEDS_REVISION');
    });

    // FE-UNIT-2.3b-017
    it('should render comments textarea for evaluator notes', () => {
      render(
        <EvaluationModal
          idea={mockIdea}
          onSubmit={mockOnSubmit}
          onClose={mockOnClose}
          isOpen={true}
        />
      );
      const commentsTextarea = screen.getByPlaceholderText(/comments/i);
      expect(commentsTextarea).toBeInTheDocument();
      expect(commentsTextarea).toHaveAttribute('maxLength', '500');
    });
  });

  describe('submission', () => {
    // FE-UNIT-2.3b-018
    it('should call onSubmit when submit button clicked', async () => {
      const user = userEvent.setup();
      render(
        <EvaluationModal
          idea={mockIdea}
          onSubmit={mockOnSubmit}
          onClose={mockOnClose}
          isOpen={true}
        />
      );

      // Fill in form
      const statusSelect = screen.getByDisplayValue('');
      await user.selectOptions(statusSelect, 'ACCEPTED');

      const commentsTextarea = screen.getByPlaceholderText(/comments/i);
      await user.type(commentsTextarea, 'This is a good idea!');

      // Submit
      const submitButton = screen.getByRole('button', { name: /Submit/i });
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalled();
    });

    // FE-UNIT-2.3b-019
    it('should disable submit button while loading', () => {
      render(
        <EvaluationModal
          idea={mockIdea}
          onSubmit={mockOnSubmit}
          onClose={mockOnClose}
          isOpen={true}
          isLoading={true}
        />
      );

      const submitButton = screen.getByRole('button', { name: /Submit/i });
      expect(submitButton).toBeDisabled();
    });
  });
});

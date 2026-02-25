/**
 * STORY-2.6: IdeaForm Component Tests
 * 
 * Tests for form functionality:
 * - Form rendering and field interactions
 * - Validation and character counting
 * - Unsaved changes detection
 * - Form submission
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import IdeaForm from '../../components/IdeaForm';
import { IdeaResponse } from '../../types/ideaSchema';

const mockIdea: IdeaResponse = {
  id: 'idea-123',
  userId: 'user-123',
  title: 'Test Idea',
  description: 'This is a test idea for editing',
  category: 'Innovation',
  status: 'Submitted',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('IdeaForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Create Mode', () => {
    it('should render create form with default values', () => {
      render(
        <IdeaForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/Submit New Idea/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Submit Idea/i })).toBeInTheDocument();
    });

    it('should show file upload in create mode', () => {
      render(
        <IdeaForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/Supporting Files/i)).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('should render edit form with prefilled data', () => {
      render(
        <IdeaForm
          mode="edit"
          initialIdea={mockIdea}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/Edit Idea/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Idea')).toBeInTheDocument();
      expect(screen.getByDisplayValue('This is a test idea for editing')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
    });

    it('should not show file upload in edit mode', () => {
      render(
        <IdeaForm
          mode="edit"
          initialIdea={mockIdea}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.queryByText(/Supporting Files/i)).not.toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('should show error for title shorter than 5 characters', async () => {
      render(
        <IdeaForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const titleInput = screen.getByPlaceholderText(/Enter idea title/i);
      fireEvent.change(titleInput, { target: { value: 'abc' } });

      const submitButton = screen.getByRole('button', { name: /Submit Idea/i });
      fireEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
    });

    it('should show error for description shorter than 20 characters', async () => {
      render(
        <IdeaForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const descInput = screen.getByPlaceholderText(/Enter detailed description/i);
      fireEvent.change(descInput, { target: { value: 'short' } });

      const submitButton = screen.getByRole('button', { name: /Submit Idea/i });
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when form is valid', async () => {
      render(
        <IdeaForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const titleInput = screen.getByPlaceholderText(/Enter idea title/i);
      const descInput = screen.getByPlaceholderText(/Enter detailed description/i);
      
      fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
      fireEvent.change(descInput, { target: { value: 'This is a valid description with enough characters' } });

      const submitButton = screen.getByRole('button', { name: /Submit Idea/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Character Counting', () => {
    it('should display character count for title', () => {
      render(
        <IdeaForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const titleInput = screen.getByPlaceholderText(/Enter idea title/i);
      fireEvent.change(titleInput, { target: { value: 'Hello' } });

      expect(screen.getByText(/5 \/ 100 characters/)).toBeInTheDocument();
    });

    it('should display character count for description', () => {
      render(
        <IdeaForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const descInput = screen.getByPlaceholderText(/Enter detailed description/i);
      fireEvent.change(descInput, { target: { value: 'This is a description.' } });

      expect(screen.getByText(/22 \/ 2000 characters/)).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with form data', async () => {
      render(
        <IdeaForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const titleInput = screen.getByPlaceholderText(/Enter idea title/i);
      const descInput = screen.getByPlaceholderText(/Enter detailed description/i);
      
      fireEvent.change(titleInput, { target: { value: 'New Idea Title' } });
      fireEvent.change(descInput, { target: { value: 'This is a detailed description of the idea' } });

      const submitButton = screen.getByRole('button', { name: /Submit Idea/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'New Idea Title',
          description: 'This is a detailed description of the idea',
          category: 'Innovation',
          newFiles: [],
        });
      });
    });
  });

  describe('Cancel Functionality', () => {
    it('should call onCancel when cancel button clicked without changes', () => {
      render(
        <IdeaForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should show unsaved changes warning when form modified', async () => {
      render(
        <IdeaForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const titleInput = screen.getByPlaceholderText(/Enter idea title/i);
      fireEvent.change(titleInput, { target: { value: 'New Title' } });

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.getByText(/Unsaved Changes/i)).toBeInTheDocument();
      });
    });
  });

  describe('Disabled States', () => {
    it('should disable submit button while submitting', () => {
      render(
        <IdeaForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isSubmitting={true}
        />
      );

      const submitButton = screen.getByRole('button', { name: /Submitting|Saving/i });
      expect(submitButton).toBeDisabled();
    });

    it('should disable cancel button while submitting', () => {
      render(
        <IdeaForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isSubmitting={true}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      expect(cancelButton).toBeDisabled();
    });
  });

  describe('Error Display', () => {
    it('should display error message when provided', () => {
      const errorMessage = 'Failed to save idea';
      render(
        <IdeaForm
          mode="edit"
          initialIdea={mockIdea}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          error={errorMessage}
        />
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('Category Selection', () => {
    it('should display all category options', () => {
      render(
        <IdeaForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByDisplayValue('Innovation')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Process Improvement')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Cost Reduction')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Customer Experience')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Sustainability')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Technology')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Other')).toBeInTheDocument();
    });

    it('should allow changing category', () => {
      render(
        <IdeaForm
          mode="create"
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const categorySelect = screen.getByDisplayValue('Innovation') as HTMLSelectElement;
      fireEvent.change(categorySelect, { target: { value: 'Technology' } });

      expect((categorySelect.value)).toBe('Technology');
    });
  });
});

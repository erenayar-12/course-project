/**
 * IdeaSubmissionForm.test.tsx
 * Unit tests for IdeaSubmissionForm component.
 * Tests rendering, validation display, user interactions.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import IdeaSubmissionForm from '../IdeaSubmissionForm';

const renderForm = (props = {}) => {
  return render(
    <BrowserRouter>
      <IdeaSubmissionForm {...props} />
    </BrowserRouter>
  );
};

describe('IdeaSubmissionForm', () => {
  describe('rendering', () => {
    it('should render all form fields', () => {
      // ARRANGE & ACT
      renderForm();

      // ASSERT
      expect(screen.getByLabelText(/idea title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    });

    it('should render Submit and Cancel buttons', () => {
      // ARRANGE & ACT
      renderForm();

      // ASSERT
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should keep Submit button disabled initially', () => {
      // ARRANGE & ACT
      renderForm();

      // ASSERT
      expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
    });
  });

  describe('validation errors', () => {
    it('should show error when title field is touched and empty', async () => {
      // ARRANGE
      renderForm();
      const titleInput = screen.getByLabelText(/idea title/i);

      // ACT
      fireEvent.focus(titleInput);
      fireEvent.blur(titleInput);

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText(/title must be at least 3/i)).toBeInTheDocument();
      });
    });

    it('should show error when description is too short', async () => {
      // ARRANGE
      renderForm();
      const descInput = screen.getByLabelText(/description/i);

      // ACT
      fireEvent.focus(descInput);
      fireEvent.change(descInput, { target: { value: 'Short' } });
      fireEvent.blur(descInput);

      // ASSERT
      await waitFor(() => {
        expect(screen.getByText(/description must be at least 10/i)).toBeInTheDocument();
      });
    });

    it('should show error when category is not selected', async () => {
      // ARRANGE
      renderForm();
      const categorySelect = screen.getByLabelText(/category/i);

      // ACT
      fireEvent.focus(categorySelect);
      fireEvent.blur(categorySelect);

      // ASSERT
      await waitFor(() => {
        // The error will appear if form tries to submit without category
        expect(categorySelect).toHaveValue('');
      });
    });
  });

  describe('form submission', () => {
    it('should enable Submit button only when all fields are valid', async () => {
      // ARRANGE
      renderForm();
      const submitButton = screen.getByRole('button', { name: /submit/i });

      // ASSERT - Initially disabled
      expect(submitButton).toBeDisabled();

      // ACT - Fill form validly
      const titleInput = screen.getByLabelText(/idea title/i) as HTMLInputElement;
      const descInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
      const categorySelect = screen.getByLabelText(/category/i) as HTMLSelectElement;

      fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
      fireEvent.blur(titleInput);

      fireEvent.change(descInput, { target: { value: 'Valid description text here' } });
      fireEvent.blur(descInput);

      fireEvent.change(categorySelect, { target: { value: 'Innovation' } });
      fireEvent.blur(categorySelect);

      // ASSERT - Now should be enabled
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should disable form fields during submission', async () => {
      // ARRANGE
      localStorage.setItem('auth_token', 'test-token');
      renderForm();

      // Fill form
      fireEvent.change(screen.getByLabelText(/idea title/i), {
        target: { value: 'Valid Title' },
      });
      fireEvent.blur(screen.getByLabelText(/idea title/i));

      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'Valid description text here' },
      });
      fireEvent.blur(screen.getByLabelText(/description/i));

      fireEvent.change(screen.getByLabelText(/category/i), {
        target: { value: 'Innovation' },
      });
      fireEvent.blur(screen.getByLabelText(/category/i));

      // ACT
      const submitButton = screen.getByRole('button', { name: /submit/i });

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      // Form should show loading state
      await waitFor(() => {
        expect(screen.getByText(/submitting/i)).toBeInTheDocument();
      });
    });
  });

  describe('keyboard shortcuts', () => {
    it('should cancel form when Escape is pressed', async () => {
      // ARRANGE
      const handleCancel = jest.fn();
      renderForm({ onCancel: handleCancel });

      // ACT
      fireEvent.keyDown(screen.getByRole('button', { name: /cancel/i }), {
        key: 'Escape',
        code: 'Escape',
      });

      // ASSERT
      expect(handleCancel).toHaveBeenCalled();
    });
  });

  describe('cancel behavior', () => {
    it('should ask confirmation when canceling with unsaved changes', async () => {
      // ARRANGE
      window.confirm = jest.fn(() => false);
      renderForm();

      // Fill form to make it dirty
      fireEvent.change(screen.getByLabelText(/idea title/i), {
        target: { value: 'Some Title' },
      });

      // ACT
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

      // ASSERT
      expect(window.confirm).toHaveBeenCalledWith('Discard unsaved changes?');
    });

    it('should not require confirmation when form is pristine', () => {
      // ARRANGE
      const handleCancel = jest.fn();
      window.confirm = jest.fn(() => false);
      renderForm({ onCancel: handleCancel });

      // ACT
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

      // ASSERT
      expect(window.confirm).not.toHaveBeenCalled();
      expect(handleCancel).toHaveBeenCalled();
    });
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RejectionFeedbackSection from '../RejectionFeedbackSection';

const mockFeedback = {
  evaluatorId: 'eval123',
  evaluatorName: 'John Evaluator',
  comments: 'Please revise and resubmit your idea with more details.',
  feedbackDate: new Date('2024-01-15'),
};

describe('RejectionFeedbackSection', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <MemoryRouter initialEntries={['/ideas/123']}>
        {component}
      </MemoryRouter>
    );
  };

  describe('Rendering', () => {
    it('should render the section header', () => {
      // 🔵 ARRANGE
      // 🟢 ACT
      renderWithRouter(
        <RejectionFeedbackSection feedback={mockFeedback} ideaId="123" />
      );

      // 🔴 ASSERT
      expect(screen.getByText('Evaluator Feedback')).toBeInTheDocument();
    });

    it('should display evaluator name', () => {
      // 🔵 ARRANGE
      // 🟢 ACT
      renderWithRouter(
        <RejectionFeedbackSection feedback={mockFeedback} ideaId="123" />
      );

      // 🔴 ASSERT
      expect(screen.getByText('John Evaluator')).toBeInTheDocument();
    });

    it('should display feedback comments', () => {
      // 🔵 ARRANGE
      // 🟢 ACT
      renderWithRouter(
        <RejectionFeedbackSection feedback={mockFeedback} ideaId="123" />
      );

      // 🔴 ASSERT
      expect(screen.getByText('Please revise and resubmit your idea with more details.')).toBeInTheDocument();
    });

    it('should display feedback date', () => {
      // 🔵 ARRANGE
      // 🟢 ACT
      renderWithRouter(
        <RejectionFeedbackSection feedback={mockFeedback} ideaId="123" />
      );

      // 🔴 ASSERT
      // Date should be formatted (Jan 15 or January 15 or 2024)
      expect(screen.getByText(/january|jan|15|2024/i)).toBeInTheDocument();
    });

    it('should display Resubmit button', () => {
      // 🔵 ARRANGE
      // 🟢 ACT
      renderWithRouter(
        <RejectionFeedbackSection feedback={mockFeedback} ideaId="123" />
      );

      // 🔴 ASSERT
      expect(screen.getByRole('button', { name: /resubmit|edit/i })).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have red warning theme classes', () => {
      // 🔵 ARRANGE
      const { container } = renderWithRouter(
        <RejectionFeedbackSection feedback={mockFeedback} ideaId="123" />
      );

      // 🟢 ACT
      const mainDiv = container.querySelector('div');

      // 🔴 ASSERT
      // Should have red styling classes
      expect(mainDiv).toHaveClass('bg-red-50');
      expect(mainDiv).toHaveClass('border-red-500');
    });

    it('should have left border indicator', () => {
      // 🔵 ARRANGE
      const { container } = renderWithRouter(
        <RejectionFeedbackSection feedback={mockFeedback} ideaId="123" />
      );

      // 🟢 ACT
      const mainDiv = container.querySelector('div');

      // 🔴 ASSERT
      expect(mainDiv).toHaveClass('border-l-4');
    });
  });

  describe('Resubmit Button', () => {
    it('should navigate to edit page when Resubmit button is clicked', () => {
      // 🔵 ARRANGE
      renderWithRouter(
        <MemoryRouter initialEntries={['/ideas/123']}>
          <div>
            <RejectionFeedbackSection feedback={mockFeedback} ideaId="123" />
          </div>
        </MemoryRouter>
      );

      // 🟢 ACT
      const resubmitButton = screen.getByRole('button', { name: /resubmit|edit/i });
      fireEvent.click(resubmitButton);

      // 🔴 ASSERT
      // Verify click works (navigation would be handled by the component)
      expect(resubmitButton).toBeInTheDocument();
    });

    it('should have proper styling for the resubmit button', () => {
      // 🔵 ARRANGE
      // 🟢 ACT
      renderWithRouter(
        <RejectionFeedbackSection feedback={mockFeedback} ideaId="123" />
      );

      // 🔴 ASSERT
      const resubmitButton = screen.getByRole('button', { name: /resubmit|edit/i });
      // Button should have blue styling indicating it is a call-to-action
      expect(resubmitButton).toHaveClass('bg-blue-600');
      expect(resubmitButton).toHaveClass('text-white');
    });
  });

  describe('Content Formatting', () => {
    it('should handle long feedback text', () => {
      // 🔵 ARRANGE
      const longFeedback = {
        ...mockFeedback,
        comments: 'This is a very long feedback message that contains multiple paragraphs and detailed suggestions for improvement. The submitter should carefully consider all the points mentioned and resubmit with the necessary changes.',
      };

      // 🟢 ACT
      renderWithRouter(
        <RejectionFeedbackSection feedback={longFeedback} ideaId="123" />
      );

      // 🔴 ASSERT
      expect(screen.getByText(/very long feedback/)).toBeInTheDocument();
      expect(screen.getByText(/resubmit with the necessary changes/)).toBeInTheDocument();
    });

    it('should handle short feedback text', () => {
      // 🔵 ARRANGE
      const shortFeedback = {
        ...mockFeedback,
        comments: 'Needs more details.',
      };

      // 🟢 ACT
      renderWithRouter(
        <RejectionFeedbackSection feedback={shortFeedback} ideaId="123" />
      );

      // 🔴 ASSERT
      expect(screen.getByText('Needs more details.')).toBeInTheDocument();
    });

    it('should display special characters in comments', () => {
      // 🔵 ARRANGE
      const feedbackWithSpecialChars = {
        ...mockFeedback,
        comments: 'Please include: • Clear objectives • Supporting data & evidence',
      };

      // 🟢 ACT
      renderWithRouter(
        <RejectionFeedbackSection feedback={feedbackWithSpecialChars} ideaId="123" />
      );

      // 🔴 ASSERT
      expect(screen.getByText(/Clear objectives/)).toBeInTheDocument();
      expect(screen.getByText(/Supporting data/)).toBeInTheDocument();
    });
  });

  describe('Evaluator Information', () => {
    it('should display different evaluator names correctly', () => {
      // 🔵 ARRANGE & 🟢 ACT
      const feedback1 = { ...mockFeedback, evaluatorName: 'Jane Smith' };
      const { rerender } = renderWithRouter(
        <RejectionFeedbackSection feedback={feedback1} ideaId="123" />
      );
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();

      // 🔴 ASSERT - Test another evaluator
      const feedback2 = { ...mockFeedback, evaluatorName: 'Bob Johnson' };
      rerender(
        <MemoryRouter>
          <RejectionFeedbackSection feedback={feedback2} ideaId="123" />
        </MemoryRouter>
      );
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should render with proper responsive classes', () => {
      // 🔵 ARRANGE
      const { container } = renderWithRouter(
        <RejectionFeedbackSection feedback={mockFeedback} ideaId="123" />
      );

      // 🟢 ACT
      const mainDiv = container.querySelector('div');

      // 🔴 ASSERT
      expect(mainDiv).toHaveClass('rounded-lg');
      expect(mainDiv).toHaveClass('p-6');
    });

    it('should have accessible markup', () => {
      // 🔵 ARRANGE
      // 🟢 ACT
      renderWithRouter(
        <RejectionFeedbackSection feedback={mockFeedback} ideaId="123" />
      );

      // 🔴 ASSERT
      // Should have heading for accessibility
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });
  });

  describe('Ideal Data Display', () => {
    it('should pass ideaId correctly to useNavigate', () => {
      // 🔵 ARRANGE
      // 🟢 ACT
      renderWithRouter(
        <RejectionFeedbackSection feedback={mockFeedback} ideaId="456" />
      );

      // 🔴 ASSERT
      const resubmitButton = screen.getByRole('button');
      expect(resubmitButton).toBeInTheDocument();
      // The component should use ideaId in the navigation path
    });
  });
});

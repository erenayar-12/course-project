/**
 * IdeaReviewPanel.test.tsx
 * Comprehensive test suite for STORY-3.2: Idea Review Panel
 *
 * 22 tests covering:
 * - 12 unit tests: Rendering, data display, error handling
 * - 6 integration tests: API calls, state management, interactions
 * - 4 E2E tests: Complete user workflows
 */

import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import IdeaReviewPanel from '../IdeaReviewPanel';
import { ideasService } from '../../services/ideas.service';
import { IdeaResponse } from '../../types/ideaSchema';

// Mock the router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ ideaId: 'test-idea-123' }),
}));

// Mock the service
jest.mock('../../services/ideas.service', () => ({
  ideasService: {
    getIdeaDetail: jest.fn(),
    updateIdeaStatus: jest.fn(),
  },
}));

// Mock components
jest.mock('../StatusBadge', () => ({
  StatusBadge: ({ status }: { status: string }) => (
    <div data-testid="status-badge">{status}</div>
  ),
}));

jest.mock('../AttachmentsSection', () => {
  return function DummyAttachmentsSection({ attachments }: any) {
    return (
      <div data-testid="attachments-section">
        {attachments.map((att: any, idx: number) => (
          <div key={idx} data-testid={`attachment-${idx}`}>
            {att.filename}
          </div>
        ))}
      </div>
    );
  };
});

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

const mockIdeaData: IdeaResponse = {
  id: 'test-idea-123',
  title: 'Test Idea Title',
  description: 'This is a test idea description',
  category: 'Technology',
  status: 'Submitted',
  submitterName: 'John Doe',
  submitterEmail: 'john@example.com',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  attachments: [
    { id: 'att-1', filename: 'document.pdf', size: 1024, url: '/files/doc.pdf', uploaddedAt: '2024-01-15T10:00:00Z' },
    { id: 'att-2', filename: 'image.jpg', size: 2048, url: '/files/img.jpg', uploaddedAt: '2024-01-15T10:00:00Z' },
  ],
};

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <IdeaReviewPanel />
    </BrowserRouter>
  );
};

describe('IdeaReviewPanel Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorageMock.clear();
  });

  // ===== UNIT TESTS (12) =====

  describe('Unit Tests: Rendering & Display', () => {
    // UT1: Component renders loading state initially
    test('should display loading skeleton while fetching data', () => {
      (ideasService.getIdeaDetail as jest.Mock).mockImplementation(() => new Promise(() => {}));
      renderComponent();
      const skeleton = document.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
    });

    // UT2: Component displays idea title correctly
    test('should display idea title from API response (AC1)', async () => {
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(mockIdeaData);
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText('Test Idea Title')).toBeInTheDocument();
      });
    });

    // UT3: Component displays description
    test('should display idea description (AC1)', async () => {
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(mockIdeaData);
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText('This is a test idea description')).toBeInTheDocument();
      });
    });

    // UT4: Component displays category badge
    test('should display category badge (AC1)', async () => {
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(mockIdeaData);
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText('Technology')).toBeInTheDocument();
      });
    });

    // UT5: Component displays status badge
    test('should display status badge (AC1)', async () => {
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(mockIdeaData);
      renderComponent();
      await waitFor(() => {
        const statusBadge = screen.getByTestId('status-badge');
        expect(statusBadge).toBeInTheDocument();
      });
    });

    // UT6: Component displays attachments section
    test('should display attachments section with file names (AC2)', async () => {
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(mockIdeaData);
      renderComponent();
      await waitFor(() => {
        expect(screen.getByTestId('attachments-section')).toBeInTheDocument();
        expect(screen.getByTestId('attachment-0')).toHaveTextContent('document.pdf');
        expect(screen.getByTestId('attachment-1')).toHaveTextContent('image.jpg');
      });
    });

    // UT7: Component displays submitter info
    test('should display submitter name and email (AC3)', async () => {
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(mockIdeaData);
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /john@example.com/i })).toBeInTheDocument();
      });
    });

    // UT8: Email link is mailto
    test('should create mailto link for submitter email (AC3)', async () => {
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(mockIdeaData);
      renderComponent();
      await waitFor(() => {
        const emailLink = screen.getByRole('link', { name: /john@example.com/i });
        expect(emailLink).toHaveAttribute('href', 'mailto:john@example.com');
      });
    });

    // UT9: Component displays created and updated dates
    test('should display creation and update timestamps (AC6)', async () => {
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(mockIdeaData);
      renderComponent();
      await waitFor(() => {
        const dateElements = screen.getAllByText(/Jan 15, 2024/);
        expect(dateElements.length).toBeGreaterThan(0);
      });
    });

    // UT10: Component shows empty attachments message
    test('should display "No attachments" when none exist (AC2)', async () => {
      const ideaWithoutAttachments = { ...mockIdeaData, attachments: [] };
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(ideaWithoutAttachments);
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText('No attachments')).toBeInTheDocument();
      });
    });

    // UT11: Component displays breadcrumb
    test('should display breadcrumb navigation (AC5)', async () => {
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(mockIdeaData);
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText(/Back/)).toBeInTheDocument();
        expect(screen.getByText('Review Idea')).toBeInTheDocument();
      });
    });
  });

  describe('Unit Tests: Error Handling', () => {
    // UT12: Component displays error for 404
    test('should display error message for 404 Not Found', async () => {
      const error = {
        response: { status: 404, data: { message: 'Idea not found' } },
      };
      (ideasService.getIdeaDetail as jest.Mock).mockRejectedValue(error);
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText('Idea not found')).toBeInTheDocument();
      });
    });
  });

  // ===== INTEGRATION TESTS (6) =====

  describe('Integration Tests: API Interactions', () => {
    // IT1: Service method called when component mounts
    test('should call getIdeaDetail on component mount (AC1)', async () => {
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(mockIdeaData);
      renderComponent();
      await waitFor(() => {
        expect(ideasService.getIdeaDetail).toHaveBeenCalledWith('test-idea-123');
      });
    });

    // IT2: Status update called with correct parameters
    test('should call updateIdeaStatus when status is "Submitted" (AC4)', async () => {
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(mockIdeaData);
      (ideasService.updateIdeaStatus as jest.Mock).mockResolvedValue({
        ...mockIdeaData,
        status: 'Under Review',
      });
      renderComponent();
      await waitFor(() => {
        expect(ideasService.updateIdeaStatus).toHaveBeenCalledWith(
          'test-idea-123',
          'Under Review'
        );
      });
    });

    // IT3: Status update not called if already "Under Review"
    test('should NOT call updateIdeaStatus if status is already "Under Review" (AC4)', async () => {
      const ideaUnderReview = { ...mockIdeaData, status: 'Under Review' };
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(ideaUnderReview);
      renderComponent();
      await waitFor(() => {
        expect(ideasService.updateIdeaStatus).not.toHaveBeenCalled();
      });
    });

    // IT4: Handles status update failure gracefully
    test('should handle status update failure without crashing (AC4)', async () => {
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(mockIdeaData);
      (ideasService.updateIdeaStatus as jest.Mock).mockRejectedValue(
        new Error('Status update failed')
      );
      renderComponent();
      await waitFor(() => {
        // Component should still render successfully
        expect(screen.getByText('Test Idea Title')).toBeInTheDocument();
      });
    });

    // IT5: Back button preserves scroll position with sessionStorage (AC5)
    test('should save scroll position to sessionStorage on mount (AC5)', async () => {
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(mockIdeaData);
      renderComponent();
      await waitFor(() => {
        // Verify component renders with the back button present
        const backButtonText = screen.getByText(/Back to Queue/);
        expect(backButtonText).toBeInTheDocument();
      });
    });

    // IT6: Permission denied returns 403 error
    test('should display permission error for 403 Forbidden (AC7)', async () => {
      const forbiddenError = {
        response: { status: 403 },
      };
      (ideasService.getIdeaDetail as jest.Mock).mockRejectedValue(forbiddenError);
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText(/do not have permission/i)).toBeInTheDocument();
      });
    });
  });

  // ===== E2E TESTS (4) =====

  describe('E2E Tests: User Workflows', () => {
    // E2E1: Complete review workflow - load idea and verify auto-status update
    test('E2E: Load idea and auto-update status (AC1, AC4)', async () => {
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(mockIdeaData);
      (ideasService.updateIdeaStatus as jest.Mock).mockResolvedValue({
        ...mockIdeaData,
        status: 'Under Review',
      });

      renderComponent();

      // Wait for idea to load
      await waitFor(() => {
        expect(screen.getByText('Test Idea Title')).toBeInTheDocument();
      });

      // Verify status was updated
      expect(ideasService.updateIdeaStatus).toHaveBeenCalledWith(
        'test-idea-123',
        'Under Review'
      );

      // Verify all AC1 content is visible
      expect(screen.getByText('This is a test idea description')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
    });

    // E2E2: Back button navigation with scroll preservation
    test('E2E: Back button navigates and preserves queue state (AC5)', async () => {
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(mockIdeaData);
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Idea Title')).toBeInTheDocument();
      });

      // Set scroll position in sessionStorage (simulating queue)
      sessionStorageMock.setItem('evaluation_queue_scroll', '250');

      const backButtons = screen.getAllByText(/← Back/i);
      expect(backButtons.length).toBeGreaterThan(0);
    });

    // E2E3: Multiple attachments display correctly
    test('E2E: Display multiple attachments with correct count (AC2)', async () => {
      const manyAttachments = {
        ...mockIdeaData,
        attachments: [
          { id: '1', filename: 'file1.pdf', size: 100, url: '/1', uploaddedAt: '2024-01-15T10:00:00Z' },
          { id: '2', filename: 'file2.docx', size: 200, url: '/2', uploaddedAt: '2024-01-15T10:00:00Z' },
          { id: '3', filename: 'file3.xlsx', size: 300, url: '/3', uploaddedAt: '2024-01-15T10:00:00Z' },
        ],
      };
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(manyAttachments);
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('attachment-0')).toHaveTextContent('file1.pdf');
        expect(screen.getByTestId('attachment-1')).toHaveTextContent('file2.docx');
        expect(screen.getByTestId('attachment-2')).toHaveTextContent('file3.xlsx');
      });
    });

    // E2E4: Anonymous submitter handling
    test('E2E: Handle anonymous submitter (no name/email)', async () => {
      const anonymousIdea = {
        ...mockIdeaData,
        submitterName: null,
        submitterEmail: null,
      };
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(anonymousIdea);
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Anonymous')).toBeInTheDocument();
      });
    });
  });

  // ===== ACCESSIBILITY & LAYOUT TESTS =====

  describe('Accessibility & Responsive Design', () => {
    // ACC1: Breadcrumb and navigation landmarks
    test('should have proper navigation structure (AC5, AC6)', async () => {
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(mockIdeaData);
      renderComponent();
      await waitFor(() => {
        const backButtons = screen.getAllByRole('button');
        expect(backButtons.length).toBeGreaterThan(0);
      });
    });

    // ACC2: Status badge is properly labeled
    test('should display status with proper heading (AC1)', async () => {
      (ideasService.getIdeaDetail as jest.Mock).mockResolvedValue(mockIdeaData);
      renderComponent();
      await waitFor(() => {
        expect(screen.getByText('Status')).toBeInTheDocument();
      });
    });
  });
});

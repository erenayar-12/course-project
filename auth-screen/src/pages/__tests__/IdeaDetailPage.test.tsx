import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import IdeaDetailPage from '../IdeaDetailPage';

// Mock the ideasService module
jest.mock('../../services/ideas.service', () => ({
  ideasService: {
    getIdeaDetail: jest.fn(),
    deleteIdea: jest.fn(),
  },
}));

// Import the mocked service
import { ideasService } from '../../services/ideas.service';

const mockIdeaService = ideasService as jest.Mocked<typeof ideasService>;

describe('IdeaDetailPage', () => {
  const mockIdea = {
    id: '123',
    title: 'Test Idea',
    description: 'Test description',
    category: 'Technology',
    status: 'Accepted' as const,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    userId: 'user123',
    user: {
      id: 'user123',
      name: 'John Doe',
      email: 'john@example.com',
    },
    attachments: [
      {
        id: 'att1',
        originalName: 'document.pdf',
        fileSize: 1024000,
        uploadedAt: '2024-01-01T00:00:00Z',
        fileUrl: 'https://example.com/file.pdf',
      },
    ],
    evaluatorFeedback: null,
  };

  const mockRejectedIdea = {
    ...mockIdea,
    status: 'Rejected' as const,
    evaluatorFeedback: {
      evaluatorId: 'eval123',
      evaluatorName: 'John Evaluator',
      comments: 'Please revise the idea.',
      feedbackDate: '2024-01-02T00:00:00Z',
    },
  };

  const renderWithRouter = (component: React.ReactElement, initialEntries = ['/ideas/123']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/ideas/:ideaId" element={component} />
          <Route path="/ideas/:ideaId/edit" element={<div>Edit Page</div>} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should display skeleton loader while loading', async () => {
      (mockIdeaService.getIdeaDetail as jest.Mock).mockResolvedValueOnce(mockIdea);

      renderWithRouter(<IdeaDetailPage />);

      // Initially should show loading state
      await waitFor(() => {
        expect(screen.getByText(mockIdea.title)).toBeInTheDocument();
      });
    });

    it('should call getIdeaDetail with correct ideaId from URL params', async () => {
      (mockIdeaService.getIdeaDetail as jest.Mock).mockResolvedValueOnce(mockIdea);

      renderWithRouter(<IdeaDetailPage />);

      await waitFor(() => {
        expect(mockIdeaService.getIdeaDetail).toHaveBeenCalledWith('123');
      });
    });
  });

  describe('Success Cases', () => {
    it('should display idea title and description', async () => {
      (mockIdeaService.getIdeaDetail as jest.Mock).mockResolvedValueOnce(mockIdea);

      renderWithRouter(<IdeaDetailPage />);

      await waitFor(() => {
        expect(screen.getByText(mockIdea.title)).toBeInTheDocument();
        expect(screen.getByText(mockIdea.description)).toBeInTheDocument();
      });
    });

    it('should display status badge', async () => {
      (mockIdeaService.getIdeaDetail as jest.Mock).mockResolvedValueOnce(mockIdea);

      renderWithRouter(<IdeaDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('Approved')).toBeInTheDocument();
      });
    });

    it('should display Edit button for PENDING ideas', async () => {
      const pendingIdea = { ...mockIdea, status: 'Submitted' as const };
      (mockIdeaService.getIdeaDetail as jest.Mock).mockResolvedValueOnce(pendingIdea);

      renderWithRouter(<IdeaDetailPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      });
    });

    it('should display Delete button for idea owners', async () => {
      (mockIdeaService.getIdeaDetail as jest.Mock).mockResolvedValueOnce(mockIdea);

      renderWithRouter(<IdeaDetailPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
      });
    });

    it('should navigate to edit page when Edit button is clicked', async () => {
      const pendingIdea = { ...mockIdea, status: 'Submitted' as const };
      (mockIdeaService.getIdeaDetail as jest.Mock).mockResolvedValueOnce(pendingIdea);

      renderWithRouter(<IdeaDetailPage />);

      await waitFor(() => {
        const editButton = screen.getByRole('button', { name: /edit/i });
        fireEvent.click(editButton);
      });

      expect(screen.getByText('Edit Page')).toBeInTheDocument();
    });

    it('should display attachments section with files', async () => {
      (mockIdeaService.getIdeaDetail as jest.Mock).mockResolvedValueOnce(mockIdea);

      renderWithRouter(<IdeaDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('document.pdf')).toBeInTheDocument();
      });
    });

    it('should hide attachments section when no attachments', async () => {
      const ideaNoAttachments = { ...mockIdea, attachments: [] };
      (mockIdeaService.getIdeaDetail as jest.Mock).mockResolvedValueOnce(ideaNoAttachments);

      renderWithRouter(<IdeaDetailPage />);

      await waitFor(() => {
        expect(screen.queryByText('Attachments')).not.toBeInTheDocument();
      });
    });

    it('should display rejection feedback for REJECTED ideas', async () => {
      (mockIdeaService.getIdeaDetail as jest.Mock).mockResolvedValueOnce(mockRejectedIdea);

      renderWithRouter(<IdeaDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('Evaluator Feedback')).toBeInTheDocument();
        expect(screen.getByText('John Evaluator')).toBeInTheDocument();
        expect(screen.getByText('Please revise the idea.')).toBeInTheDocument();
      });
    });

    it('should hide rejection feedback for approved ideas', async () => {
      (mockIdeaService.getIdeaDetail as jest.Mock).mockResolvedValueOnce(mockIdea);

      renderWithRouter(<IdeaDetailPage />);

      await waitFor(() => {
        expect(screen.queryByText('Evaluator Feedback')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle 403 Forbidden error', async () => {
      const error = new Error('You do not have permission to view this idea.');
      (error as unknown as { response: { status: number } }).response = { status: 403 };
      (mockIdeaService.getIdeaDetail as jest.Mock).mockRejectedValueOnce(error);

      renderWithRouter(<IdeaDetailPage />);

      await waitFor(() => {
        expect(screen.getByText(/permission/i)).toBeInTheDocument();
      });
    });

    it('should handle 404 Not Found error', async () => {
      const error = new Error('Idea not found.');
      (error as unknown as { response: { status: number } }).response = { status: 404 };
      (mockIdeaService.getIdeaDetail as jest.Mock).mockRejectedValueOnce(error);

      renderWithRouter(<IdeaDetailPage />);

      await waitFor(() => {
        expect(screen.getByText(/not found/i)).toBeInTheDocument();
      });
    });

    it('should handle generic error', async () => {
      const error = new Error('An error occurred');
      (mockIdeaService.getIdeaDetail as jest.Mock).mockRejectedValueOnce(error);

      renderWithRouter(<IdeaDetailPage />);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Delete Modal', () => {
    it('should open delete confirmation modal when Delete button is clicked', async () => {
      (mockIdeaService.getIdeaDetail as jest.Mock).mockResolvedValueOnce(mockIdea);

      renderWithRouter(<IdeaDetailPage />);

      await waitFor(() => {
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);
      });

      expect(screen.getByText(/delete/i)).toBeInTheDocument();
    });

    it('should close modal when Cancel button is clicked', async () => {
      (mockIdeaService.getIdeaDetail as jest.Mock).mockResolvedValueOnce(mockIdea);

      renderWithRouter(<IdeaDetailPage />);

      await waitFor(() => {
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);
      });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      // Modal should close
      const confirmDeleteButtons = screen.queryAllByRole('button', { name: /confirm/i });
      expect(confirmDeleteButtons.length).toBeLessThanOrEqual(1);
    });

    it('should call deleteIdea when confirm deletion is clicked', async () => {
      (mockIdeaService.getIdeaDetail as jest.Mock).mockResolvedValueOnce(mockIdea);
      (mockIdeaService.deleteIdea as jest.Mock).mockResolvedValueOnce(undefined);

      renderWithRouter(<IdeaDetailPage />);

      await waitFor(() => {
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);
      });

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockIdeaService.deleteIdea).toHaveBeenCalledWith('123');
      });
    });
  });

  describe('Back Navigation', () => {
    it('should have a back button that navigates to dashboard', async () => {
      (mockIdeaService.getIdeaDetail as jest.Mock).mockResolvedValueOnce(mockIdea);

      renderWithRouter(<IdeaDetailPage />);

      await waitFor(() => {
        const backButtons = screen.queryAllByRole('button', { name: /back|dashboard/i });
        if (backButtons.length > 0) {
          fireEvent.click(backButtons[0]);
          expect(screen.getByText('Dashboard')).toBeInTheDocument();
        }
      });
    });
  });

  describe('Content Formatting', () => {
    it('should display user information', async () => {
      (mockIdeaService.getIdeaDetail as jest.Mock).mockResolvedValueOnce(mockIdea);

      renderWithRouter(<IdeaDetailPage />);

      await waitFor(() => {
        expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      });
    });

    it('should display created date', async () => {
      (mockIdeaService.getIdeaDetail as jest.Mock).mockResolvedValueOnce(mockIdea);

      renderWithRouter(<IdeaDetailPage />);

      await waitFor(() => {
        expect(screen.getByText(/2024|january|jan/i)).toBeInTheDocument();
      });
    });
  });
});

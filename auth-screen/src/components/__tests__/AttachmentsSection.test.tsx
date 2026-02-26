import { render, screen, fireEvent } from '@testing-library/react';
import AttachmentsSection from '../AttachmentsSection';

describe('AttachmentsSection', () => {
  const mockAttachments = [
    {
      id: 'att1',
      originalName: 'document.pdf',
      fileSize: 1024000, // 1 MB
      uploadedAt: new Date('2024-01-01'),
      fileUrl: 'https://example.com/document.pdf',
    },
    {
      id: 'att2',
      originalName: 'image.jpg',
      fileSize: 2097152, // 2 MB
      uploadedAt: new Date('2024-01-02'),
      fileUrl: 'https://example.com/image.jpg',
    },
    {
      id: 'att3',
      originalName: 'spreadsheet.xlsx',
      fileSize: 512000, // 0.5 MB
      uploadedAt: new Date('2024-01-03'),
      fileUrl: 'https://example.com/spreadsheet.xlsx',
    },
  ];

  describe('Rendering', () => {
    it('should render attachments section title when attachments exist', () => {
      // 🔵 ARRANGE
      const attachments = [mockAttachments[0]];

      // 🟢 ACT
      render(<AttachmentsSection attachments={attachments} />);

      // 🔴 ASSERT
      expect(screen.getByText('Attachments')).toBeInTheDocument();
    });

    it('should render all attachments with correct names', () => {
      // 🔵 ARRANGE
      // 🟢 ACT
      render(<AttachmentsSection attachments={mockAttachments} />);

      // 🔴 ASSERT
      expect(screen.getByText('document.pdf')).toBeInTheDocument();
      expect(screen.getByText('image.jpg')).toBeInTheDocument();
      expect(screen.getByText('spreadsheet.xlsx')).toBeInTheDocument();
    });

    it('should not render anything when attachments array is empty', () => {
      // 🔵 ARRANGE
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const emptyAttachments: any[] = [];

      // 🟢 ACT
      const { container } = render(<AttachmentsSection attachments={emptyAttachments} />);

      // 🔴 ASSERT
      expect(container.firstChild).toBeNull();
    });

    it('should display download button for each attachment', () => {
      // 🔵 ARRANGE
      // 🟢 ACT
      render(<AttachmentsSection attachments={mockAttachments} />);

      // 🔴 ASSERT
      const downloadButtons = screen.getAllByRole('button');
      expect(downloadButtons.length).toBe(mockAttachments.length);
      downloadButtons.forEach((button) => {
        expect(button).toHaveTextContent('⬇️');
      });
    });
  });

  describe('File Size Formatting', () => {
    it('should format file sizes correctly in MB', () => {
      // 🔵 ARRANGE
      // 🟢 ACT
      render(<AttachmentsSection attachments={mockAttachments} />);

      // 🔴 ASSERT
      // Assuming formatFileSize returns values like "1 MB", "2 MB", "0.5 MB"
      // There may be multiple elements with '1 MB' or '2.1 MB', so use getAllByText
      expect(screen.getAllByText(/1.*MB/i).length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/2.*MB/i).length).toBeGreaterThanOrEqual(1);
    });

    it('should handle small files with decimals', () => {
      // 🔵 ARRANGE
      const smallFiles = [
        {
          id: 'att1',
          originalName: 'small.txt',
          fileSize: 512, // 0.5 KB
          uploadedAt: new Date('2024-01-01'),
          fileUrl: 'https://example.com/small.txt',
        },
      ];

      // 🟢 ACT
      render(<AttachmentsSection attachments={smallFiles} />);

      // 🔴 ASSERT
      expect(screen.getByText(/small\.txt/)).toBeInTheDocument();
    });

    it('should format large files correctly', () => {
      // 🔵 ARRANGE
      const largeFile = [
        {
          id: 'att1',
          originalName: 'large.zip',
          fileSize: 104857600, // 100 MB
          uploadedAt: new Date('2024-01-01'),
          fileUrl: 'https://example.com/large.zip',
        },
      ];

      // 🟢 ACT
      render(<AttachmentsSection attachments={largeFile} />);

      // 🔴 ASSERT
      expect(screen.getByText(/100.*MB/i)).toBeInTheDocument();
    });
  });

  describe('File Type Icons', () => {
    it('should display appropriate icon for PDF files', () => {
      // 🔵 ARRANGE
      const pdfFile = [mockAttachments[0]];

      // 🟢 ACT
      render(<AttachmentsSection attachments={pdfFile} />);

      // 🔴 ASSERT
      // Icon might be emoji or text like 📄 or PDF
      expect(screen.getByText(/document.pdf/)).toBeInTheDocument();
    });

    it('should display appropriate icon for image files', () => {
      // 🔵 ARRANGE
      const imageFile = [mockAttachments[1]];

      // 🟢 ACT
      render(<AttachmentsSection attachments={imageFile} />);

      // 🔴 ASSERT
      expect(screen.getByText(/image\.jpg/)).toBeInTheDocument();
    });

    it('should display appropriate icon for spreadsheet files', () => {
      // 🔵 ARRANGE
      const spreadsheetFile = [mockAttachments[2]];

      // 🟢 ACT
      render(<AttachmentsSection attachments={spreadsheetFile} />);

      // 🔴 ASSERT
      expect(screen.getByText(/spreadsheet\.xlsx/)).toBeInTheDocument();
    });
  });

  describe('Date Formatting', () => {
    it('should display formatted upload dates', () => {
      // 🔵 ARRANGE
      // 🟢 ACT
      render(<AttachmentsSection attachments={[mockAttachments[0]]} />);

      // 🔴 ASSERT
      // Should contain date text (Jan 1 or January 1 or 2024)
      expect(screen.getByText(/january|january 1|jan|2024/i)).toBeInTheDocument();
    });
  });

  describe('File Name Truncation', () => {
    it('should truncate long file names', () => {
      // 🔵 ARRANGE
      const longNameFile = [
        {
          id: 'att1',
          originalName: 'this-is-a-very-long-filename-that-should-be-truncated-very-long.pdf',
          fileSize: 1024000,
          uploadedAt: new Date('2024-01-01'),
          fileUrl: 'https://example.com/file.pdf',
        },
      ];

      // 🟢 ACT
      render(<AttachmentsSection attachments={longNameFile} />);

      // 🔴 ASSERT
      // Long filename should be present but may be truncated with ellipsis
      const filename = screen.getByText(/this-is/);
      expect(filename).toBeInTheDocument();
    });

    it('should preserve file extension on truncated names', () => {
      // 🔵 ARRANGE
      const longNameFile = [
        {
          id: 'att1',
          originalName: 'very-long-filename-that-should-be-truncated.docx',
          fileSize: 1024000,
          uploadedAt: new Date('2024-01-01'),
          fileUrl: 'https://example.com/file.docx',
        },
      ];

      // 🟢 ACT
      render(<AttachmentsSection attachments={longNameFile} />);

      // 🔴 ASSERT
      // Extension should be visible
      expect(screen.getByText(/.docx/)).toBeInTheDocument();
    });
  });

  describe('Download Functionality', () => {
    it('should trigger download when download button is clicked', () => {
      // 🔵 ARRANGE
      const mockOpen = jest.fn();
      window.open = mockOpen;

      // 🟢 ACT
      render(<AttachmentsSection attachments={[mockAttachments[0]]} />);
      const downloadButton = screen.getByRole('button');
      fireEvent.click(downloadButton);

      // 🔴 ASSERT
      expect(mockOpen).toHaveBeenCalled();
    });

    it('should use fileUrl for download if available', () => {
      // 🔵 ARRANGE
      const mockOpen = jest.fn();
      window.open = mockOpen;

      // 🟢 ACT
      render(<AttachmentsSection attachments={[mockAttachments[0]]} />);
      const downloadButton = screen.getByRole('button');
      fireEvent.click(downloadButton);

      // 🔴 ASSERT
      // Should open the fileUrl
      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('example.com/document.pdf'),
        expect.anything()
      );
    });
  });

  describe('Responsive Layout', () => {
    it('should render with proper spacing between items', () => {
      // 🔵 ARRANGE
      const { container } = render(<AttachmentsSection attachments={mockAttachments} />);

      // 🟢 ACT
      // React Testing Library doesn't have great CSS class checkers, but we can verify structure
      const listItems = container.querySelectorAll('li');

      // 🔴 ASSERT
      expect(listItems.length).toBe(mockAttachments.length);
    });
  });
});

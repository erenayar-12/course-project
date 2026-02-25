import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUploadInput } from '../FileUploadInput';

describe('FileUploadInput', () => {
  const mockOnFileSelect = jest.fn();

  beforeEach(() => {
    mockOnFileSelect.mockClear();
  });

  describe('Rendering', () => {
    it('should render the component with label', () => {
      render(
        <FileUploadInput
          onFileSelect={mockOnFileSelect}
          selectedFile={null}
        />
      );

      expect(screen.getByText('Supporting Files')).toBeInTheDocument();
      expect(screen.getByText(/Optional/i)).toBeInTheDocument();
    });

    it('should render drag-drop zone when no file selected', () => {
      render(
        <FileUploadInput
          onFileSelect={mockOnFileSelect}
          selectedFile={null}
        />
      );

      expect(screen.getByText(/Drag and drop your file here/i)).toBeInTheDocument();
      expect(screen.getByText(/PDF, Word, Excel, or Image files up to 10MB/i)).toBeInTheDocument();
    });

    it('should display error message when provided', () => {
      const errorMsg = 'File size exceeds 10MB limit';
      render(
        <FileUploadInput
          onFileSelect={mockOnFileSelect}
          selectedFile={null}
          error={errorMsg}
        />
      );

      expect(screen.getByText(errorMsg)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should be disabled when disabled prop is true', () => {
      render(
        <FileUploadInput
          onFileSelect={mockOnFileSelect}
          selectedFile={null}
          disabled={true}
        />
      );

      const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
      expect(fileInput.disabled).toBe(true);
    });
  });

  describe('File Selection', () => {
    it('should call onFileSelect when file is chosen via input', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <FileUploadInput
          onFileSelect={mockOnFileSelect}
          selectedFile={null}
        />
      );

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      await user.upload(fileInput, file);

      expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    });

    it('should display file preview when file is selected', () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      render(
        <FileUploadInput
          onFileSelect={mockOnFileSelect}
          selectedFile={mockFile}
        />
      );

      expect(screen.getByText('test.pdf')).toBeInTheDocument();
      expect(screen.getByText(/Bytes/i)).toBeInTheDocument();
    });

    it('should show Remove button when file is selected', () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      render(
        <FileUploadInput
          onFileSelect={mockOnFileSelect}
          selectedFile={mockFile}
        />
      );

      const removeBtn = screen.getByTestId('remove-file-btn');
      expect(removeBtn).toBeInTheDocument();
    });

    it('should call onFileSelect(null) when Remove button clicked', () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      render(
        <FileUploadInput
          onFileSelect={mockOnFileSelect}
          selectedFile={mockFile}
        />
      );

      const removeBtn = screen.getByTestId('remove-file-btn');
      fireEvent.click(removeBtn);

      expect(mockOnFileSelect).toHaveBeenCalledWith(null);
    });
  });

  describe('Drag and Drop', () => {
    it('should highlight zone on drag over', () => {
      const { container } = render(
        <FileUploadInput
          onFileSelect={mockOnFileSelect}
          selectedFile={null}
        />
      );

      const dropZone = container.querySelector('.drag-drop-zone') as HTMLElement;
      fireEvent.dragOver(dropZone);

      expect(dropZone).toHaveClass('border-blue-500');
      expect(dropZone).toHaveClass('bg-blue-50');
    });

    it('should remove highlight on drag leave', () => {
      const { container } = render(
        <FileUploadInput
          onFileSelect={mockOnFileSelect}
          selectedFile={null}
        />
      );

      const dropZone = container.querySelector('.drag-drop-zone') as HTMLElement;

      fireEvent.dragOver(dropZone);
      expect(dropZone).toHaveClass('border-blue-500');

      fireEvent.dragLeave(dropZone);
      expect(dropZone).not.toHaveClass('border-blue-500');
    });

    // Drag and drop file event testing covered in E2E tests (Cypress)
    // Native DragEvent not available in Jest environment

    it('should handle click to browse when not disabled', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <FileUploadInput
          onFileSelect={mockOnFileSelect}
          selectedFile={null}
        />
      );

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;

      // Mock the click handler
      const clickSpy = jest.spyOn(fileInput, 'click');

      const browseArea = screen.getByText(/click to browse/i).closest('[role="button"]');
      if (browseArea) {
        await user.click(browseArea);
      }

      expect(clickSpy).toHaveBeenCalled();
      clickSpy.mockRestore();
    });
  });

  describe('File Size Formatting', () => {
    it('should format file size correctly', () => {
      const file = new File(['x'.repeat(1024 * 5)], 'test.pdf', { type: 'application/pdf' }); // 5KB

      render(
        <FileUploadInput
          onFileSelect={mockOnFileSelect}
          selectedFile={file}
        />
      );

      // Should display KB format
      expect(screen.getByText(/KB/i)).toBeInTheDocument();
    });

    it('should display empty file size as 0 Bytes', () => {
      const file = new File([], 'empty.pdf', { type: 'application/pdf' });

      render(
        <FileUploadInput
          onFileSelect={mockOnFileSelect}
          selectedFile={file}
        />
      );

      expect(screen.getByText('0 Bytes')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA role alert for error message', () => {
      render(
        <FileUploadInput
          onFileSelect={mockOnFileSelect}
          selectedFile={null}
          error="Test error"
        />
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should have proper file input attributes', () => {
      const { container } = render(
        <FileUploadInput
          onFileSelect={mockOnFileSelect}
          selectedFile={null}
        />
      );

      const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput.accept).toBe('.pdf,.doc,.docx,.png,.jpg,.jpeg,.xls,.xlsx');
    });

    it('should be keyboard navigable', () => {
      const { container } = render(
        <FileUploadInput
          onFileSelect={mockOnFileSelect}
          selectedFile={null}
        />
      );

      const dropZone = container.querySelector('[role="button"]');
      expect(dropZone).toHaveAttribute('tabIndex');
    });
  });
});

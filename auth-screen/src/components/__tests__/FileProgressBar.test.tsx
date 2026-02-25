import { render, screen } from '@testing-library/react';
import { FileProgressBar } from '../FileProgressBar';

describe('FileProgressBar', () => {
  describe('Rendering', () => {
    it('should not render when isUploading is false', () => {
      const { container } = render(
        <FileProgressBar
          progress={0}
          isUploading={false}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render when isUploading is true', () => {
      render(
        <FileProgressBar
          progress={0}
          isUploading={true}
        />
      );

      expect(screen.getByText('Uploading file...')).toBeInTheDocument();
    });

    it('should display progress percentage', () => {
      render(
        <FileProgressBar
          progress={45}
          isUploading={true}
        />
      );

      expect(screen.getByTestId('progress-percentage')).toHaveTextContent('45%');
    });

    it('should display file name when provided', () => {
      render(
        <FileProgressBar
          progress={50}
          isUploading={true}
          fileName="document.pdf"
        />
      );

      expect(screen.getByText('document.pdf')).toBeInTheDocument();
    });

    it('should handle 0% progress', () => {
      render(
        <FileProgressBar
          progress={0}
          isUploading={true}
        />
      );

      expect(screen.getByTestId('progress-percentage')).toHaveTextContent('0%');
    });

    it('should handle 100% progress', () => {
      render(
        <FileProgressBar
          progress={100}
          isUploading={true}
        />
      );

      expect(screen.getByTestId('progress-percentage')).toHaveTextContent('100%');
    });

    it('should handle decimal progress values', () => {
      render(
        <FileProgressBar
          progress={33.33}
          isUploading={true}
        />
      );

      expect(screen.getByTestId('progress-percentage')).toHaveTextContent('33%');
    });
  });

  describe('Progress Bar Styling', () => {
    it('should have progress bar container with correct structure', () => {
      render(
        <FileProgressBar
          progress={50}
          isUploading={true}
        />
      );

      const progressContainer = screen.getByTestId('progress-container');
      expect(progressContainer).toHaveClass('file-progress-container');
      expect(progressContainer).toHaveClass('bg-blue-50');
      expect(progressContainer).toHaveClass('rounded-lg');
    });

    it('should render progress bar with correct width', () => {
      const { rerender } = render(
        <FileProgressBar
          progress={25}
          isUploading={true}
        />
      );

      let progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveStyle({ width: '25%' });

      rerender(
        <FileProgressBar
          progress={50}
          isUploading={true}
        />
      );

      progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveStyle({ width: '50%' });

      rerender(
        <FileProgressBar
          progress={100}
          isUploading={true}
        />
      );

      progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveStyle({ width: '100%' });
    });

    it('should have blue progress bar styling', () => {
      render(
        <FileProgressBar
          progress={50}
          isUploading={true}
        />
      );

      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar).toHaveClass('bg-blue-600');
      expect(progressBar).toHaveClass('h-2');
      expect(progressBar).toHaveClass('rounded-full');
    });
  });

  describe('Accessibility', () => {
    it('should have semantic HTML structure', () => {
      render(
        <FileProgressBar
          progress={50}
          isUploading={true}
          fileName="test.pdf"
        />
      );

      expect(screen.getByText('Uploading file...')).toBeInTheDocument();
      expect(screen.getByTestId('progress-container')).toBeInTheDocument();
    });

    it('should display progress percentage for accessibility', () => {
      render(
        <FileProgressBar
          progress={75}
          isUploading={true}
        />
      );

      const percentage = screen.getByTestId('progress-percentage');
      expect(percentage).toHaveTextContent('75%');
    });
  });

  describe('Long File Names', () => {
    it('should truncate long file names', () => {
      const longFileName = 'this-is-a-very-long-file-name-that-should-be-truncated-because-it-is-too-long.pdf';

      render(
        <FileProgressBar
          progress={50}
          isUploading={true}
          fileName={longFileName}
        />
      );

      const fileNameElement = screen.getByText(longFileName);
      expect(fileNameElement).toHaveClass('truncate');
    });
  });

  describe('State Transitions', () => {
    it('should transition from uploading to not uploading', () => {
      const { rerender, container } = render(
        <FileProgressBar
          progress={50}
          isUploading={true}
        />
      );

      expect(screen.getByText('Uploading file...')).toBeInTheDocument();

      rerender(
        <FileProgressBar
          progress={100}
          isUploading={false}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should handle rapid progress updates', () => {
      const { rerender } = render(
        <FileProgressBar
          progress={0}
          isUploading={true}
        />
      );

      for (let i = 10; i <= 100; i += 10) {
        rerender(
          <FileProgressBar
            progress={i}
            isUploading={true}
          />
        );

        expect(screen.getByTestId('progress-percentage')).toHaveTextContent(`${i}%`);
      }
    });
  });
});

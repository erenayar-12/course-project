import axios from 'axios';
import { fileService } from '../file.service';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fileService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('uploadFile', () => {
    it('should upload file with JWT token', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const ideaId = 'idea-123';
      const token = 'test-token-123';

      localStorage.setItem('auth_token', token);

      mockedAxios.post.mockResolvedValue({
        data: {
          success: true,
          data: {
            attachmentId: 'attach-1',
            ideaId,
            originalFileName: 'test.pdf',
            fileSize: 1024,
            uploadedAt: '2026-02-25T10:00:00Z',
          },
        },
      });

      const result = await fileService.uploadFile(ideaId, mockFile);

      expect(result.success).toBe(true);
      expect(result.data.ideaId).toBe(ideaId);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining(`/ideas/${ideaId}/upload`),
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${token}`,
          }),
        })
      );
    });

    it('should use auth0_access_token if available', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const ideaId = 'idea-456';
      const auth0Token = 'auth0-token-xyz';

      localStorage.setItem('auth0_access_token', auth0Token);

      mockedAxios.post.mockResolvedValue({
        data: {
          success: true,
          data: {
            attachmentId: 'attach-2',
            ideaId,
            originalFileName: 'test.pdf',
            fileSize: 1024,
            uploadedAt: '2026-02-25T10:00:00Z',
          },
        },
      });

      await fileService.uploadFile(ideaId, mockFile);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(FormData),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${auth0Token}`,
          }),
        })
      );
    });

    it('should throw error when no authentication token found', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const ideaId = 'idea-789';

      await expect(fileService.uploadFile(ideaId, mockFile)).rejects.toThrow(
        'Authentication token not found'
      );
    });

    it('should track upload progress', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const ideaId = 'idea-123';
      const token = 'test-token';
      const progressCallback = jest.fn();

      localStorage.setItem('auth_token', token);

      let onUploadProgress: any;

      mockedAxios.post.mockImplementation((_url, _data, config) => {
        onUploadProgress = config?.onUploadProgress;
        return Promise.resolve({
          data: {
            success: true,
            data: {
              attachmentId: 'attach-1',
              ideaId,
              originalFileName: 'test.pdf',
              fileSize: 1024,
              uploadedAt: '2026-02-25T10:00:00Z',
            },
          },
        });
      });

      const uploadPromise = fileService.uploadFile(ideaId, mockFile, progressCallback);

      // Simulate progress events
      if (onUploadProgress) {
        onUploadProgress({ loaded: 256, total: 1024 });
        onUploadProgress({ loaded: 512, total: 1024 });
        onUploadProgress({ loaded: 1024, total: 1024 });
      }

      await uploadPromise;

      expect(progressCallback).toHaveBeenCalledWith({ progress: 25 });
      expect(progressCallback).toHaveBeenCalledWith({ progress: 50 });
      expect(progressCallback).toHaveBeenCalledWith({ progress: 100 });
    });

    it('should cap progress at 99% during upload', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const ideaId = 'idea-123';
      const token = 'test-token';
      const progressCallback = jest.fn();

      localStorage.setItem('auth_token', token);

      let onUploadProgress: any;

      mockedAxios.post.mockImplementation((_url, _data, config) => {
        onUploadProgress = config?.onUploadProgress;
        return Promise.resolve({
          data: {
            success: true,
            data: {
              attachmentId: 'attach-1',
              ideaId,
              originalFileName: 'test.pdf',
              fileSize: 1024,
              uploadedAt: '2026-02-25T10:00:00Z',
            },
          },
        });
      });

      const uploadPromise = fileService.uploadFile(ideaId, mockFile, progressCallback);

      // Simulate 99.9% progress
      if (onUploadProgress) {
        onUploadProgress({ loaded: 1023, total: 1024 });
      }

      await uploadPromise;

      const calls = progressCallback.mock.calls;
      const lastCallBeforeFinal = calls[calls.length - 2];
      expect(lastCallBeforeFinal[0].progress).toBeLessThanOrEqual(99);
    });

    it('should set progress to 100% after upload completes', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const ideaId = 'idea-123';
      const token = 'test-token';
      const progressCallback = jest.fn();

      localStorage.setItem('auth_token', token);

      mockedAxios.post.mockResolvedValue({
        data: {
          success: true,
          data: {
            attachmentId: 'attach-1',
            ideaId,
            originalFileName: 'test.pdf',
            fileSize: 1024,
            uploadedAt: '2026-02-25T10:00:00Z',
          },
        },
      });

      await fileService.uploadFile(ideaId, mockFile, progressCallback);

      const lastCall = progressCallback.mock.calls[progressCallback.mock.calls.length - 1];
      expect(lastCall[0].progress).toBe(100);
    });

    it('should handle 413 Payload Too Large error', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const ideaId = 'idea-123';
      const token = 'test-token';

      localStorage.setItem('auth_token', token);

      mockedAxios.post.mockRejectedValue({
        response: { status: 413 },
        isAxiosError: true,
      });

      (mockedAxios.isAxiosError as any).mockImplementation(() => true);

      await expect(fileService.uploadFile(ideaId, mockFile)).rejects.toThrow(
        'File size exceeds server limit'
      );
    });

    it('should handle 400 Bad Request error', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const ideaId = 'idea-123';
      const token = 'test-token';
      const errorMessage = 'Invalid file format';

      localStorage.setItem('auth_token', token);

      mockedAxios.post.mockRejectedValue({
        response: { status: 400, data: { error: errorMessage } },
        isAxiosError: true,
      });

      (mockedAxios.isAxiosError as any).mockImplementation(() => true);

      await expect(fileService.uploadFile(ideaId, mockFile)).rejects.toThrow(
        errorMessage
      );
    });

    it('should handle 401 Unauthorized error', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const ideaId = 'idea-123';
      const token = 'expired-token';

      localStorage.setItem('auth_token', token);

      mockedAxios.post.mockRejectedValue({
        response: { status: 401 },
        isAxiosError: true,
      });

      (mockedAxios.isAxiosError as any).mockImplementation(() => true);

      await expect(fileService.uploadFile(ideaId, mockFile)).rejects.toThrow(
        'Unauthorized - please log in again'
      );
    });

    it('should handle timeout error', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const ideaId = 'idea-123';
      const token = 'test-token';

      localStorage.setItem('auth_token', token);

      mockedAxios.post.mockRejectedValue({
        code: 'ECONNABORTED',
        isAxiosError: true,
      });

      (mockedAxios.isAxiosError as any).mockImplementation(() => true);

      await expect(fileService.uploadFile(ideaId, mockFile)).rejects.toThrow(
        'Upload timeout - please try again'
      );
    });

    it('should include FormData with file', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const ideaId = 'idea-123';
      const token = 'test-token';

      localStorage.setItem('auth_token', token);

      mockedAxios.post.mockResolvedValue({
        data: {
          success: true,
          data: {
            attachmentId: 'attach-1',
            ideaId,
            originalFileName: 'test.pdf',
            fileSize: 7,
            uploadedAt: '2026-02-25T10:00:00Z',
          },
        },
      });

      await fileService.uploadFile(ideaId, mockFile);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(FormData),
        expect.any(Object)
      );
    });

    it('should set correct API endpoint', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const ideaId = 'test-idea-id-123';
      const token = 'test-token';

      localStorage.setItem('auth_token', token);

      mockedAxios.post.mockResolvedValue({
        data: {
          success: true,
          data: {
            attachmentId: 'attach-1',
            ideaId,
            originalFileName: 'test.pdf',
            fileSize: 1024,
            uploadedAt: '2026-02-25T10:00:00Z',
          },
        },
      });

      await fileService.uploadFile(ideaId, mockFile);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `http://localhost:3001/api/ideas/${ideaId}/upload`,
        expect.any(FormData),
        expect.any(Object)
      );
    });

    it('should set 60 second timeout', async () => {
      const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const ideaId = 'idea-123';
      const token = 'test-token';

      localStorage.setItem('auth_token', token);

      mockedAxios.post.mockResolvedValue({
        data: {
          success: true,
          data: {
            attachmentId: 'attach-1',
            ideaId,
            originalFileName: 'test.pdf',
            fileSize: 1024,
            uploadedAt: '2026-02-25T10:00:00Z',
          },
        },
      });

      await fileService.uploadFile(ideaId, mockFile);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(FormData),
        expect.objectContaining({ timeout: 60000 })
      );
    });
  });

  describe('validateFile', () => {
    it('should validate PDF files', () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      const result = fileService.validateFile(file);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate Word documents', () => {
      const docFile = new File(['content'], 'test.doc', { type: 'application/msword' });
      const docxFile = new File(['content'], 'test.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      expect(fileService.validateFile(docFile).valid).toBe(true);
      expect(fileService.validateFile(docxFile).valid).toBe(true);
    });

    it('should validate image files', () => {
      const pngFile = new File(['content'], 'test.png', { type: 'image/png' });
      const jpgFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      expect(fileService.validateFile(pngFile).valid).toBe(true);
      expect(fileService.validateFile(jpgFile).valid).toBe(true);
    });

    it('should validate Excel files', () => {
      const xlsFile = new File(['content'], 'test.xls', {
        type: 'application/vnd.ms-excel',
      });
      const xlsxFile = new File(['content'], 'test.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      expect(fileService.validateFile(xlsFile).valid).toBe(true);
      expect(fileService.validateFile(xlsxFile).valid).toBe(true);
    });

    it('should reject unsupported file types', () => {
      const exeFile = new File(['content'], 'test.exe', { type: 'application/x-msdownload' });
      const result = fileService.validateFile(exeFile);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('File format not supported');
    });

    it('should reject files exceeding 10MB limit', () => {
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', {
        type: 'application/pdf',
      });
      const result = fileService.validateFile(largeFile);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds 10MB limit');
    });

    it('should accept files under 10MB limit', () => {
      const file = new File(['x'.repeat(5 * 1024 * 1024)], 'medium.pdf', {
        type: 'application/pdf',
      });
      const result = fileService.validateFile(file);

      expect(result.valid).toBe(true);
    });

    it('should accept exactly 10MB file', () => {
      const file = new File(['x'.repeat(10 * 1024 * 1024)], 'exact.pdf', {
        type: 'application/pdf',
      });
      const result = fileService.validateFile(file);

      expect(result.valid).toBe(true);
    });

    it('should display file size in error message', () => {
      const file = new File(['x'.repeat(15 * 1024 * 1024)], 'large.pdf', {
        type: 'application/pdf',
      });
      const result = fileService.validateFile(file);

      expect(result.error).toContain('MB');
    });
  });
});

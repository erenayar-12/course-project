import React, { useRef, useState } from 'react';
import { formatFileSize } from '../types/fileSchema';

interface FileUploadInputProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  error?: string;
  disabled?: boolean;
}

export const FileUploadInput: React.FC<FileUploadInputProps> = ({
  onFileSelect,
  selectedFile,
  error,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOverlay, setIsDragOverlay] = useState(false);

  const handleFileSelect = (file: File) => {
    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOverlay(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOverlay(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverlay(false);
    if (!disabled && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClickBrowse = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="file-upload-container mt-6">
      <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-2">
        <span className="text-gray-700">Supporting Files</span>
        <span className="text-gray-500 text-xs ml-1">(Optional)</span>
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`drag-drop-zone border-2 border-dashed rounded-lg p-6 transition ${
          isDragOverlay ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input
          ref={fileInputRef}
          id="file-input"
          type="file"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFileSelect(e.target.files[0]);
            }
          }}
          className="hidden"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xls,.xlsx"
          disabled={disabled}
          data-testid="file-input"
        />

        {selectedFile ? (
          <div className="file-preview flex items-center justify-between bg-white p-4 rounded border border-gray-200">
            <div className="flex-1">
              <p className="font-medium text-gray-900 truncate">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button
              type="button"
              onClick={() => onFileSelect(null)}
              disabled={disabled}
              className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              data-testid="remove-file-btn"
            >
              Remove
            </button>
          </div>
        ) : (
          <div
            onClick={handleClickBrowse}
            className={disabled ? 'opacity-50' : ''}
            role="button"
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !disabled) {
                handleClickBrowse();
              }
            }}
          >
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-gray-700 mt-2">
                Drag and drop your file here or{' '}
                <span className="text-blue-600 font-medium">click to browse</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, Word, Excel, or Image files up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div
          className="text-red-600 text-sm mt-2 flex items-center"
          role="alert"
          data-testid="error-message"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
};

import React from 'react';

interface FileProgressBarProps {
  progress: number; // 0-100
  isUploading: boolean;
  fileName?: string;
}

export const FileProgressBar: React.FC<FileProgressBarProps> = ({
  progress,
  isUploading,
  fileName,
}) => {
  if (!isUploading) return null;

  return (
    <div className="file-progress-container mt-4 bg-blue-50 p-4 rounded-lg" data-testid="progress-container">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-medium text-gray-900">Uploading file...</p>
          {fileName && <p className="text-xs text-gray-600 truncate">{fileName}</p>}
        </div>
        <span className="text-sm font-semibold text-blue-600" data-testid="progress-percentage">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
          data-testid="progress-bar"
        />
      </div>
    </div>
  );
};

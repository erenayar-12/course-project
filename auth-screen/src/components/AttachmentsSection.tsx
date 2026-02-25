/**
 * AttachmentsSection Component
 * 
 * Displays list of attachments for an idea with:
 * - File name (truncated if >50 chars)
 * - File size in human-readable format
 * - Upload date
 * - Download button
 * 
 * Implements AC3 from STORY-2.5 specification
 */

import React from 'react';

interface Attachment {
  id: string;
  originalName: string;
  fileSize: number;
  uploadedAt: Date | string;
  fileUrl?: string;
}

interface AttachmentsSectionProps {
  attachments: Attachment[];
}

/**
 * Format bytes to human-readable format (e.g., "2.5 MB")
 * Uses decimal format (1MB = 1,000,000 bytes)
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1000;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 10) / 10 + ' ' + units[i];
};

/**
 * Truncate file name to max 50 characters if needed
 */
const truncateFileName = (name: string, maxLength: number = 50): string => {
  if (name.length <= maxLength) return name;
  
  // Keep extension
  const extension = name.substring(name.lastIndexOf('.'));
  const baseName = name.substring(0, name.lastIndexOf('.'));
  const truncated = baseName.substring(0, maxLength - extension.length - 3);
  
  return truncated + '...' + extension;
};

/**
 * Get file icon based on file extension
 */
const getFileIcon = (fileName: string): string => {
  const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  
  switch (ext) {
    case '.pdf':
      return '📄';
    case '.doc':
    case '.docx':
      return '📝';
    case '.xls':
    case '.xlsx':
      return '📊';
    case '.jpg':
    case '.jpeg':
    case '.png':
    case '.gif':
      return '🖼️';
    default:
      return '📎';
  }
};

/**
 * AttachmentsSection Component
 * 
 * Renders list of attachments with download functionality
 * Hides section if no attachments exist
 */
const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({ attachments }) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = (attachment: Attachment) => {
    try {
      // If fileUrl exists, open it as download
      if (attachment.fileUrl) {
        const link = document.createElement('a');
        link.href = attachment.fileUrl;
        link.download = attachment.originalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Fallback: use API endpoint
        window.open(`/api/attachments/${attachment.id}/download`, '_blank');
      }
    } catch (error) {
      // Error handling: download failed
      // console.error('Download failed:', error);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Attachments ({attachments.length})
      </h2>

      <div className="space-y-2">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {/* File info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-2xl flex-shrink-0">
                {getFileIcon(attachment.originalName)}
              </span>

              <div className="min-w-0 flex-1">
                <p
                  className="text-sm font-medium text-gray-900 truncate"
                  title={attachment.originalName}
                >
                  {truncateFileName(attachment.originalName)}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span>{formatFileSize(attachment.fileSize)}</span>
                  <span>•</span>
                  <span>{formatDate(attachment.uploadedAt)}</span>
                </div>
              </div>
            </div>

            {/* Download button */}
            <button
              onClick={() => handleDownload(attachment)}
              className="ml-4 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors flex-shrink-0"
              aria-label={`Download ${attachment.originalName}`}
              title="Download"
            >
              ⬇️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttachmentsSection;

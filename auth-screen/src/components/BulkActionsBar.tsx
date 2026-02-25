/**
 * STORY-2.3b: BulkActionsBar Component
 * 
 * Shows bulk selection controls and action buttons
 * AC 15: Select, Bulk Update, Bulk Assign, CSV Export
 */

import React from 'react';

interface BulkActionsBarProps {
  selectedCount: number;
  selectedIds?: string[];
  totalCount: number;
  onSelectAll: (checked: boolean) => void;
  onBulkStatusUpdate: (status: string) => void;
  onBulkAssign: (assigneeId: string) => void;
  onExportCSV: () => void;
}

/**
 * BulkActionsBar Component
 * Displays selection controls and bulk action buttons
 * Supports AC15: Select all, bulk status update, bulk assign, CSV export
 */
const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  selectedIds = [],
  totalCount,
  onSelectAll,
  onBulkStatusUpdate,
  onBulkAssign,
  onExportCSV,
}) => {
  const isAllSelected = selectedCount === totalCount && totalCount > 0;
  const hasSelection = selectedCount > 0;

  return (
    <div className="bg-gray-50 px-6 py-4 rounded-lg border border-gray-200 mb-4">
      <div className="flex items-center justify-between">
        {/* Select All Checkbox */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300"
            aria-label="Select All"
          />
          <span className="text-sm text-gray-600">
            {selectedCount > 0 ? `${selectedCount} ideas selected` : 'Select ideas'}
          </span>
        </div>

        {/* Bulk Actions Buttons */}
        {hasSelection && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onBulkStatusUpdate('')}
              disabled={!hasSelection || selectedIds.length > 100}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              title={selectedIds.length > 100 ? 'Max 100 items per bulk operation' : ''}
            >
              📋 Bulk Status Update
            </button>

            <button
              onClick={() => onBulkAssign('')}
              disabled={!hasSelection || selectedIds.length > 100}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              title={selectedIds.length > 100 ? 'Max 100 items per bulk operation' : ''}
            >
              👤 Bulk Assign
            </button>

            <button
              onClick={onExportCSV}
              disabled={!hasSelection || selectedIds.length > 100}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              title={selectedIds.length > 100 ? 'Max 100 items for export' : ''}
            >
              📊 Export CSV
            </button>
          </div>
        )}

        {/* Bulk limit warning */}
        {hasSelection && selectedIds.length > 100 && (
          <span className="text-xs text-red-600">⚠️ Max 100 items per operation</span>
        )}
      </div>
    </div>
  );
};

export default BulkActionsBar;

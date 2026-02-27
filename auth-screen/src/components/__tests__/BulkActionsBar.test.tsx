/**
 * STORY-2.3b: BulkActionsBar Component Unit Tests
 * Test Category: Frontend Unit Tests (FE-UNIT-2.3b-023 through 025)
 * 
 * Tests: Select all checkbox, bulk actions buttons
 */

import { render, screen } from '@testing-library/react';
import BulkActionsBar from '../BulkActionsBar';

describe('BulkActionsBar', () => {
  const mockOnSelectAll = jest.fn();
  const mockOnBulkStatusUpdate = jest.fn();
  const mockOnBulkAssign = jest.fn();
  const mockOnExportCSV = jest.fn();

  describe('rendering', () => {
    // FE-UNIT-2.3b-023
    it('should display checkbox for selecting all ideas', () => {
      render(
        <BulkActionsBar
          selectedCount={0}
          totalCount={10}
          onSelectAll={mockOnSelectAll}
          onBulkStatusUpdate={mockOnBulkStatusUpdate}
          onBulkAssign={mockOnBulkAssign}
          onExportCSV={mockOnExportCSV}
        />
      );

      const selectAllCheckbox = screen.getByRole('checkbox', { name: /Select All/i });
      expect(selectAllCheckbox).toBeInTheDocument();
    });

    // FE-UNIT-2.3b-024
    it('should render bulk status update button (disabled if no selection)', () => {
      render(
        <BulkActionsBar
          selectedCount={0}
          totalCount={10}
          onSelectAll={mockOnSelectAll}
          onBulkStatusUpdate={mockOnBulkStatusUpdate}
          onBulkAssign={mockOnBulkAssign}
          onExportCSV={mockOnExportCSV}
        />
      );

        // Button should not be rendered when no selection
        expect(screen.queryByRole('button', { name: /Bulk Status Update/i })).toBeNull();

      // Enable when items selected
      render(
        <BulkActionsBar
          selectedCount={3}
          totalCount={10}
          onSelectAll={mockOnSelectAll}
          onBulkStatusUpdate={mockOnBulkStatusUpdate}
          onBulkAssign={mockOnBulkAssign}
          onExportCSV={mockOnExportCSV}
        />
      );

        const enabledBulkStatusButton = screen.getByRole('button', { name: /Bulk Status Update/i });
        expect(enabledBulkStatusButton).not.toBeDisabled();
    });

    // FE-UNIT-2.3b-025
    it('should render CSV export button (disabled if no selection)', () => {
      render(
        <BulkActionsBar
          selectedCount={1}
          selectedIds={['idea1']}
          totalCount={10}
          onSelectAll={mockOnSelectAll}
          onBulkStatusUpdate={mockOnBulkStatusUpdate}
          onBulkAssign={mockOnBulkAssign}
          onExportCSV={mockOnExportCSV}
        />
      );

      const exportButton = screen.getByRole('button', { name: /Export/i });
      expect(exportButton).not.toBeDisabled();
    });
  });
});

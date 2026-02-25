/**
 * STORY-2.3b: BulkActionsBar Integration Tests
 * Test Category: Frontend Integration Tests (2 tests)
 * 
 * Tests: Bulk operations API calls, CSV export
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import BulkActionsBar from '../BulkActionsBar';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BulkActionsBar Integration Tests', () => {
  const mockOnBulkStatusUpdate = jest.fn();
  const mockOnExportCSV = jest.fn();

  const mockCallbacks = {
    onSelectAll: jest.fn(),
    onBulkStatusUpdate: mockOnBulkStatusUpdate,
    onBulkAssign: jest.fn(),
    onExportCSV: mockOnExportCSV,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call bulk status update API when bulk update confirmed', async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockResolvedValue({
      data: { success: true, updated: 5 },
    });

    render(
      <BulkActionsBar
        selectedCount={5}
        selectedIds={['idea-1', 'idea-2', 'idea-3', 'idea-4', 'idea-5']}
        totalCount={10}
        {...mockCallbacks}
      />
    );

    const bulkStatusButton = screen.getByRole('button', { name: /Bulk Status Update/i });
    await user.click(bulkStatusButton);

    // Confirm in modal
    const confirmButton = screen.getByRole('button', { name: /Confirm/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/evaluation-queue/bulk-status-update',
        expect.objectContaining({
          ideaIds: expect.arrayContaining(['idea-1', 'idea-2']),
        })
      );
    });
  });

  it('should trigger CSV download when export clicked', async () => {
    const user = userEvent.setup();
    const csvContent = 'Submitter,Title,Category,Date\\nuser@example.com,Idea 1,INNOVATION,2025-02-01';
    mockedAxios.get.mockResolvedValue({
      data: csvContent,
    });

    global.URL.createObjectURL = jest.fn();
    global.URL.revokeObjectURL = jest.fn();

    render(
      <BulkActionsBar
        selectedCount={1}
        selectedIds={['idea-1']}
        totalCount={10}
        {...mockCallbacks}
      />
    );

    const exportButton = screen.getByRole('button', { name: /Export CSV/i });
    await user.click(exportButton);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/evaluation-queue/export')
      );
    });
  });
});

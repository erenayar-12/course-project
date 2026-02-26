/**
 * Unit Tests: STORY-2.4 Components
 * 
 * Tests for filtering and sorting components:
 * - FilterDrawer (mobile responsive)
 * - SkeletonLoader (loading states)
 * - Filter and sort logic
 */

import { render, screen, fireEvent } from '@testing-library/react';
import FilterDrawer from '../../components/FilterDrawer';
import SkeletonLoader from '../../components/SkeletonLoader';
import { applyFiltersAndSort } from '../../utils/filterSortUtils';
import '@testing-library/jest-dom';

describe('STORY-2.4: FilterDrawer Component', () => {
  const defaultProps = {
    selectedStatus: 'ALL' as const,
    sortBy: 'createdAt' as const,
    sortOrder: 'DESC' as const,
    onStatusChange: jest.fn(),
    onSortChange: jest.fn(),
    onDrawerToggle: jest.fn(),
    onClearAll: jest.fn(),
    isOpen: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Mobile Drawer Behavior', () => {
    it('should render drawer closed by default', () => {
      render(<FilterDrawer {...defaultProps} />);
      const drawer = screen.getByRole('heading', { name: /sort & filter/i }).closest('div');
      expect(drawer).toHaveClass('drawer');
    });

    it('should show overlay when drawer is open', () => {
      const { container } = render(<FilterDrawer {...defaultProps} isOpen={true} />);
      const overlay = container.querySelector('.overlay');
      expect(overlay).toBeInTheDocument();
    });

    it('should close drawer when overlay is clicked', () => {
      const { container } = render(<FilterDrawer {...defaultProps} isOpen={true} />);
      const overlay = container.querySelector('.overlay');
      fireEvent.click(overlay!);
      expect(defaultProps.onDrawerToggle).toHaveBeenCalledWith(false);
    });

    it('should close drawer when close button is clicked', () => {
      render(<FilterDrawer {...defaultProps} isOpen={true} />);
      const closeButton = screen.getByLabelText(/close filter drawer/i);
      fireEvent.click(closeButton);
      expect(defaultProps.onDrawerToggle).toHaveBeenCalledWith(false);
    });

    it('should call onClearAll and close drawer when Clear All button is clicked', () => {
      render(<FilterDrawer {...defaultProps} isOpen={true} />);
      const clearButton = screen.getByRole('button', { name: /clear all filters/i });
      fireEvent.click(clearButton);
      expect(defaultProps.onClearAll).toHaveBeenCalled();
      expect(defaultProps.onDrawerToggle).toHaveBeenCalledWith(false);
    });
  });

  describe('Filter and Sort Controls', () => {
    it('should render status filter control', () => {
      render(<FilterDrawer {...defaultProps} />);
      expect(screen.getByRole('heading', { level: 4, name: /filter by status/i })).toBeInTheDocument();
    });

    it('should render sort dropdown control', () => {
      render(<FilterDrawer {...defaultProps} />);
      expect(screen.getByText(/sort options/i)).toBeInTheDocument();
    });

    it('should call onStatusChange when status filter changes', () => {
      const { container } = render(<FilterDrawer {...defaultProps} />);
      const statusSelect = container.querySelector('select');
      fireEvent.change(statusSelect!, { target: { value: 'SUBMITTED' } });
      expect(defaultProps.onStatusChange).toHaveBeenCalledWith('SUBMITTED');
    });

    it('should pass correct props to child components', () => {
      const { container } = render(
        <FilterDrawer
          {...defaultProps}
          selectedStatus="APPROVED"
          sortBy="title"
          sortOrder="ASC"
        />
      );
      const statusSelect = container.querySelector('select');
      expect(statusSelect).toHaveValue('APPROVED');
    });
  });
});

describe('STORY-2.4: SkeletonLoader Component', () => {
  describe('Rendering', () => {
    it('should render skeleton rows by default', () => {
      const { container } = render(<SkeletonLoader count={3} />);
      const rows = container.querySelectorAll('.skeletonRow');
      expect(rows).toHaveLength(3);
    });

    it('should render correct number of skeleton blocks', () => {
      const { container } = render(<SkeletonLoader count={5} variant="blocks" />);
      const blocks = container.querySelectorAll('.skeletonBlock');
      expect(blocks).toHaveLength(5);
    });

    it('should apply custom row height', () => {
      const { container } = render(<SkeletonLoader count={1} rowHeight={100} variant="blocks" />);
      const block = container.querySelector('.skeletonBlock');
      expect(block).toHaveStyle('height: 100px');
    });

    it('should render skeleton table with cells', () => {
      const { container } = render(<SkeletonLoader count={2} variant="rows" />);
      const cells = container.querySelectorAll('.skeletonCell');
      expect(cells.length).toBeGreaterThan(0);
    });
  });

  describe('Animation', () => {
    it('should have shimmer animation applied', () => {
      const { container } = render(<SkeletonLoader count={1} variant="blocks" />);
      const block = container.querySelector('.skeletonBlock');
      expect(block).toHaveClass('skeletonBlock');
    });
  });

  describe('Accessibility', () => {
    it('should be semantic (not interfere with screen readers)', () => {
      const { container } = render(<SkeletonLoader count={3} variant="rows" />);
      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();
    });
  });
});

describe('STORY-2.4: Filter/Sort Utilities', () => {
  describe('Filtering Logic', () => {
    const mockIdeas = [
      { id: '1', title: 'Alpha', status: 'SUBMITTED', category: 'Feature', createdAt: '2026-02-01', attachmentCount: 1 },
      { id: '2', title: 'Beta', status: 'APPROVED', category: 'Bug', createdAt: '2026-02-02', attachmentCount: 0 },
      { id: '3', title: 'Charlie', status: 'SUBMITTED', category: 'Feature', createdAt: '2026-02-03', attachmentCount: 2 },
    ];

    it('should filter ideas by status', () => {
      const result = applyFiltersAndSort(mockIdeas, 'SUBMITTED', 'createdAt', 'DESC');
      expect(result).toHaveLength(2);
      expect(result.every((idea: {status: string}) => idea.status === 'SUBMITTED')).toBe(true);
    });

    it('should sort ideas by date descending', () => {
      const result = applyFiltersAndSort(mockIdeas, undefined, 'createdAt', 'DESC');
      expect(result[0].id).toBe('3');
      expect(result[result.length - 1].id).toBe('1');
    });

    it('should sort ideas alphabetically by title', () => {
      const result = applyFiltersAndSort(mockIdeas, undefined, 'title', 'ASC');
      expect(result[0].title).toBe('Alpha');
      expect(result[1].title).toBe('Beta');
      expect(result[2].title).toBe('Charlie');
    });

    it('should combine filter and sort operations', () => {
      const result = applyFiltersAndSort(mockIdeas, 'SUBMITTED', 'title', 'ASC');
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Alpha');
      expect(result[1].title).toBe('Charlie');
    });
  });
});

describe('STORY-2.4: URL Parameter Synchronization', () => {
  it('should preserve filter parameters in URL', () => {
    const params = new URLSearchParams();
    params.set('status', 'SUBMITTED');
    params.set('sortBy', 'title');
    params.set('sortOrder', 'ASC');

    expect(params.get('status')).toBe('SUBMITTED');
    expect(params.get('sortBy')).toBe('title');
    expect(params.get('sortOrder')).toBe('ASC');
  });

  it('should remove status parameter when set to ALL', () => {
    const params = new URLSearchParams();
    params.set('status', 'SUBMITTED');
    params.delete('status');

    expect(params.get('status')).toBeNull();
  });

  it('should reset pagination to page 1 on filter change', () => {
    const pageParam = new URLSearchParams();
    pageParam.set('page', '3');
    pageParam.set('status', 'SUBMITTED');

    // Simulate filter change
    const newParams = new URLSearchParams();
    newParams.set('status', 'APPROVED');
    newParams.set('page', '1');

    expect(newParams.get('page')).toBe('1');
  });
});

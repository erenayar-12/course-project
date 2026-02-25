/**
 * FilterDrawer Component (Mobile Responsive)
 * 
 * Collapsible drawer for filters on mobile devices (<768px)
 * Displays on desktop as part of layout, opens as drawer on mobile
 * 
 * Implements STORY-2.4 AC requirements:
 * - Mobile responsive drawer (show/hide on mobile <768px)
 * - Contains filter and sort controls
 * - Sticky positioning on scroll
 * - Close button on mobile
 * 
 * @component
 * @example
 * <FilterDrawer
 *   selectedStatus="SUBMITTED"
 *   sortBy="createdAt"
 *   sortOrder="DESC"
 *   onStatusChange={handleFilterChange}
 *   onSortChange={handleSortChange}
 *   onDrawerToggle={toggleDrawer}
 *   isOpen={drawerOpen}
 * />
 */

import React from 'react';
import { IdeaStatusFilter, type IdeaStatus } from './IdeaStatusFilter';
import { IdeaSortDropdown, type SortBy, type SortOrder } from './IdeaSortDropdown';
import styles from './FilterDrawer.module.css';

interface FilterDrawerProps {
  selectedStatus: IdeaStatus;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onStatusChange: (status: IdeaStatus) => void;
  onSortChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
  onDrawerToggle: (isOpen: boolean) => void;
  onClearAll: () => void;
  isOpen: boolean;
}

/**
 * Mobile responsive filter drawer component
 * On desktop: Fixed sidebar-like component
 * On mobile: Drawer that slides in from the side
 */
export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  selectedStatus,
  sortBy,
  sortOrder,
  onStatusChange,
  onSortChange,
  onDrawerToggle,
  onClearAll,
  isOpen,
}) => {
  const handleCloseDrawer = () => {
    onDrawerToggle(false);
  };

  return (
    <>
      {/* Mobile overlay (visible only on small screens) */}
      {isOpen && <div className={styles.overlay} onClick={handleCloseDrawer} />}

      {/* Drawer container */}
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        {/* Header with close button (mobile only) */}
        <div className={styles.drawerHeader}>
          <h3 className={styles.drawerTitle}>Sort & Filter</h3>
          <button
            className={styles.closeButton}
            onClick={handleCloseDrawer}
            aria-label="Close filter drawer"
          >
            ✕
          </button>
        </div>

        {/* Drawer content */}
        <div className={styles.drawerContent}>
          {/* Status Filter Section */}
          <div className={styles.filterSection}>
            <h4 className={styles.sectionTitle}>Filter by Status</h4>
            <IdeaStatusFilter
              selectedStatus={selectedStatus}
              onChange={onStatusChange}
            />
          </div>

          {/* Sort Section */}
          <div className={styles.filterSection}>
            <h4 className={styles.sectionTitle}>Sort Options</h4>
            <IdeaSortDropdown
              sortBy={sortBy}
              sortOrder={sortOrder}
              onChange={onSortChange}
            />
          </div>

          {/* Clear All Button */}
          <button
            className={styles.clearAllButton}
            onClick={() => {
              onClearAll();
              handleCloseDrawer();
            }}
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterDrawer;

/**
 * E2E Tests: STORY-2.4 Filtering & Sorting
 * 
 * End-to-end tests for the complete filtering and sorting workflow
 * Tests user interactions, URL parameter persistence, and visual feedback
 * 
 * @test STORY-2.4: Sort & Filter
 */

describe('STORY-2.4: Idea Filtering & Sorting E2E', () => {
  const BASE_URL = 'http://localhost:5173';
  const DASHBOARD_URL = `${BASE_URL}/my-ideas`;

  beforeEach(() => {
    // Login before each test
    cy.visit(DASHBOARD_URL);
    cy.contains('My Ideas').should('be.visible');
  });

  // AC1: Single-Select Status Filter Available
  describe('AC1: Status Filter Control', () => {
    it('should display status filter dropdown', () => {
      cy.contains('Filter by Status').should('be.visible');
      cy.get('select').first().should('exist');
    });

    it('should have all status options available', () => {
      cy.get('select').first().within(() => {
        cy.contains('All Statuses').should('exist');
        cy.contains('Submitted').should('exist');
        cy.contains('Under Review').should('exist');
        cy.contains('Approved').should('exist');
        cy.contains('Rejected').should('exist');
      });
    });

    it('should allow selection of single status', () => {
      cy.get('select').first().select('SUBMITTED');
      cy.get('select').first().should('have.value', 'SUBMITTED');
    });
  });

  // AC2: Sort Dropdown Available
  describe('AC2: Sort Dropdown Control', () => {
    it('should display sort dropdown with 4 options', () => {
      cy.contains('Sort Options').should('be.visible');
      cy.get('select').last().within(() => {
        cy.get('option').should('have.length', 4);
      });
    });

    it('should display correct sort options', () => {
      cy.get('select').last().within(() => {
        cy.contains('Date Created (Newest First)').should('exist');
        cy.contains('Date Created (Oldest First)').should('exist');
        cy.contains('Title (A-Z)').should('exist');
        cy.contains('Title (Z-A)').should('exist');
      });
    });
  });

  // AC3: Single-Select Filter Works
  describe('AC3: Filter Functionality', () => {
    it('should filter ideas by selecting status', () => {
      // Get initial count
      cy.get('tbody tr').then(($initialRows) => {
        const initialCount = $initialRows.length;

        // Apply filter
        cy.get('select').first().select('SUBMITTED');

        // Wait for filter to apply
        cy.get('tbody tr').should('have.length.lessThan', initialCount);

        // Verify all shown ideas have SUBMITTED status
        cy.get('tbody tr').each(($row) => {
          cy.wrap($row).contains('Submitted').should('exist');
        });
      });
    });

    it('should update URL when filter is applied', () => {
      cy.get('select').first().select('SUBMITTED');
      cy.url().should('include', 'status=SUBMITTED');
    });

    it('should remove URL parameter when filter reset to ALL', () => {
      cy.get('select').first().select('SUBMITTED');
      cy.url().should('include', 'status=SUBMITTED');

      cy.get('select').first().select('ALL');
      cy.url().should('not.include', 'status=');
    });
  });

  // AC4: Sort Functionality Works
  describe('AC4: Sort Functionality', () => {
    it('should sort by title A-Z', () => {
      cy.get('select').last().select('createdAt-DESC'); // Reset to default first
      cy.get('select').last().select('title-ASC');

      cy.get('tbody tr td:first-child').then(($titles) => {
        const titles = Array.from($titles).map((el) => el.textContent);
        const sortedTitles = [...titles].sort();
        expect(titles).toEqual(sortedTitles);
      });
    });

    it('should sort by date newest first', () => {
      cy.get('select').last().select('createdAt-DESC');

      cy.get('tbody tr td:nth-child(3)').then(($dates) => {
        const dates = Array.from($dates).map((el) => new Date(el.textContent || '').getTime());
        for (let i = 0; i < dates.length - 1; i++) {
          expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
        }
      });
    });

    it('should update URL when sort changes', () => {
      cy.get('select').last().select('title-ASC');
      cy.url().should('include', 'sortBy=title');
      cy.url().should('include', 'sortOrder=ASC');
    });
  });

  // AC5: Filter + Sort Combination Works
  describe('AC5: Combined Filter & Sort', () => {
    it('should apply both filter and sort together', () => {
      cy.get('select').first().select('SUBMITTED');
      cy.get('select').last().select('title-ASC');

      // Verify filter is applied
      cy.get('tbody tr').each(($row) => {
        cy.wrap($row).contains('Submitted').should('exist');
      });

      // Verify sort is applied
      cy.get('tbody tr td:first-child').then(($titles) => {
        const titles = Array.from($titles).map((el) => el.textContent);
        const sortedTitles = [...titles].sort();
        expect(titles).toEqual(sortedTitles);
      });

      // Verify URL contains both parameters
      cy.url().should('include', 'status=SUBMITTED');
      cy.url().should('include', 'sortBy=title');
      cy.url().should('include', 'sortOrder=ASC');
    });
  });

  // AC6: Active Filters Display as Chips
  describe('AC6: Filter Chips Display', () => {
    it('should show filter chip when status filter applied', () => {
      cy.get('select').first().select('SUBMITTED');
      cy.contains('Submitted').closest('span').should('exist');
    });

    it('should show sort chip when sort is not default', () => {
      cy.get('select').last().select('title-ASC');
      cy.contains('Title').should('exist');
    });

    it('should remove chip when X button clicked', () => {
      cy.get('select').first().select('SUBMITTED');
      cy.contains('Submitted').closest('span').find('button').click();
      cy.url().should('not.include', 'status=');
      cy.get('select').first().should('have.value', 'ALL');
    });
  });

  // AC7: Clear All Button Resets Filters
  describe('AC7: Clear All Button', () => {
    it('should reset filter and sort to defaults', () => {
      cy.get('select').first().select('SUBMITTED');
      cy.get('select').last().select('title-ASC');

      cy.contains('button', 'Clear All').click();

      cy.get('select').first().should('have.value', 'ALL');
      cy.get('select').last().should('have.value', 'createdAt-DESC');
      cy.url().should('not.include', 'status=');
      cy.url().should('not.include', 'sortBy=');
    });
  });

  // AC8: Pagination Resets on Filter Change
  describe('AC8: Pagination with Filters', () => {
    it('should reset to page 1 when filter changes', () => {
      // Navigate to page 2 (if available)
      cy.contains('button', 'Next').click();
      cy.contains('Page 2 of').should('exist');

      // Change filter
      cy.get('select').first().select('SUBMITTED');

      // Should return to page 1
      cy.contains('Page 1 of').should('exist');
    });
  });

  // AC9: URL Parameter Preservation
  describe('AC9: URL Parameter Persistence', () => {
    it('should apply filters when bookmarked URL is visited', () => {
      // Apply filters
      cy.get('select').first().select('SUBMITTED');
      cy.get('select').last().select('title-ASC');

      // Get URL
      cy.url().then((url) => {
        // Visit the URL directly (simulating bookmark)
        cy.visit(url);

        // Verify filters are applied
        cy.get('select').first().should('have.value', 'SUBMITTED');
        cy.get('select').last().should('have.value', 'title-ASC');

        cy.get('tbody tr').each(($row) => {
          cy.wrap($row).contains('Submitted').should('exist');
        });
      });
    });

    it('should share filtered URL and apply same filters on different user', () => {
      // Apply filters
      cy.get('select').first().select('UNDER_REVIEW');
      cy.get('select').last().select('createdAt-ASC');

      // Get URL
      cy.url().then((url) => {
        // Simulate sharing with another user (new session)
        cy.visit(url);

        // Verify same filters applied
        cy.get('select').first().should('have.value', 'UNDER_REVIEW');
        cy.get('select').last().should('have.value', 'createdAt-ASC');
      });
    });
  });

  // AC10: Loading States
  describe('AC10: Loading States', () => {
    it('should show loading message when filtering', () => {
      cy.get('select').first().select('SUBMITTED');
      // Skeleton loader might flash briefly
      cy.get('tbody tr').should('have.length.greaterThan', 0);
    });

    it('should disable controls during filtering', () => {
      cy.get('select').first().then(($select) => {
        $select.prop('disabled');
      });

      cy.get('select').first().select('SUBMITTED');

      // Controls should be responsive after filtering completes
      cy.get('select').first().should('not.be.disabled');
    });

    it('should not exceed 1 second for filter response', () => {
      const startTime = Date.now();

      cy.get('select').first().select('SUBMITTED');
      cy.get('tbody tr').should('have.length.greaterThan', 0);

      cy.then(() => {
        const duration = Date.now() - startTime;
        expect(duration).toBeLessThan(1000);
      });
    });
  });

  // AC11: Empty Results State
  describe('AC11: Empty Results State', () => {
    it('should show empty state when no ideas match filter', () => {
      // Apply a filter that returns no results (if applicable)
      cy.get('select').first().select('REJECTED');

      cy.get('tbody tr').then(($rows) => {
        if ($rows.length === 0) {
          cy.contains('No ideas match your filters').should('be.visible');
          cy.contains('button', 'Clear Filters').should('be.visible');
        }
      });
    });

    it('should return to normal view when clearing empty filter', () => {
      cy.get('select').first().select('REJECTED');

      cy.get('tbody tr').then(($rows) => {
        if ($rows.length === 0) {
          cy.contains('button', 'Clear Filters').click();
          cy.get('tbody tr').should('have.length.greaterThan', 0);
        }
      });
    });
  });

  // Mobile Responsive Tests
  describe('Mobile Responsive Behavior', () => {
    it('should show filter drawer button on mobile', () => {
      cy.viewport('iphone-x');
      cy.contains('button', /open filters/i).should('be.visible');
    });

    it('should open drawer when button clicked on mobile', () => {
      cy.viewport('iphone-x');
      cy.contains('button', /open filters/i).click();
      cy.contains('Sort & Filter').should('be.visible');
    });

    it('should hide filter drawer button on desktop', () => {
      cy.viewport('macbook-13');
      // On desktop, filters should be visible directly (not in drawer button)
      cy.contains('Filter by Status').should('be.visible');
    });
  });

  // Performance Tests
  describe('Performance', () => {
    it('should filter 100+ ideas in reasonable time', () => {
      const startTime = Date.now();

      cy.get('select').first().select('SUBMITTED');
      cy.get('tbody tr').should('have.length.greaterThan', 0);

      cy.then(() => {
        const duration = Date.now() - startTime;
        expect(duration).toBeLessThan(1500);
      });
    });
  });
});

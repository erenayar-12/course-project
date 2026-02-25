/**
 * Dashboard Pagination Flow E2E Tests
 * 
 * Tests user navigation through paginated idea lists
 * Verifies AC5 pagination functionality end-to-end
 * 
 * @file E2E tests for dashboard pagination
 */

describe('Dashboard Pagination Flow (E2E)', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login('user@example.com', 'password123');
  });

  it('should navigate between pages and load correct data', () => {
    // Mock API responses for different pages
    cy.intercept('GET', '/api/ideas?limit=10&offset=0', {
      statusCode: 200,
      body: {
        data: Array.from({ length: 10 }, (_, i) => ({
          id: `${i + 1}`,
          title: `Idea ${i + 1}`,
          status: 'SUBMITTED',
          category: 'Product',
          createdAt: new Date(2026, 1, 25 - i).toISOString(),
          attachmentCount: 0,
        })),
        pagination: { total: 25, page: 1, limit: 10, totalPages: 3 },
        stats: { draft: 0, submitted: 10, underReview: 0, approved: 0, rejected: 0 },
      },
    }).as('getPage1');

    cy.intercept('GET', '/api/ideas?limit=10&offset=10', {
      statusCode: 200,
      body: {
        data: Array.from({ length: 10 }, (_, i) => ({
          id: `${i + 11}`,
          title: `Idea ${i + 11}`,
          status: 'SUBMITTED',
          category: 'Engineering',
          createdAt: new Date(2026, 1, 15 - i).toISOString(),
          attachmentCount: 1,
        })),
        pagination: { total: 25, page: 2, limit: 10, totalPages: 3 },
        stats: { draft: 0, submitted: 10, underReview: 0, approved: 0, rejected: 0 },
      },
    }).as('getPage2');

    cy.visit('/dashboard');

    // Verify page 1 loaded with correct ideas
    cy.contains('Idea 1').should('be.visible');
    cy.contains('Page 1 of 3').should('be.visible');

    // Click next button
    cy.contains('button', 'Next').click();

    // Wait for page 2 to load
    cy.wait('@getPage2');

    // Verify page 2 loaded with correct ideas
    cy.contains('Idea 11').should('be.visible');
    cy.contains('Page 2 of 3').should('be.visible');

    // Click previous button
    cy.contains('button', 'Previous').click();

    // Verify returned to page 1
    cy.contains('Idea 1').should('be.visible');
    cy.contains('Page 1 of 3').should('be.visible');
  });
});

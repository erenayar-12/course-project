/**
 * Dashboard Load Flow E2E Tests
 * 
 * Tests critical user journeys for the dashboard
 * Verifies AC1, AC2, AC5, AC8 functionality end-to-end
 * 
 * @file E2E tests for dashboard loading
 */

describe('Dashboard Load Flow (E2E)', () => {
  beforeEach(() => {
    // Assume user is authenticated before each test
    cy.visit('/');
    cy.login('user@example.com', 'password123');
  });

  it('should load authenticated dashboard with ideas', () => {
    // Navigate to dashboard
    cy.visit('/dashboard');

    // Verify page loaded with title
    cy.contains('h1', 'My Ideas').should('be.visible');

    // AC8: Loading spinner should not be visible after load
    cy.contains('Loading...').should('not.exist');

    // AC1: Ideas list should be displayed
    cy.get('[data-testid="idea-list"]').should('be.visible');

    // AC2: Verify all required fields are displayed
    cy.get('[data-testid="idea-item"]').first().within(() => {
      cy.get('[data-testid="idea-title"]').should('be.visible');
      cy.get('[data-testid="idea-status"]').should('be.visible');
      cy.get('[data-testid="idea-category"]').should('be.visible');
      cy.get('[data-testid="idea-date"]').should('be.visible');
      cy.get('[data-testid="idea-attachments"]').should('be.visible');
    });

    // AC5: Pagination controls should be visible
    cy.get('[data-testid="pagination"]').should('be.visible');
  });

  it('should display empty state for new user with no ideas', () => {
    // Mock API response with no ideas
    cy.intercept('GET', '/api/ideas*', {
      statusCode: 200,
      body: {
        data: [],
        pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
        stats: { draft: 0, submitted: 0, underReview: 0, approved: 0, rejected: 0 },
      },
    });

    cy.visit('/dashboard');

    // AC3: Empty state message displayed
    cy.contains('No ideas submitted yet').should('be.visible');

    // AC3: CTA button displayed
    cy.contains('button', 'Submit Your First Idea').should('be.visible');
  });
});

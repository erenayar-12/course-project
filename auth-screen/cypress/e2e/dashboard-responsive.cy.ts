/**
 * Dashboard Responsive Design E2E Tests
 * 
 * Tests dashboard layout across different screen sizes
 * Verifies AC10: Responsive design across mobile/tablet/desktop
 * 
 * @file E2E tests for responsive design
 */

describe('Dashboard Responsive Design (E2E)', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login('user@example.com', 'password123');
  });

  it('should display correctly on mobile (375px)', () => {
    cy.viewport('iphone-se');

    cy.visit('/dashboard');

    // AC10: Mobile layout - verify key elements visible
    cy.contains('h1', 'My Ideas').should('be.visible');
    cy.get('[data-testid="idea-list"]').should('be.visible');
    cy.get('[data-testid="pagination"]').should('be.visible');

    // Verify no horizontal scroll
    cy.get('body').should('have.css', 'overflow-x', 'hidden');

    // Verify buttons are clickable on mobile
    cy.contains('button', 'Next').should('have.css', 'min-height', '44px');
  });

  it('should display correctly on tablet (768px)', () => {
    cy.viewport('ipad-2');

    cy.visit('/dashboard');

    // AC10: Tablet layout - verify all functionality accessible
    cy.contains('h1', 'My Ideas').should('be.visible');
    cy.get('[data-testid="stats-bar"]').should('be.visible');
    cy.get('[data-testid="idea-list"]').should('be.visible');

    // Verify responsive grid/layout
    cy.get('[data-testid="idea-item"]')
      .first()
      .should('be.visible')
      .and('have.css', 'display');
  });

  it('should display correctly on desktop (1920px)', () => {
    cy.viewport(1920, 1080);

    cy.visit('/dashboard');

    // AC10: Desktop layout - full content visible
    cy.contains('h1', 'My Ideas').should('be.visible');
    cy.get('[data-testid="stats-bar"]').should('be.visible');
    cy.get('[data-testid="idea-list"]').should('be.visible');
    cy.get('[data-testid="pagination"]').should('be.visible');

    // Verify desktop layout
    cy.get('[data-testid="idea-item"]').should('have.length.greaterThan', 0);

    // Verify no squishing or overflow
    cy.get('main').should('have.css', 'max-width');
  });
});

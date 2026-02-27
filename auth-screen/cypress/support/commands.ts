// cypress/support/commands.ts
// Custom Cypress commands for E2E tests

Cypress.Commands.add('login', (email = 'admin@example.com', password = 'password123') => {
  // Example: programmatic login via API
  cy.request('POST', '/api/auth/login', { email, password })
    .then((resp) => {
      window.localStorage.setItem('auth_token', resp.body.token);
    });
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
    }
  }
}

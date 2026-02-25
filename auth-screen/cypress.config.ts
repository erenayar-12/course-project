import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      // Implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.ts',
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'cypress/component/**/*.cy.ts',
  },
});

/**
 * Jest setup - runs before test environment is created
 * Mocks import.meta for Vite in CommonJS/Jest environment
 */

// Mock import.meta BEFORE any modules are loaded
// @ts-ignore - Global assignment for import.meta
global.import = {
  meta: {
    env: {
      VITE_AUTH0_DOMAIN: process.env.VITE_AUTH0_DOMAIN || 'https://test.auth0.com',
      VITE_AUTH0_CLIENT_ID: process.env.VITE_AUTH0_CLIENT_ID || 'test_client_id',
    },
  },
};

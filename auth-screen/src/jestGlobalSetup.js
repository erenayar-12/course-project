/**
 * Global Jest setup file
 * Mocks import.meta for Vite in CommonJS/Jest environment
 */

// Mock import.meta for Vite environment variables
// This must be done before any modules that use import.meta are loaded
globalThis.import = {
  meta: {
    env: {
      VITE_AUTH0_DOMAIN: process.env.VITE_AUTH0_DOMAIN || 'https://test.auth0.com',
      VITE_AUTH0_CLIENT_ID: process.env.VITE_AUTH0_CLIENT_ID || 'test_client_id',
    },
  },
};

module.exports = async () => {
  // Jest runs this before any tests
};

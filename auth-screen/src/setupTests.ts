import '@testing-library/jest-dom';

/**
 * Jest setup file for DOM testing utilities
 * Provides extended matchers for React Testing Library tests
 */

// Polyfill TextEncoder/TextDecoder for Auth0 SDK in jsdom
// These are needed for crypto operations in Auth0
try {
  // @ts-ignore - require is available in jest/node environment
  const { TextEncoder, TextDecoder } = require('util');
  Object.assign(globalThis, { TextEncoder, TextDecoder });
} catch (e) {
  // Already available in test environment
}






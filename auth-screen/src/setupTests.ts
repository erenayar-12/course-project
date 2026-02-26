import '@testing-library/jest-dom';

/**
 * Jest setup file for DOM testing utilities
 * Provides extended matchers for React Testing Library tests
 */

// Polyfill TextEncoder/TextDecoder for Auth0 SDK in jsdom
// These are needed for crypto operations in Auth0
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { TextEncoder, TextDecoder } = require('util');
  Object.assign(globalThis, { TextEncoder, TextDecoder });
} catch (e) {
  // Already available in test environment
}

// Suppress React Router v6 deprecation warnings in tests
// These will be addressed in v7 migration
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('React Router Future Flag Warning') ||
        args[0].includes('startTransition') ||
        args[0].includes('relativeSplatPath'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Improve test isolation by clearing mocks between tests
afterEach(() => {
  jest.clearAllMocks();
});

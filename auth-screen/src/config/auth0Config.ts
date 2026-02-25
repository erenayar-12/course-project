/**
 * Auth0 Configuration
 *
 * Centralizes Auth0 domain and client ID configuration.
 * Follows STORY-EPIC-1.2 implementation approach.
 *
 * Environment variables required:
 * - VITE_AUTH0_DOMAIN: Auth0 tenant domain (e.g., your-domain.auth0.com)
 * - VITE_AUTH0_CLIENT_ID: Auth0 application client ID
 */

const AUTH0_DOMAIN = process.env.VITE_AUTH0_DOMAIN || 'dev-placeholder.auth0.com';
const AUTH0_CLIENT_ID = process.env.VITE_AUTH0_CLIENT_ID || 'placeholder_client_id_000000';

/**
 * Gets the Auth0 callback URL
 * Must match the Allowed Callback URLs in Auth0 application settings
 * Returns to dashboard after successful authentication
 */
const getCallbackUrl = (): string => {
  return `${window.location.origin}/dashboard`;
};

export const AUTH0_CONFIG = {
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  redirectUri: getCallbackUrl(),
};

/**
 * Validates that required Auth0 configuration is present
 * @throws Error if configuration is incomplete (only in production)
 */
export const validateAuth0Config = (): void => {
  const isDevelopment = import.meta.env.DEV;

  if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID) {
    const message =
      'Auth0 configuration missing. Please set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in .env.local';
    // eslint-disable-next-line no-console
    console.error(message);

    // Only throw in production; allow dev mode with test values
    if (!isDevelopment) {
      throw new Error('Auth0 configuration is incomplete');
    }
  }
};

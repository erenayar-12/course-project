import { AUTH0_CONFIG } from '../auth0Config';

describe('AUTH0_CONFIG', () => {
  describe('Config object', () => {
    it('should contain domain property from environment', () => {
      // 🔵 ARRANGE: Config already created from environment
      // 🟢 ACT: Check domain exists
      // 🔴 ASSERT: Domain should be defined and not empty
      expect(AUTH0_CONFIG.domain).toBeDefined();
      expect(typeof AUTH0_CONFIG.domain).toBe('string');
      expect(AUTH0_CONFIG.domain.length).toBeGreaterThan(0);
    });

    it('should contain clientId property from environment', () => {
      // 🔵 ARRANGE: Config already created from environment
      // 🟢 ACT: Check clientId exists
      // 🔴 ASSERT: ClientId should be defined and not empty
      expect(AUTH0_CONFIG.clientId).toBeDefined();
      expect(typeof AUTH0_CONFIG.clientId).toBe('string');
      expect(AUTH0_CONFIG.clientId.length).toBeGreaterThan(0);
    });

    it('should have redirectUri pointing to /dashboard', () => {
      // 🔵 ARRANGE: Config object created
      // 🟢 ACT: Check redirectUri
      // 🔴 ASSERT: Includes /dashboard callback
      expect(AUTH0_CONFIG.redirectUri).toBeDefined();
      expect(AUTH0_CONFIG.redirectUri).toMatch(/\/dashboard$/);
    });

    it('should have redirectUri as absolute URL', () => {
      // 🔵 ARRANGE: Config with redirectUri
      // 🟢 ACT: Validate URL format
      // 🔴 ASSERT: URL starts with protocol
      expect(AUTH0_CONFIG.redirectUri).toMatch(/^https?:\/\//);
    });

    it('should have all required Auth0 configuration properties', () => {
      // 🔵 ARRANGE: CONFIG object
      // 🟢 ACT: Check all properties
      // 🔴 ASSERT: All required fields present
      expect(AUTH0_CONFIG).toHaveProperty('domain');
      expect(AUTH0_CONFIG).toHaveProperty('clientId');
      expect(AUTH0_CONFIG).toHaveProperty('redirectUri');
    });
  });
});

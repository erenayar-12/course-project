// src/mocks/handlers.ts

import { http as rest } from 'msw';

export const handlers = [
  // Mock login endpoint for Cypress E2E
  rest.post('/api/auth/login', (req, res, ctx) => {
    // Accept any credentials for E2E
    return res(
      ctx.status(200),
      ctx.json({ token: 'fake-jwt-token-for-e2e' })
    );
  }),
  // ...add other handlers as needed
];

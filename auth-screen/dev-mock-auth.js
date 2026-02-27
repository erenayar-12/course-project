// dev-mock-auth.js
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/auth/login', (req, res) => {
  // Accept any credentials for E2E
  res.json({ token: 'fake-jwt-token-for-e2e' });
});

// Proxy all other requests to Vite dev server
const { createProxyMiddleware } = require('http-proxy-middleware');
app.use(
  '/',
  createProxyMiddleware({
    target: 'http://localhost:5173',
    changeOrigin: true,
    ws: true,
  })
);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Mock auth server running on http://localhost:${PORT}`);
});

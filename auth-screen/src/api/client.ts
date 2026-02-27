import { getAuth } from 'firebase/auth';
/**
 * API Client with Authorization Header
 * Adds Bearer token to all requests
 */

// Jest does not support import.meta.env, so use process.env.NODE_ENV in test
function getApiBaseUrl(): string {
  // Jest (test) environment
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') {
    return 'http://localhost:3001/api';
  }
  // Vite/browser environment
  try {
    // Only reference import.meta if it exists
    if (
      typeof import.meta !== 'undefined' &&
      import.meta.env &&
      (import.meta.env.MODE === 'development' || import.meta.env.MODE === 'test' || import.meta.env.MODE === 'e2e')
    ) {
      return 'http://localhost:3001/api';
    }
  } catch {}
  // Default for production or unknown
  return '/api';
}

// Set API_BASE_URL using the new function
const API_BASE_URL = getApiBaseUrl();

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * Get the auth token from localStorage
 */
function getAuthToken(): Promise<string | null> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      return user.getIdToken();
    }
    return Promise.resolve(null);
  } catch {
    return Promise.resolve(null);
  }
}

/**
 * Add Authorization header to request
 */
async function getHeaders(options?: RequestOptions): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options?.headers as Record<string, string>) || {}),
  };

  // Support async token
  const token = await getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Build URL with query parameters
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
  const url = new URL(`${getApiBaseUrl()}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  return url.toString();
}

/**
 * Fetch wrapper with authorization
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  const { params, ...fetchOptions } = options || {};
  const url = buildUrl(endpoint, params);
  const auth = getAuth();
  // Wait for user to be available (async)
  let user = auth.currentUser;
  if (!user) {
    // Try to wait for auth state
    await new Promise(resolve => {
      const unsubscribe = auth.onAuthStateChanged(u => {
        user = u;
        unsubscribe();
        resolve(undefined);
      });
    });
  }
  if (!user) {
    throw new Error('User not logged in. Please log in to continue.');
  }
  const token = await user.getIdToken();
  if (!token) {
    throw new Error('Failed to retrieve Firebase token.');
  }
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options?.headers as Record<string, string>) || {}),
    'Authorization': `Bearer ${token}`,
  };

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * GET request
 */
export function apiGet<T = unknown>(
  endpoint: string,
  options?: Omit<RequestOptions, 'method' | 'body'>
): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: 'GET' });
}

/**
 * POST request
 */
export function apiPost<T = unknown>(
  endpoint: string,
  body?: unknown,
  options?: Omit<RequestOptions, 'method' | 'body'>
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT request
 */
export function apiPut<T = unknown>(
  endpoint: string,
  body?: unknown,
  options?: Omit<RequestOptions, 'method' | 'body'>
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE request
 */
export function apiDelete<T = unknown>(
  endpoint: string,
  options?: Omit<RequestOptions, 'method' | 'body'>
): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: 'DELETE' });
}

/**
 * PATCH request
 */
export function apiPatch<T = unknown>(
  endpoint: string,
  body?: unknown,
  options?: Omit<RequestOptions, 'method' | 'body'>
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
}

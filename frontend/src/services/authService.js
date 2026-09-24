import { jwtDecode } from 'jwt-decode';
import { invalidate } from '../utils/cache';
import { API_BASE_URL, getStoredToken, setStoredToken } from './apiClient';

const USER_KEY = 'placepro.user';
// OAuth2 authorization endpoints live on the backend origin, not under /api.
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    // Backend issues our own JWT (has exp). A raw Google credential will fail
    // this check differently ΓÇö in that case we treat it as invalid for API use.
    if (!decoded.exp) return false;
    return decoded.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

function saveSession(token, user) {
  setStoredToken(token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

async function handleAuthResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  if (!data.token) {
    throw new Error('Server did not return an auth token.');
  }
  const user = data.user || {
    name: data.name,
    email: data.email,
    picture: data.pictureUrl,
    role: data.role || 'STUDENT',
    provider: data.provider || 'LOCAL',
    plan: data.plan,
  };
  // Previous account's cached data must never leak into the new session.
  invalidate();
  saveSession(data.token, user);
  return { authenticated: true, user, token: data.token };
}

function spaNavigate(to) {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export const authService = {
  isAuthenticated: () => {
    const token = getStoredToken();
    return Boolean(token) && !isTokenExpired(token);
  },

  getUser: () => {
    try {
      const stored = window.localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  getToken: () => getStoredToken(),

  register: async ({ name, email, password }) => {
    let response;
    try {
      response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
    } catch {
      throw new Error('Cannot reach the server. Check your connection and try again.');
    }
    return handleAuthResponse(response);
  },

  login: async ({ email, password }) => {
    let response;
    try {
      response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
    } catch {
      throw new Error('Cannot reach the server. Check your connection and try again.');
    }
    return handleAuthResponse(response);
  },

  // Google: frontend only collects the Google ID token; verification happens
  // server-side in GoogleAuthService. No client-side fallback ΓÇö if the backend
  // rejects the token, login fails instead of silently logging in.
  loginWithGoogle: async (credential) => {
    if (!credential) throw new Error('Missing Google credential.');
    let response;
    try {
      response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: credential }),
      });
    } catch {
      throw new Error('Cannot reach the server. Check your connection and try again.');
    }
    return handleAuthResponse(response);
  },

  // Google OAuth2 authorization-code flow (server-side):
  // full-page redirect to Spring Boot, which bounces to Google and back
  // with an app JWT at /oauth/callback?token=...
  startGoogleOAuth: () => {
    window.location.href = `${BACKEND_ORIGIN}/oauth2/authorization/google`;
  },

  // Completes the OAuth2 flow: validates the backend JWT from the callback
  // URL and builds the session from its claims (no extra request needed).
  loginWithOAuthToken: async (token) => {
    if (!token) throw new Error('Missing login token.');
    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch {
      throw new Error('Invalid login token. Please try again.');
    }
    if (!decoded.exp || decoded.exp * 1000 <= Date.now()) {
      throw new Error('Login session expired. Please try again.');
    }
    const email = decoded.sub || '';
    if (!email) throw new Error('Login token has no user. Please try again.');
    const user = {
      name: decoded.name || email,
      email,
      picture: decoded.picture,
      role: decoded.role || 'STUDENT',
      provider: decoded.provider || 'GOOGLE',
      plan: decoded.plan,
    };
    invalidate();
    saveSession(token, user);
    return { authenticated: true, user, token };
  },

  // Authenticated fetch helper: attaches backend JWT, logs out on 401.
  authFetch: async (path, options = {}) => {
    const token = getStoredToken();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (response.status === 401) {
      authService.logout();
      spaNavigate('/login');
      throw new Error('Session expired. Please log in again.');
    }
    return response;
  },

  logout: () => {
    window.localStorage.removeItem(USER_KEY);
    setStoredToken(null);
    invalidate();
  },
};

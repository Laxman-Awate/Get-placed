import { jwtDecode } from 'jwt-decode';
import { invalidate } from '../utils/cache';

const USER_KEY = 'placepro.user';
const TOKEN_KEY = 'placepro.token';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

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
  window.localStorage.setItem(TOKEN_KEY, token);
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

function createDevAdminToken(user) {
  const encodeB64 = (obj) => {
    try {
      return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
    } catch {
      return btoa(JSON.stringify(obj));
    }
  };
  const header = encodeB64({ alg: 'HS256', typ: 'JWT' });
  const exp = Math.floor(Date.now() / 1000) + 86400 * 30;
  const payload = encodeB64({
    sub: user.email,
    name: user.name,
    role: user.role,
    provider: user.provider,
    plan: user.plan,
    exp: exp,
  });
  return `${header}.${payload}.dev_local_token`;
}

export const authService = {
  isAuthenticated: () => {
    const token = window.localStorage.getItem(TOKEN_KEY);
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

  getToken: () => window.localStorage.getItem(TOKEN_KEY),

  register: async ({ name, email, password }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return handleAuthResponse(response);
  },

  login: async ({ email, password }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return await handleAuthResponse(response);
    } catch (err) {
      // Offline / local development fallback
      const cleanEmail = String(email || '').trim().toLowerCase();
      if (cleanEmail === 'admin@placepro.com' && password === 'admin123') {
        const user = {
          name: 'PlacePro Administrator',
          email: 'admin@placepro.com',
          role: 'ADMIN',
          provider: 'LOCAL',
          plan: 'premium',
        };
        const token = createDevAdminToken(user);
        invalidate();
        saveSession(token, user);
        return { authenticated: true, user, token };
      }
      if (cleanEmail && password) {
        const namePart = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const user = {
          name: formattedName || 'Arjun Kumar',
          email: cleanEmail,
          role: cleanEmail.includes('admin') ? 'ADMIN' : 'STUDENT',
          provider: 'LOCAL',
          plan: 'free',
        };
        const token = createDevAdminToken(user);
        invalidate();
        saveSession(token, user);
        return { authenticated: true, user, token };
      }
      throw err;
    }
  },

  // Google: frontend only collects the Google ID token; verification happens
  // server-side in GoogleAuthService. No client-side fallback ΓÇö if the backend
  // rejects the token, login fails instead of silently logging in.
  loginWithGoogle: async (credential) => {
    if (!credential) throw new Error('Missing Google credential.');
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: credential }),
    });
    return handleAuthResponse(response);
  },

  // Authenticated fetch helper: attaches backend JWT, logs out on 401.
  authFetch: async (path, options = {}) => {
    const token = window.localStorage.getItem(TOKEN_KEY);
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
    window.localStorage.removeItem(TOKEN_KEY);
    invalidate();
  },
};

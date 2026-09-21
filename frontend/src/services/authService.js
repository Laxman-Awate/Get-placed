import { jwtDecode } from 'jwt-decode';
import { apiRequest, setStoredToken } from './apiClient';

const USER_KEY = 'placepro.user';
const TOKEN_KEY = 'placepro.token';
<<<<<<< Updated upstream

const persistAuth = (data) => {
  const userData = data.user || {
=======
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    // Backend issues our own JWT (has exp). A raw Google credential will fail
    // this check differently — in that case we treat it as invalid for API use.
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
>>>>>>> Stashed changes
    name: data.name,
    email: data.email,
    picture: data.pictureUrl,
    role: data.role || 'STUDENT',
    provider: data.provider || 'LOCAL',
<<<<<<< Updated upstream
    plan: data.plan || 'free',
  };

  window.localStorage.setItem(AUTH_KEY, 'true');
  setStoredToken(data.token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(userData));

  return {
    authenticated: true,
    user: userData,
    token: data.token,
  };
};

export const authService = {
  isAuthenticated: () =>
    window.localStorage.getItem(AUTH_KEY) === 'true',
=======
    plan: data.plan,
  };
  saveSession(data.token, user);
  return { authenticated: true, user, token: data.token };
}

function spaNavigate(to) {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export const authService = {
  isAuthenticated: () => {
    const token = window.localStorage.getItem(TOKEN_KEY);
    return Boolean(token) && !isTokenExpired(token);
  },
>>>>>>> Stashed changes

  getUser: () => {
    try {
      const stored = window.localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  getToken: () =>
    window.localStorage.getItem(TOKEN_KEY),

<<<<<<< Updated upstream
  login: async ({ email, password }) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    return persistAuth(data);
  },

  register: async ({ name, email, password }) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    return persistAuth(data);
=======
  register: async ({ name, email, password }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return handleAuthResponse(response);
>>>>>>> Stashed changes
  },

  login: async ({ email, password }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleAuthResponse(response);
  },

  // Google: frontend only collects the Google ID token; verification happens
  // server-side in GoogleAuthService. No client-side fallback — if the backend
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

<<<<<<< Updated upstream
    try {
      const data = await apiRequest('/auth/google', {
        method: 'POST',
        body: JSON.stringify({ idToken: credential }),
      });

      return persistAuth(data);
    } catch {
      // Backend unavailable — fall back to client-side token decoding.
    }

    if (!userData) {
      try {
        const decoded = jwtDecode(credential);

        userData = {
          name: decoded.name || decoded.given_name || 'Student',
          email: decoded.email,
          picture: decoded.picture,
          role: 'STUDENT',
          provider: 'GOOGLE',
        };
      } catch {
        userData = {
          name: 'Google User',
          email: '',
          role: 'STUDENT',
          provider: 'GOOGLE',
        };
      }
    }

    window.localStorage.setItem(AUTH_KEY, 'true');
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(
      USER_KEY,
      JSON.stringify(userData)
    );

    return {
      authenticated: true,
      user: userData,
      token,
    };
=======
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
>>>>>>> Stashed changes
  },

  logout: () => {
    window.localStorage.removeItem(USER_KEY);
    setStoredToken(null);
  },
<<<<<<< Updated upstream
};
=======
};
>>>>>>> Stashed changes

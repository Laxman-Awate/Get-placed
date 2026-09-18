import { jwtDecode } from 'jwt-decode';
<<<<<<< HEAD
=======
import { apiRequest, setStoredToken } from './apiClient';
>>>>>>> frontend

const AUTH_KEY = 'placepro.authenticated';
const USER_KEY = 'placepro.user';
const TOKEN_KEY = 'placepro.token';
<<<<<<< HEAD
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const authService = {
  isAuthenticated: () => window.localStorage.getItem(AUTH_KEY) === 'true',

  getUser: () => {
    try {
      const stored = window.localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  getToken: () => window.localStorage.getItem(TOKEN_KEY),

  login: async (userData = null) => {
    window.localStorage.setItem(AUTH_KEY, 'true');
    if (userData) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(userData));
    }
    return { authenticated: true, user: userData };
  },

  loginWithGoogle: async (credential) => {
    let userData = null;
    let token = credential;

    try {
      // 1. Attempt to send token to Spring Boot backend for verification
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: credential }),
      });

      if (response.ok) {
        const data = await response.json();
        token = data.token || credential;
        userData = {
          name: data.name,
          email: data.email,
          picture: data.pictureUrl,
          role: data.role || 'STUDENT',
          provider: 'GOOGLE',
        };
      }
    } catch {
      // Backend is offline or unreachable - graceful fallback to client-side decode
    }

    // If backend wasn't reached or returned no data, decode client-side
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
    window.localStorage.setItem(USER_KEY, JSON.stringify(userData));

    return { authenticated: true, user: userData, token };
  },

  logout: () => {
    window.localStorage.removeItem(AUTH_KEY);
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(TOKEN_KEY);
  },
};

=======

const persistAuth = (data) => {
  const userData = data.user || {
    name: data.name,
    email: data.email,
    picture: data.pictureUrl,
    role: data.role || 'STUDENT',
    provider: data.provider || 'LOCAL',
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
  },

  loginWithGoogle: async (credential) => {
    let userData = null;
    let token = credential;

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
  },

  logout: () => {
    window.localStorage.removeItem(AUTH_KEY);
    window.localStorage.removeItem(USER_KEY);
    setStoredToken(null);
  },
};
>>>>>>> frontend

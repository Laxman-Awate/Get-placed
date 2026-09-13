const AUTH_KEY = 'placepro.authenticated';
export const authService = {
  isAuthenticated: () => window.localStorage.getItem(AUTH_KEY) === 'true',
  login: async () => { window.localStorage.setItem(AUTH_KEY, 'true'); return { authenticated: true }; },
  logout: () => window.localStorage.removeItem(AUTH_KEY),
};

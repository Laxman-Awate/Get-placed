import React, { createContext, useContext, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { invalidate } from '../utils/cache';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setAuthenticated] = useState(() =>
    authService.isAuthenticated()
  );

  const [user, setUser] = useState(() => authService.getUser());

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
<<<<<<< Updated upstream

      login: async (userData = null) => {
        const res = await authService.login(userData);
=======
      token: authService.getToken(),
      register: async (payload) => {
        const res = await authService.register(payload);
        setUser(res.user);
        setAuthenticated(true);
        return res;
      },
      login: async (payload) => {
        const res = await authService.login(payload);
>>>>>>> Stashed changes
        setUser(res.user);
        setAuthenticated(true);
        return res;
      },

      register: async (userData) => {
        const res = await authService.register(userData);
        setUser(res.user);
        setAuthenticated(true);
        return res;
      },

      loginWithGoogle: async (credential) => {
        const res = await authService.loginWithGoogle(credential);
        setUser(res.user);
        setAuthenticated(true);
        return res;
      },

      logout: () => {
        authService.logout();
        invalidate();
        setUser(null);
        setAuthenticated(false);
      },
    }),
    [isAuthenticated, user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
<<<<<<< Updated upstream

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
=======
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
>>>>>>> Stashed changes

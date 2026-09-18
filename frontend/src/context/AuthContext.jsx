import React, { createContext, useContext, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
<<<<<<< HEAD
  const [isAuthenticated, setAuthenticated] = useState(() => authService.isAuthenticated());
=======
  const [isAuthenticated, setAuthenticated] = useState(() =>
    authService.isAuthenticated()
  );

>>>>>>> frontend
  const [user, setUser] = useState(() => authService.getUser());

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
<<<<<<< HEAD
=======

>>>>>>> frontend
      login: async (userData = null) => {
        const res = await authService.login(userData);
        setUser(res.user);
        setAuthenticated(true);
        return res;
      },
<<<<<<< HEAD
=======

      register: async (userData) => {
        const res = await authService.register(userData);
        setUser(res.user);
        setAuthenticated(true);
        return res;
      },

>>>>>>> frontend
      loginWithGoogle: async (credential) => {
        const res = await authService.loginWithGoogle(credential);
        setUser(res.user);
        setAuthenticated(true);
        return res;
      },
<<<<<<< HEAD
=======

>>>>>>> frontend
      logout: () => {
        authService.logout();
        setUser(null);
        setAuthenticated(false);
      },
    }),
    [isAuthenticated, user]
  );

<<<<<<< HEAD
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
=======
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
>>>>>>> frontend
}

export function useAuth() {
  const context = useContext(AuthContext);
<<<<<<< HEAD
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

=======

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
>>>>>>> frontend

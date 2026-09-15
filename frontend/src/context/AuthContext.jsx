import React, { createContext, useContext, useMemo, useState } from 'react';
import { authService } from '../services/authService';
const AuthContext = createContext(null);
export function AuthProvider({ children }) { const [isAuthenticated, setAuthenticated] = useState(() => authService.isAuthenticated()); const value = useMemo(() => ({ isAuthenticated, login: async () => { await authService.login(); setAuthenticated(true); }, logout: () => { authService.logout(); setAuthenticated(false); } }), [isAuthenticated]); return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; }
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used inside AuthProvider'); return context; }

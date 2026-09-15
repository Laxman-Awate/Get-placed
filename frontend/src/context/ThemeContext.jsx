import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'placepro-theme';
export function ThemeProvider({ children }) { const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEY) || 'dark'); useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem(STORAGE_KEY, theme); }, [theme]); const value = useMemo(() => ({ theme, setTheme }), [theme]); return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>; }
export function useTheme() { const context = useContext(ThemeContext); if (!context) throw new Error('useTheme must be used inside ThemeProvider'); return context; }

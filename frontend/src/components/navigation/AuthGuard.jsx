import React from 'react';
import { useAuth } from '../../context/AuthContext';
export function AuthGuard({ children, redirectTo = '/learning' }) { const { isAuthenticated } = useAuth(); if (!isAuthenticated) { const target = `${redirectTo}?from=${encodeURIComponent(window.location.pathname)}`; window.location.replace(`/login?from=${encodeURIComponent(window.location.pathname)}`); return <div className="loading-panel">Redirecting to login…</div>; } return children; }

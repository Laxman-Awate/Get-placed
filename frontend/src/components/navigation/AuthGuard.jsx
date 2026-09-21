import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRoute } from '../../context/RouteContext';

export function AuthGuard({ children }) {
  const { isAuthenticated } = useAuth();
  const { path, navigate } = useRoute();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?from=${encodeURIComponent(path)}`);
    }
  }, [isAuthenticated, navigate, path]);

  if (!isAuthenticated) return <div className="loading-panel">Redirecting to login…</div>;
  return children;
}

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRoute } from '../../context/RouteContext';

export function AdminGuard({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const { navigate } = useRoute();

  // Hidden isn't just hidden — unauthorized access strictly returns a 404
  // so the portal's existence is never leaked to non-admin users.
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="admin-not-found-container" style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{
          fontSize: '4rem',
          fontWeight: 800,
          color: 'var(--text-secondary, #94a3b8)',
          lineHeight: 1,
          marginBottom: '1rem'
        }}>
          404
        </div>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          marginBottom: '0.75rem',
          color: 'var(--text-primary, #f8fafc)'
        }}>
          Page Not Found
        </h1>
        <p style={{
          maxWidth: '420px',
          color: 'var(--text-secondary, #94a3b8)',
          marginBottom: '1.5rem',
          lineHeight: 1.5
        }}>
          The page you are looking for doesn’t exist or may have been moved.
        </p>
        <button
          className="button"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          Back to Homepage
        </button>
      </div>
    );
  }

  return children;
}

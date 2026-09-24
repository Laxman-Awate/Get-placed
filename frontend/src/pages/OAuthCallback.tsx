import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../context/AuthContext';

// Landing page for the Google OAuth2 flow: backend redirects here as
// /oauth/callback?token=<app JWT> (or ?error=... on failure).
export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithOAuthToken } = useAuth();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    const token = params.get('token');
    if (params.get('error') || !token) {
      navigate('/login?mode=login&error=oauth', { replace: true });
      return;
    }
    loginWithOAuthToken(token)
      .then(() => navigate('/dashboard', { replace: true }))
      .catch(() => navigate('/login?mode=login&error=oauth', { replace: true }));
  }, []);

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center">
      <p className="text-sm text-[#94a3b8]">Completing Google sign-in…</p>
    </div>
  );
}

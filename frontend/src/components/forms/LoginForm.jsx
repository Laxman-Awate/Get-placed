import React, { useState } from 'react';
import { GoogleSignInButton } from './GoogleSignInButton';
import { useAuth } from '../../context/AuthContext';
import { useRoute } from '../../context/RouteContext';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const { path, navigate } = useRoute();
  const destination =
    new URLSearchParams(path.split('?')[1] || '').get('from') || '/learning';

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError('');

      await loginWithGoogle(credentialResponse.credential);
      navigate(destination);
    } catch (err) {
      setError(err.message || 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google authentication was cancelled or failed.');
  };

  const submit = async (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') || '').trim();
    const password = form.get('password');

    if (!email || !password) {
      setError('Enter your email and password to continue.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate(destination);
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <label className="form-field">
        <span>Email address</span>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </label>

      <label className="form-field password-field">
        <span>Password</span>
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword((value) => !value)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </label>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-options">
        <label>
          <input type="checkbox" name="remember" /> Remember me
        </label>

        <button type="button" className="inline-link">
          Forgot password?
        </button>
      </div>

      <button className="button full" type="submit" disabled={loading}>
        {loading ? 'Logging in…' : 'Log in'}
      </button>

      <div className="or-divider">
        <span>or</span>
      </div>

      <div
        className="google-auth-wrapper"
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <GoogleSignInButton text="continue_with" onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
      </div>
    </form>
  );
}
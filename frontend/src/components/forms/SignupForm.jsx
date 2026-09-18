import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { FormField } from '../common/FormField';
import { useAuth } from '../../context/AuthContext';

export function SignupForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
  const { login, loginWithGoogle } = useAuth();
=======
  const { register, loginWithGoogle } = useAuth();
>>>>>>> frontend

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError('');
<<<<<<< HEAD
      await loginWithGoogle(credentialResponse.credential);
      const destination = new URLSearchParams(window.location.search).get('from') || '/learning';
=======

      await loginWithGoogle(credentialResponse.credential);

      const destination =
        new URLSearchParams(window.location.search).get('from') ||
        '/learning';

>>>>>>> frontend
      window.location.href = destination;
    } catch {
      setError('Google signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google authentication was cancelled or failed.');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
<<<<<<< HEAD
    const form = new FormData(event.currentTarget);
    const name = form.get('name');
    const email = form.get('email');
    if (!name || !email) {
      setError('Please fill in your name and email.');
      return;
    }
    setError('');
    setLoading(true);
    await login({ name, email });
    const destination = new URLSearchParams(window.location.search).get('from') || '/learning';
    window.location.href = destination;
=======

    const form = new FormData(event.currentTarget);
    const name = form.get('name');
    const email = form.get('email');
    const password = form.get('new-password');
    const confirm = form.get('confirm-password');

    if (!name || !email || !password) {
      setError('Please fill in your name, email and password.');
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await register({ name, email, password });

      const destination =
        new URLSearchParams(window.location.search).get('from') ||
        '/learning';

      window.location.href = destination;
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
>>>>>>> frontend
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
<<<<<<< HEAD
      <FormField label="Full name" name="name" placeholder="Your full name" required />
      <FormField label="Email address" type="email" name="email" placeholder="you@example.com" required />
      <FormField label="Password" type="password" name="new-password" placeholder="Create a password" required />
      <FormField label="Confirm password" type="password" name="confirm-password" placeholder="Repeat your password" required />
=======
      <FormField
        label="Full name"
        name="name"
        placeholder="Your full name"
        required
      />

      <FormField
        label="Email address"
        type="email"
        name="email"
        placeholder="you@example.com"
        required
      />

      <FormField
        label="Password"
        type="password"
        name="new-password"
        placeholder="Create a password"
        required
      />

      <FormField
        label="Confirm password"
        type="password"
        name="confirm-password"
        placeholder="Repeat your password"
        required
      />

>>>>>>> frontend
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
<<<<<<< HEAD
      <label className="terms">
        <input type="checkbox" required /> I agree to the PlacePro terms and privacy policy.
      </label>
      <button className="button full" type="submit" disabled={loading}>
        {loading ? 'Creating account…' : 'Create account'} <span>↗</span>
      </button>
      <div className="or-divider">
        <span>or</span>
      </div>
      <div className="google-auth-wrapper" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
=======

      <label className="terms">
        <input type="checkbox" required /> I agree to the PlacePro terms and
        privacy policy.
      </label>

      <button className="button full" type="submit" disabled={loading}>
        {loading ? 'Creating account…' : 'Create account'} <span>↗</span>
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
>>>>>>> frontend
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="filled_black"
          shape="pill"
          size="large"
          text="signup_with"
          width="100%"
        />
      </div>
    </form>
  );
<<<<<<< HEAD
}

=======
}
>>>>>>> frontend

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { FormField } from '../common/FormField';
import { useAuth } from '../../context/AuthContext';
import { useRoute } from '../../context/RouteContext';

export function SignupForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const { path, navigate } = useRoute();
  const destination = new URLSearchParams(path.split('?')[1] || '').get('from') || '/learning';

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle(credentialResponse.credential);
      navigate(destination);
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
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('new-password') || '');
    const confirm = String(form.get('confirm-password') || '');
    if (!name || !email || !password) {
      setError('Please fill in your name, email and password.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
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
      navigate(destination);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <FormField label="Full name" name="name" placeholder="Your full name" required />
      <FormField label="Email address" type="email" name="email" placeholder="you@example.com" required />
      <FormField label="Password" type="password" name="new-password" placeholder="Create a password" required />
      <FormField label="Confirm password" type="password" name="confirm-password" placeholder="Repeat your password" required />
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <label className="terms">
        <input type="checkbox" required /> I agree to the PlacePro terms and privacy policy.
      </label>
      <button className="button full" type="submit" disabled={loading}>
        {loading ? 'Creating accountΓÇª' : 'Create account'} <span>Γåù</span>
      </button>
      <div className="or-divider">
        <span>or</span>
      </div>
      <div className="google-auth-wrapper" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
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
}


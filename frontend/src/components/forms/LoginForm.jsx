import React, { useState } from 'react';
import { FormField } from '../common/FormField';
import { useAuth } from '../../context/AuthContext';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const submit = async event => { event.preventDefault(); const form = new FormData(event.currentTarget); if (!form.get('email') || !form.get('password')) { setError('Enter your email and password to continue.'); return; } setError(''); setLoading(true); await login(); const destination = new URLSearchParams(window.location.search).get('from') || '/learning'; window.location.href = destination; };
  return <form className="auth-form" onSubmit={submit} noValidate><label className="form-field"><span>Email address</span><input type="email" name="email" placeholder="you@example.com" autoComplete="email" required /></label><label className="form-field password-field"><span>Password</span><input type={showPassword ? 'text' : 'password'} name="password" placeholder="Enter your password" autoComplete="current-password" required /><button type="button" className="password-toggle" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button></label>{error && <p className="form-error" role="alert">{error}</p>}<div className="form-options"><label><input type="checkbox" name="remember" /> Remember me</label><button type="button" className="inline-link">Forgot password?</button></div><button className="button full" type="submit" disabled={loading}>{loading ? 'Logging in…' : 'Log in'}</button><div className="or-divider"><span>or</span></div><button className="social-button" type="button">G <span>Continue with Google</span></button></form>;
}

import React from 'react';
import { FormField } from '../common/FormField';

export function LoginForm() {
  return <form className="auth-form" onSubmit={event => event.preventDefault()}><FormField label="Email address" type="email" name="email" placeholder="you@example.com" /><FormField label="Password" type="password" name="current-password" placeholder="Enter your password" /><div className="form-options"><label><input type="checkbox" name="remember" /> Remember me</label><button type="button" className="inline-link">Forgot password?</button></div><button className="button full" type="submit">Log in</button><div className="or-divider"><span>or</span></div><button className="social-button" type="button">G <span>Continue with Google</span></button></form>;
}

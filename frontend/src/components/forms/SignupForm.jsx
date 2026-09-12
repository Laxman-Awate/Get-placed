import React from 'react';
import { FormField } from '../common/FormField';

export function SignupForm() {
  return <form className="auth-form" onSubmit={event => event.preventDefault()}><FormField label="Full name" name="name" placeholder="Your full name" /><FormField label="Email address" type="email" name="email" placeholder="you@example.com" /><FormField label="Password" type="password" name="new-password" placeholder="Create a password" /><FormField label="Confirm password" type="password" name="confirm-password" placeholder="Repeat your password" /><label className="terms"><input type="checkbox" required /> I agree to the PlacePro terms and privacy policy.</label><button className="button full" type="submit">Create account <span>↗</span></button><div className="or-divider"><span>or</span></div><button className="social-button" type="button">G <span>Sign up with Google</span></button></form>;
}

import React from 'react';
import { SignupForm } from '../../components/forms/SignupForm';

export function SignupPage() { return <section className="auth-page page-width"><div className="auth-card"><span className="section-kicker">START PREPARING</span><h1>Build skills.<br /><em>Get placed.</em></h1><p className="auth-intro">Create your free PlacePro account in less than a minute.</p><SignupForm /><p className="auth-switch">Already have an account? <a href="/login">Log in</a></p></div></section>; }

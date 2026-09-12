import React from 'react';
import { LoginForm } from '../../components/forms/LoginForm';

export function LoginPage() { return <section className="auth-page page-width"><div className="auth-card"><span className="section-kicker">WELCOME BACK</span><h1>Continue your<br /><em>placement journey.</em></h1><p className="auth-intro">Log in to pick up where you left off.</p><LoginForm /><p className="auth-switch">New to PlacePro? <a href="/signup">Create an account</a></p></div></section>; }

import React from 'react';
import { SignupForm } from '../../components/forms/SignupForm';
import { Link } from '../../context/RouteContext';

export function SignupPage() { return <section className="auth-page page-width"><div className="auth-card"><span className="section-kicker">START PREPARING</span><h1>Build skills.<br /><em>Get placed.</em></h1><p className="auth-intro">Create your free PlacePro account in less than a minute.</p><SignupForm /><p className="auth-switch">Already have an account? <Link href="/login">Log in</Link></p></div></section>; }

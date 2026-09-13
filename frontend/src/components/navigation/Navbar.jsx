import React, { useState } from 'react';
import { Arrow, Logo } from '../common/Logo';
import { PUBLIC_NAVIGATION } from '../../constants/navigation';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const go = item => { setOpen(false); if (item.path) window.location.href = item.path; else document.querySelector(item.target)?.scrollIntoView({ behavior: 'smooth' }); };
  return <header className="site-header"><Logo /><button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>☰</button><nav className={open ? 'nav open' : 'nav'} aria-label="Primary navigation">{PUBLIC_NAVIGATION.map(item => <button key={item.label} className={item.label === 'Home' ? 'nav-link active' : 'nav-link'} onClick={() => go(item)}>{item.label}</button>)}<div className="nav-actions">{isAuthenticated ? <button className="login-button" onClick={() => { logout(); window.location.href = '/'; }}>Logout</button> : <><button className="login-button" onClick={() => { window.location.href = '/login'; }}>Log in</button><button className="button small" onClick={() => { window.location.href = '/signup'; }}>Get started <Arrow /></button></>}</div></nav></header>;
}

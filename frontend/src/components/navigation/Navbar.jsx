import React, { useState } from 'react';
import { Arrow, Logo } from '../common/Logo';
import { PUBLIC_NAVIGATION } from '../../constants/navigation';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const go = item => { setOpen(false); if (item.path) window.location.href = item.path; else document.querySelector(item.target)?.scrollIntoView({ behavior: 'smooth' }); };
  return <header className="site-header"><Logo /><button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>☰</button><nav className={open ? 'nav open' : 'nav'} aria-label="Public navigation">{PUBLIC_NAVIGATION.map(item => <button key={item.label} className="nav-link active" onClick={() => go(item)}>{item.label}</button>)}<div className="nav-actions"><button className="login-button" onClick={() => { setOpen(false); window.location.href = '/login'; }}>Login</button><button className="button small" onClick={() => { setOpen(false); window.location.href = '/signup'; }}>Sign Up <Arrow /></button></div></nav></header>;
}

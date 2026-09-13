import React from 'react';
import { Logo } from '../common/Logo';
import { STUDENT_NAVIGATION } from '../../constants/navigation';
import { useAuth } from '../../context/AuthContext';

const icons = { Dashboard: '▦', Learning: '◒', Practice: '⌁', Coding: '</>', 'Mock Tests': '◉', Companies: '◇', Profile: '◯', Settings: '⚙' };
export function StudentSidebar({ open, onClose }) {
  const { logout } = useAuth();
  const link = label => { const href = label === 'Dashboard' ? '/dashboard' : `/${label.toLowerCase().replace(' ', '-')}`; const active = window.location.pathname === href || ['Learning', 'Practice', 'Mock Tests', 'Companies'].includes(label) && window.location.pathname.startsWith(href); return <a className={active ? 'student-nav-link active' : 'student-nav-link'} href={href} onClick={onClose}><span>{icons[label]}</span>{label}</a>; };
  return <aside className={open ? 'student-sidebar drawer-open' : 'student-sidebar'}><div className="sidebar-head"><Logo /><button className="drawer-close" onClick={onClose} aria-label="Close navigation">×</button></div><div className="sidebar-label">YOUR PREPARATION</div><nav>{STUDENT_NAVIGATION.map(label => <React.Fragment key={label}>{link(label)}</React.Fragment>)}</nav><div className="sidebar-bottom">{link('Profile')}{link('Settings')}<button className="student-nav-link logout" onClick={() => { logout(); window.location.href = '/'; }}><span>↪</span>Logout</button></div></aside>;
}

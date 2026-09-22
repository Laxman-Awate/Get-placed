import React from 'react';
import { Logo } from '../common/Logo';
import { STUDENT_NAVIGATION } from '../../constants/navigation';
import { useAuth } from '../../context/AuthContext';
import { Link, useRoute } from '../../context/RouteContext';

const icons = { Dashboard: '▦', Learning: '◒', Practice: '⌁', Coding: '</>', 'Mock Tests': '◉', Companies: '◇', Profile: '◯', Settings: '⚙' };

export function StudentSidebar({ open, onClose }) {
  const { logout, isAdmin } = useAuth();
  const { path, navigate } = useRoute();
  const current = path.split('?')[0];
  const link = (label) => {
    const href = label === 'Dashboard' ? '/dashboard' : `/${label.toLowerCase().replace(' ', '-')}`;
    const active = current === href || (['Learning', 'Practice', 'Mock Tests', 'Companies'].includes(label) && current.startsWith(href));
    return <Link className={active ? 'student-nav-link active' : 'student-nav-link'} href={href} onClick={onClose}><span>{icons[label]}</span>{label}</Link>;
  };
  return (
    <aside className={open ? 'student-sidebar drawer-open' : 'student-sidebar'}>
      <div className="sidebar-head">
        <Logo />
        <button className="drawer-close" onClick={onClose} aria-label="Close navigation">×</button>
      </div>
      <div className="sidebar-label">YOUR PREPARATION</div>
      <nav>
        {STUDENT_NAVIGATION.map((label) => <React.Fragment key={label}>{link(label)}</React.Fragment>)}
      </nav>
      <div className="sidebar-bottom">
        {isAdmin && (
          <Link
            className={current.startsWith('/admin') ? 'student-nav-link active' : 'student-nav-link'}
            href="/admin/dashboard"
            onClick={onClose}
          >
            <span>⚡</span>Admin Portal
          </Link>
        )}
        {link('Profile')}
        {link('Settings')}
        <button className="student-nav-link logout" onClick={() => { logout(); navigate('/'); }}>
          <span>↪</span>Logout
        </button>
      </div>
    </aside>
  );
}

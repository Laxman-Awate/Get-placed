import React, { useState } from 'react';
import { StudentSidebar } from '../components/navigation/StudentSidebar';
import { useAuth } from '../context/AuthContext';

export function StudentLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false); const [profileOpen, setProfileOpen] = useState(false); const { logout } = useAuth();
  return <div className="student-shell"><StudentSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} /><div className="student-main"><header className="student-topbar"><button className="student-menu" onClick={() => setDrawerOpen(true)} aria-label="Open navigation">☰</button><div className="student-search">⌕ <span>Search learning, questions, companies...</span></div><div className="topbar-actions"><button aria-label="Notifications">♧</button><div className="profile-menu"><button className="user-chip" onClick={() => setProfileOpen(value => !value)} aria-expanded={profileOpen}><span>AS</span><strong>Arjun Sharma</strong><small>⌄</small></button>{profileOpen&&<div className="profile-dropdown"><a href="/profile">Profile</a><a href="/dashboard">Dashboard / My Progress</a><a href="/settings">Settings</a><button onClick={() => { logout(); window.location.href = '/'; }}>Logout</button></div>}</div></div></header><main className="student-content">{children}</main></div></div>;
}

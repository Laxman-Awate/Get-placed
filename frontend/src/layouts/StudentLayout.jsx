import React, { useState } from 'react';
import { StudentSidebar } from '../components/navigation/StudentSidebar';

export function StudentLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return <div className="student-shell"><StudentSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} /><div className="student-main"><header className="student-topbar"><button className="student-menu" onClick={() => setDrawerOpen(true)} aria-label="Open navigation">☰</button><div className="student-search">⌕ <span>Search learning, questions, companies...</span></div><div className="topbar-actions"><button aria-label="Notifications">♧</button><button className="user-chip" onClick={() => { window.location.href = '/profile'; }}><span>AS</span><strong>Arjun Sharma</strong><small>⌄</small></button></div></header><main className="student-content">{children}</main></div></div>;
}

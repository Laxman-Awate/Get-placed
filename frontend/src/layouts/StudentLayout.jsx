import React, { useState } from 'react';
import { StudentSidebar } from '../components/navigation/StudentSidebar';
import { useAuth } from '../context/AuthContext';
import { Link, useRoute } from '../context/RouteContext';

export function StudentLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { navigate } = useRoute();

  const displayName = user?.name || 'Arjun Sharma';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  return (
    <div className="student-shell">
      <StudentSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="student-main">
        <header className="student-topbar">
          <button className="student-menu" onClick={() => setDrawerOpen(true)} aria-label="Open navigation">
            Γÿ░
          </button>
          <div className="student-search">
            Γîò <span>Search learning, questions, companies...</span>
          </div>
          <div className="topbar-actions">
            <button aria-label="Notifications">ΓÖº</button>
            <div className="profile-menu">
              <button
                className="user-chip"
                onClick={() => setProfileOpen((value) => !value)}
                aria-expanded={profileOpen}
              >
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={displayName}
                    style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>{initials}</span>
                )}
                <strong>{displayName}</strong>
                <small>Γîä</small>
              </button>
              {profileOpen && (
                <div className="profile-dropdown" onClick={() => setProfileOpen(false)}>
                  <Link href="/profile">Profile</Link>
                  <Link href="/dashboard">Dashboard / My Progress</Link>
                  <Link href="/settings">Settings</Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="student-content">{children}</main>
      </div>
    </div>
  );
}

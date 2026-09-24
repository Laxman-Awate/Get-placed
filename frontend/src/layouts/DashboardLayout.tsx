import { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import {
  LayoutDashboard, BookOpen, FlaskConical, Code2, ClipboardList,
  Building2, MessageSquare, FileText, Settings, Zap, LogOut, Map, User
} from 'lucide-react';
import { authService } from '../services/authService';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/learn', icon: BookOpen, label: 'Learn' },
  { to: '/dashboard/practice', icon: FlaskConical, label: 'Practice' },
  { to: '/dashboard/coding', icon: Code2, label: 'Coding' },
  { to: '/dashboard/mock-test', icon: ClipboardList, label: 'Mock Tests' },
  { to: '/dashboard/company-prep', icon: Building2, label: 'Companies' },
  { to: '/dashboard/interviews', icon: MessageSquare, label: 'Interviews' },
  { to: '/dashboard/resume', icon: FileText, label: 'Resume' },
  { to: '/dashboard/roadmap', icon: Map, label: 'Roadmap' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const user = authService.getUser();
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login?mode=login', { replace: true });
    }
  }, [navigate]);
  if (!user) {
    return <div className="min-h-screen bg-[#080810] flex items-center justify-center text-sm text-[#94a3b8]">Redirecting to login...</div>;
  }
  const initials = user.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'A';

  return (
    <div className="flex h-screen bg-[#080810] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[220px] flex-shrink-0 flex flex-col border-r border-[#1e1e30] bg-[#0a0a14]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#1e1e30]">
          <div className="w-8 h-8 rounded-xl bg-[#0f0f1a] border border-[#1e1e30] flex items-center justify-center p-1 shadow-md shadow-teal-500/10">
            <img src="/logo-icon.png" alt="LevelUp Logo" className="w-full h-full object-contain filter drop-shadow-[0_2px_6px_rgba(20,184,166,0.3)]" />
          </div>
          <div>
            <span className="font-extrabold text-white text-sm font-[Plus_Jakarta_Sans] tracking-tight">
              Level<span className="text-[#38bdf8]">Up</span>
            </span>
            <div className="text-[10px] text-teal-400 font-semibold tracking-wider leading-none mt-0.5">PLACEMENT PRO</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 hide-scrollbar">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm cursor-pointer ${
                  isActive
                    ? 'active text-teal-400 font-medium'
                    : 'text-[#64748b] hover:text-[#94a3b8]'
                }`
              }
            >
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-[#1e1e30]">
          <button
            onClick={() => navigate('/dashboard/profile')}
            title="View profile"
            className="w-full flex items-center gap-2.5 px-2 py-2 mb-1 rounded-lg hover:bg-[#0f0f1a] transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">{user.name}</div>
              <div className="text-[10px] text-[#64748b] truncate">{user.email}</div>
            </div>
          </button>
          <button
            onClick={() => {
              authService.logout();
              navigate('/login');
            }}
            className="sidebar-item w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#64748b] hover:text-red-400 cursor-pointer"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <ErrorBoundary title="This page">
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}

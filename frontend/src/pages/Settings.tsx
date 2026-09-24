import { useEffect, useState } from 'react';
import { Bell, Lock, User, Palette, Globe, Shield, Check, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import { resumeService } from '../services/resumeService';

type Tab = 'account' | 'notifications' | 'appearance' | 'privacy' | 'preferences';

const tabs: { key: Tab; label: string; icon: typeof User }[] = [
  { key: 'account', label: 'Account', icon: User },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'preferences', label: 'Preferences', icon: Globe },
  { key: 'privacy', label: 'Privacy & Security', icon: Shield },
];

const SETTINGS_KEY = 'placepro.settings';

const defaultSettings = {
  notifs: { mockTest: true, newContent: true, weeklyReport: true, placement: false, email: true, push: false },
  prefs: { theme: 'dark', lang: 'English', timezone: 'IST (UTC+5:30)', codingLang: 'Python', dailyGoal: '5' },
  privacy: { profileVisibility: true, activitySharing: false, analytics: true },
};

function loadSettings() {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    return {
      notifs: { ...defaultSettings.notifs, ...(parsed.notifs || {}) },
      prefs: { ...defaultSettings.prefs, ...(parsed.prefs || {}) },
      privacy: { ...defaultSettings.privacy, ...(parsed.privacy || {}) },
    };
  } catch {
    return defaultSettings;
  }
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0 ${value ? 'bg-teal-500' : 'bg-[#2e2e45]'}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${value ? 'left-5' : 'left-1'}`} />
    </button>
  );
}

export default function Settings() {
  const [tab, setTab] = useState<Tab>('account');
  const user = authService.getUser();
  const initials = (user?.name || user?.email || 'U').slice(0, 1).toUpperCase();
  const [name, setName] = useState(user?.name || '');
  const [nameLoaded, setNameLoaded] = useState(false);
  const [notifs, setNotifs] = useState(defaultSettings.notifs);
  const [prefs, setPrefs] = useState(defaultSettings.prefs);
  const [privacy, setPrivacy] = useState(defaultSettings.privacy);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState('');

  // Load persisted values: display name from the profile API, everything
  // else from local device settings.
  useEffect(() => {
    let active = true;
    const stored = loadSettings();
    if (active) {
      setNotifs(stored.notifs);
      setPrefs(stored.prefs);
      setPrivacy(stored.privacy);
      document.documentElement.dataset.theme = stored.prefs.theme;
    }
    profileService
      .getProfile()
      .then((profile) => active && profile?.name !== undefined && setName(profile.name))
      .catch(() => {})
      .finally(() => active && setNameLoaded(true));
    return () => {
      active = false;
    };
  }, []);

  const save = async () => {
    setSaveState('saving');
    setSaveError('');
    try {
      // Display name goes to the real profile backend.
      if (nameLoaded && name.trim() && name.trim() !== user?.name) {
        await profileService.updateProfile({ name: name.trim() });
      }
      // Device preferences persist to localStorage — a real write that
      // survives reloads. There is no server endpoint for these.
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify({ notifs, prefs, privacy }));
      document.documentElement.dataset.theme = prefs.theme;
      setSaveState('saved');
      setTimeout(() => setSaveState((s) => (s === 'saved' ? 'idle' : s)), 2000);
    } catch (err: any) {
      setSaveError(err?.message || 'Could not save settings. Please try again.');
      setSaveState('error');
    }
  };

  const exportData = async () => {
    try {
      const profile = await profileService.getProfile().catch(() => authService.getUser());
      const resume = await resumeService.getResume().catch(() => resumeService.getLocalResume());
      const blob = new Blob([JSON.stringify({ profile, resume, exportedAt: new Date().toISOString() }, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'levelup-data-export.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setSaveError(err?.message || 'Export failed. Please try again.');
      setSaveState('error');
    }
  };

  return (
    <div className="min-h-full bg-[#080810] flex">
      {/* Sidebar */}
      <div className="w-52 border-r border-[#1e1e30] p-4 sticky top-0 h-screen">
        <div className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-3">Settings</div>
        <div className="space-y-1">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`sidebar-item w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left ${tab === t.key ? 'active' : 'text-[#64748b]'}`}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto hide-scrollbar max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold font-[Plus_Jakarta_Sans] text-white capitalize">{tab.replace('-', ' & ')}</h1>
          <button
            onClick={save}
            disabled={saveState === 'saving'}
            className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-60 ${saveState === 'saved' ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'bg-teal-500 hover:bg-teal-400 text-white'}`}
          >
            {saveState === 'saved' ? <><Check size={14} />Saved!</> : saveState === 'saving' ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {saveState === 'error' && (
          <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
            <AlertCircle size={13} />{saveError}
          </div>
        )}

        {tab === 'account' && (
          <div className="space-y-4">
            <div className="card-dark rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white">{initials}</div>
                <div>
                  <div className="text-base font-semibold text-white">{name || user?.name || 'Student'}</div>
                  <div className="text-sm text-[#64748b]">{user?.email || 'No email available'}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs text-[#94a3b8] mb-1">Full Name (editable)</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={nameLoaded ? 'Your name' : 'Loading...'}
                    className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all" />
                </div>
                {[
                  { label: 'Email', val: user?.email || '' },
                  { label: 'Plan', val: user?.plan || 'free' },
                  { label: 'Provider', val: user?.provider || 'local' },
                  { label: 'Role', val: user?.role || 'STUDENT' },
                  { label: 'Account Status', val: 'Active' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs text-[#94a3b8] mb-1">{f.label}</label>
                    <input value={f.val} readOnly
                      className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-xl px-3 py-2 text-sm text-[#64748b] focus:outline-none cursor-default" />
                  </div>
                ))}
              </div>
            </div>
            <div className="card-dark rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={14} className="text-[#94a3b8]" />
                <h3 className="text-sm font-semibold text-white">Password</h3>
              </div>
              <p className="text-xs text-[#64748b]">
                {user?.provider === 'GOOGLE'
                  ? 'You signed in with Google — your password is managed by Google.'
                  : 'Password changes are not available in this release.'}
              </p>
            </div>
          </div>
        )}

        {tab === 'notifications' && (
          <div className="card-dark rounded-xl p-5">
            <div className="space-y-4">
              {[
                { key: 'mockTest', label: 'Mock Test Reminders', sub: 'Get reminded before scheduled mock tests' },
                { key: 'newContent', label: 'New Content Alerts', sub: 'When new problems or courses are added' },
                { key: 'weeklyReport', label: 'Weekly Progress Report', sub: 'Summary of your weekly activity and scores' },
                { key: 'placement', label: 'Placement Updates', sub: 'Company visits and recruitment alerts' },
                { key: 'email', label: 'Email Notifications', sub: 'Receive notifications via email' },
                { key: 'push', label: 'Push Notifications', sub: 'Browser push notifications' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b border-[#1e1e30] last:border-0">
                  <div>
                    <div className="text-sm font-medium text-white">{item.label}</div>
                    <div className="text-xs text-[#64748b] mt-0.5">{item.sub}</div>
                  </div>
                  <Toggle
                    value={notifs[item.key as keyof typeof notifs]}
                    onChange={v => setNotifs(prev => ({ ...prev, [item.key]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'appearance' && (
          <div className="space-y-4">
            <div className="card-dark rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Theme</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'dark', label: 'Dark', preview: 'bg-[#080810]' },
                  { id: 'darker', label: 'Pitch Black', preview: 'bg-black' },
                  { id: 'dim', label: 'Dim', preview: 'bg-[#111827]' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setPrefs(p => ({ ...p, theme: t.id }))}
                    className={`p-3 rounded-xl border text-center transition-all ${prefs.theme === t.id ? 'border-teal-500/50 bg-teal-500/8' : 'border-[#1e1e30] hover:border-[#2e2e45]'}`}
                  >
                    <div className={`w-full h-12 rounded-lg ${t.preview} mb-2 border border-[#2e2e45]`} />
                    <div className="text-xs font-medium text-[#94a3b8]">{t.label}</div>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#475569] mt-3">Theme preference is stored on this device and applied on save.</p>
            </div>
          </div>
        )}

        {tab === 'preferences' && (
          <div className="card-dark rounded-xl p-5">
            <div className="space-y-4">
              {[
                { key: 'lang', label: 'Language', options: ['English', 'Hindi'] },
                { key: 'timezone', label: 'Timezone', options: ['IST (UTC+5:30)', 'UTC', 'PST'] },
                { key: 'codingLang', label: 'Default Language (Coding)', options: ['Python', 'JavaScript', 'Java', 'C++', 'C'] },
                { key: 'dailyGoal', label: 'Daily Goal (Problems)', options: ['3', '5', '10', '20'] },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b border-[#1e1e30] last:border-0">
                  <div className="text-sm font-medium text-white">{item.label}</div>
                  <select
                    value={prefs[item.key as keyof typeof prefs]}
                    onChange={(e) => setPrefs(prev => ({ ...prev, [item.key]: e.target.value }))}
                    className="bg-[#0f0f1a] border border-[#1e1e30] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all">
                    {item.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'privacy' && (
          <div className="space-y-4">
            <div className="card-dark rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Privacy Controls</h3>
              <div className="space-y-4">
                {[
                  { key: 'profileVisibility', label: 'Profile Visibility', sub: 'Show your profile to other students' },
                  { key: 'activitySharing', label: 'Activity Sharing', sub: 'Allow your progress to appear on leaderboards' },
                  { key: 'analytics', label: 'Analytics', sub: 'Help improve LevelUp with usage analytics' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b border-[#1e1e30] last:border-0">
                    <div>
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      <div className="text-xs text-[#64748b] mt-0.5">{item.sub}</div>
                    </div>
                    <Toggle
                      value={privacy[item.key as keyof typeof privacy]}
                      onChange={(v) => setPrivacy(prev => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="card-dark rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-2">Your Data</h3>
              <p className="text-xs text-[#64748b] mb-4">Download a copy of your profile and resume data.</p>
              <div className="flex gap-3">
                <button onClick={exportData} className="text-xs border border-teal-500/30 text-teal-400 px-4 py-2 rounded-lg hover:bg-teal-500/10 transition-all">Export Data</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

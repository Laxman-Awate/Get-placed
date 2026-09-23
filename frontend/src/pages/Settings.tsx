import { useState } from 'react';
import { Bell, Lock, User, Palette, Globe, Shield, ChevronRight, Check } from 'lucide-react';

type Tab = 'account' | 'notifications' | 'appearance' | 'privacy' | 'preferences';

const tabs: { key: Tab; label: string; icon: typeof User }[] = [
  { key: 'account', label: 'Account', icon: User },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'preferences', label: 'Preferences', icon: Globe },
  { key: 'privacy', label: 'Privacy & Security', icon: Shield },
];

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
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({
    mockTest: true, newContent: true, weeklyReport: true, placement: false, email: true, push: false,
  });
  const [prefs, setPrefs] = useState({ theme: 'dark', lang: 'English', timezone: 'IST (UTC+5:30)' });

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

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
            className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all ${saved ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'bg-teal-500 hover:bg-teal-400 text-white'}`}
          >
            {saved ? <><Check size={14} />Saved!</> : 'Save Changes'}
          </button>
        </div>

        {tab === 'account' && (
          <div className="space-y-4">
            <div className="card-dark rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white">A</div>
                <div>
                  <div className="text-base font-semibold text-white">Arjun Kumar</div>
                  <div className="text-sm text-[#64748b]">arjun.kumar@gmail.com</div>
                  <button className="text-xs text-teal-400 hover:underline mt-1">Change avatar</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Full Name', val: 'Arjun Kumar' },
                  { label: 'Email', val: 'arjun.kumar@gmail.com' },
                  { label: 'Phone', val: '+91 98765 43210' },
                  { label: 'College', val: 'IIT Delhi' },
                  { label: 'Branch', val: 'Computer Science' },
                  { label: 'Graduation Year', val: '2025' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs text-[#94a3b8] mb-1">{f.label}</label>
                    <input defaultValue={f.val}
                      className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all" />
                  </div>
                ))}
              </div>
            </div>
            <div className="card-dark rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Lock size={14} className="text-[#94a3b8]" />
                <h3 className="text-sm font-semibold text-white">Change Password</h3>
              </div>
              <div className="space-y-3">
                {['Current Password', 'New Password', 'Confirm New Password'].map(p => (
                  <div key={p}>
                    <label className="block text-xs text-[#94a3b8] mb-1">{p}</label>
                    <input type="password" placeholder="••••••••"
                      className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all" />
                  </div>
                ))}
              </div>
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
            </div>

            <div className="card-dark rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Accent Color</h3>
              <div className="flex gap-3">
                {[
                  { color: 'bg-teal-500', label: 'Teal' },
                  { color: 'bg-blue-500', label: 'Blue' },
                  { color: 'bg-purple-500', label: 'Purple' },
                  { color: 'bg-orange-500', label: 'Orange' },
                  { color: 'bg-green-500', label: 'Green' },
                ].map(c => (
                  <button key={c.label} className="flex flex-col items-center gap-1">
                    <div className={`w-8 h-8 rounded-full ${c.color} ${c.label === 'Teal' ? 'ring-2 ring-white ring-offset-2 ring-offset-[#13131f]' : ''}`} />
                    <span className="text-[10px] text-[#64748b]">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'preferences' && (
          <div className="card-dark rounded-xl p-5">
            <div className="space-y-4">
              {[
                { label: 'Language', val: 'English', options: ['English', 'Hindi'] },
                { label: 'Timezone', val: 'IST (UTC+5:30)', options: ['IST (UTC+5:30)', 'UTC', 'PST'] },
                { label: 'Default Language (Coding)', val: 'Python', options: ['Python', 'JavaScript', 'Java', 'C++', 'C'] },
                { label: 'Daily Goal (Problems)', val: '5', options: ['3', '5', '10', '20'] },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#1e1e30] last:border-0">
                  <div className="text-sm font-medium text-white">{item.label}</div>
                  <select className="bg-[#0f0f1a] border border-[#1e1e30] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all">
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
                  { label: 'Profile Visibility', sub: 'Show your profile to other students' },
                  { label: 'Activity Sharing', sub: 'Allow your progress to appear on leaderboards' },
                  { label: 'Analytics', sub: 'Help improve LevelUp with usage analytics' },
                ].map((item, i) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-[#1e1e30] last:border-0">
                    <div>
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      <div className="text-xs text-[#64748b] mt-0.5">{item.sub}</div>
                    </div>
                    <Toggle value={i !== 1} onChange={() => {}} />
                  </div>
                ))}
              </div>
            </div>
            <div className="card-dark rounded-xl p-5 border border-red-500/20">
              <h3 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h3>
              <p className="text-xs text-[#64748b] mb-4">These actions are permanent and cannot be undone.</p>
              <div className="flex gap-3">
                <button className="text-xs border border-orange-500/30 text-orange-400 px-4 py-2 rounded-lg hover:bg-orange-500/10 transition-all">Export Data</button>
                <button className="text-xs border border-red-500/30 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-all">Delete Account</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router';
import { Check, Pencil, FileText, Target, Settings as SettingsIcon } from 'lucide-react';
import { useStudentProfile } from '../hooks/useStudentProfile';
import { ActivityHeatmap } from '../components/profile/ActivityHeatmap';

const fields: { key: string; label: string; span?: boolean }[] = [
  { key: 'name', label: 'Full Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'location', label: 'Location' },
  { key: 'college', label: 'College / University', span: true },
  { key: 'degree', label: 'Degree' },
  { key: 'branch', label: 'Branch' },
  { key: 'graduationYear', label: 'Graduation Year' },
  { key: 'semester', label: 'Semester' },
  { key: 'cgpa', label: 'CGPA' },
  { key: 'role', label: 'Target Role', span: true },
  { key: 'locations', label: 'Preferred Locations', span: true },
];

function asText(value: unknown): string {
  if (Array.isArray(value)) return value.join(', ');
  return String(value ?? '');
}

export default function Profile() {
  const navigate = useNavigate();
  const { profile, editing, setEditing, completion, update, save, saved, loading, saving, error } =
    useStudentProfile();

  const initials = (profile?.name || profile?.email || 'U').slice(0, 1).toUpperCase();

  if (loading && !profile) {
    return (
      <div className="min-h-full bg-[#080810] p-6">
        <div className="h-6 w-56 rounded-lg bg-[#0f0f1a] border border-[#1e1e30] animate-pulse mb-6" />
        <div className="card-dark rounded-2xl p-6 mb-4">
          <div className="h-16 w-16 rounded-2xl bg-[#1e1e30] animate-pulse mb-4" />
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 rounded-xl bg-[#1e1e30] animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if ((error && !profile) || !profile) {
    return (
      <div className="min-h-full bg-[#080810] p-6">
        <div className="card-dark rounded-xl p-8 text-center text-sm text-[#64748b]">
          {error || 'No profile data. Please try again.'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#080810] p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold font-[Plus_Jakarta_Sans] text-white mb-1">My Profile</h1>
          <p className="text-sm text-[#64748b]">Your placement identity — used across readiness, resume and applications.</p>
        </div>

        {error && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Identity header */}
        <div className="card-dark rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white">
              {initials}
            </div>
            <div className="flex-1">
              <div className="text-base font-semibold text-white">{profile.name || 'Student'}</div>
              <div className="text-sm text-[#64748b]">{profile.email}</div>
              <div className="text-xs text-[#475569] mt-0.5">
                {[profile.college, profile.degree, profile.branch].filter(Boolean).join(' · ') || 'Complete your profile below'}
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-[#94a3b8]">Profile completion</span>
              <span className="text-xs font-semibold text-teal-400">{completion}%</span>
            </div>
            <div className="h-2 bg-[#1e1e30] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transition-all" style={{ width: `${completion}%` }} />
            </div>
          </div>
        </div>

        {/* Activity heatmap — real per-day counts from /api/activity/calendar */}
        <div className="mb-4">
          <ActivityHeatmap />
        </div>

        {/* Editable details */}
        <div className="card-dark rounded-2xl p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Details</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-white px-4 py-2 rounded-xl transition-all"
              >
                <Pencil size={12} />Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditing(false)}
                  className="text-xs border border-[#1e1e30] text-[#94a3b8] hover:text-white px-4 py-2 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-white px-4 py-2 rounded-xl transition-all disabled:opacity-60"
                >
                  {saving ? 'Saving...' : saved ? <><Check size={12} />Saved!</> : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.key} className={f.span ? 'col-span-2' : ''}>
                <label className="block text-xs text-[#94a3b8] mb-1">{f.label}</label>
                {editing ? (
                  <input
                    value={asText((profile as any)[f.key])}
                    onChange={(e) => update(f.key, e.target.value)}
                    className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all"
                  />
                ) : (
                  <div className="text-sm text-white bg-[#0f0f1a] border border-[#1e1e30] rounded-xl px-3 py-2 min-h-[36px]">
                    {asText((profile as any)[f.key]) || <span className="text-[#475569]">—</span>}
                  </div>
                )}
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-xs text-[#94a3b8] mb-1">Skills (comma-separated)</label>
              {editing ? (
                <input
                  value={asText(profile.skills)}
                  onChange={(e) => update('skills', e.target.value)}
                  className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all"
                />
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(profile.skills) ? profile.skills : []).length > 0 ? (
                    (profile.skills as string[]).map((s) => (
                      <span key={s} className="text-[11px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">{s}</span>
                    ))
                  ) : (
                    <span className="text-sm text-[#475569]">—</span>
                  )}
                </div>
              )}
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-[#94a3b8] mb-1">Target Companies (comma-separated)</label>
              {editing ? (
                <input
                  value={asText(profile.companies)}
                  onChange={(e) => update('companies', e.target.value)}
                  className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all"
                />
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(profile.companies) ? profile.companies : []).length > 0 ? (
                    (profile.companies as string[]).map((c) => (
                      <span key={c} className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{c}</span>
                    ))
                  ) : (
                    <span className="text-sm text-[#475569]">—</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Resume Builder', icon: FileText, to: '/dashboard/resume' },
            { label: 'Placement Ready', icon: Target, to: '/dashboard/placement-ready' },
            { label: 'Settings', icon: SettingsIcon, to: '/dashboard/settings' },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() => navigate(s.to)}
              className="card-dark card-lift rounded-xl p-4 flex items-center gap-3 text-left"
            >
              <s.icon size={16} className="text-teal-400 flex-shrink-0" />
              <span className="text-xs font-semibold text-white">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

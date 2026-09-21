import React, { useState } from 'react';
import { useStudentProfile } from '../../hooks/useStudentProfile';
import { usePlacementReadiness } from '../../hooks/usePlacementReadiness';
import { Link } from '../../context/RouteContext';
import { Avatar } from '../../components/common/Avatar';
import { ProfileCompletion } from '../../components/profile/ProfileCompletion';
import { ContributionCalendar } from '../../components/profile/ContributionCalendar';

function CardHead({ title, editing, onEdit, onSave, onCancel, saving }) {
  return (
    <div className="card-head">
      <h2>{title}</h2>
      {editing ? (
        <div className="card-head-actions">
          <button className="subtle-button" type="button" onClick={onCancel} disabled={saving}>Cancel</button>
          <button className="button small" type="button" onClick={onSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      ) : (
        <button className="text-button" type="button" onClick={onEdit}>Edit <span>✎</span></button>
      )}
    </div>
  );
}

export function ProfilePage() {
  const { profile, completion, update, save, saved, loading, saving, error } = useStudentProfile();
  const readiness = usePlacementReadiness();
  const [section, setSection] = useState(null);
  const [snapshot, setSnapshot] = useState(null);

  if (loading) return <div className="loading-panel">Loading profile…</div>;
  if (error && !profile) return <div className="loading-panel">Failed to load profile: {error}. Please refresh.</div>;
  if (!profile) return <div className="loading-panel">No profile data.</div>;

  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const companies = Array.isArray(profile.companies) ? profile.companies : [];

  const startEdit = (name) => {
    setSnapshot(JSON.parse(JSON.stringify(profile)));
    setSection(name);
  };
  const cancelEdit = () => {
    if (snapshot) {
      Object.keys(snapshot).forEach((key) => update(key, snapshot[key]));
    }
    setSection(null);
    setSnapshot(null);
  };
  const saveEdit = async () => {
    await save();
    setSection(null);
    setSnapshot(null);
  };

  const editing = (name) => section === name;

  return (
    <div className="profile-page">
      <header className="profile-header dashboard-panel">
        <Avatar name={profile.name} />
        <div className="profile-identity">
          <h1>{profile.name || 'Student'}</h1>
          <p>{profile.email}</p>
          <span>{profile.college} · {profile.degree} {profile.branch}</span>
          <small>Graduation: {profile.graduationYear}</small>
        </div>
        <div className="profile-header-actions">
          <button className="button" onClick={() => startEdit('personal')}>Edit profile</button>
          <ProfileCompletion percentage={completion} onComplete={() => startEdit('personal')} />
        </div>
      </header>
      {saved && <div className="save-message">Profile updated successfully</div>}
      {error && <div className="form-error" role="alert">{error}</div>}

      <div className="profile-summary-grid">
        <article className="dashboard-panel profile-summary-card">
          <span className="section-kicker">PLACEMENT READINESS</span>
          <strong>{readiness.score}%</strong>
          <span>{readiness.level}</span>
          <Link className="text-button" href="/placement-readiness">View placement readiness <span>↗</span></Link>
        </article>
        <article className="dashboard-panel profile-summary-card">
          <CardHead title="SKILLS" editing={editing('skills')} onEdit={() => startEdit('skills')} onSave={saveEdit} onCancel={cancelEdit} saving={saving} />
          {editing('skills') ? (
            <label className="inline-field"><span>Comma separated</span><input value={skills.join(', ')} onChange={(e) => update('skills', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} /></label>
          ) : (
            <>
              <div className="skill-pills">{skills.length === 0 ? <span>No skills added</span> : skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
              <button className="text-button" onClick={() => startEdit('skills')}>Update skills <span>↗</span></button>
            </>
          )}
        </article>
      </div>

      <div className="profile-sections">
        <section className="profile-info-card dashboard-panel">
          <CardHead title="Personal information" editing={editing('personal')} onEdit={() => startEdit('personal')} onSave={saveEdit} onCancel={cancelEdit} saving={saving} />
          <div><span>Full name</span>{editing('personal') ? <input value={profile.name || ''} onChange={(e) => update('name', e.target.value)} /> : <b>{profile.name || 'Not added'}</b>}</div>
          <div><span>Email</span><b>{profile.email}</b></div>
          <div><span>Phone</span>{editing('personal') ? <input value={profile.phone || ''} onChange={(e) => update('phone', e.target.value)} placeholder="Add phone" /> : <b>{profile.phone || 'Not added'}</b>}</div>
          <div><span>Location</span>{editing('personal') ? <input value={profile.location || ''} onChange={(e) => update('location', e.target.value)} placeholder="City" /> : <b>{profile.location || 'Not added'}</b>}</div>
        </section>

        <section className="profile-info-card dashboard-panel">
          <CardHead title="Academic information" editing={editing('academic')} onEdit={() => startEdit('academic')} onSave={saveEdit} onCancel={cancelEdit} saving={saving} />
          <div><span>College</span>{editing('academic') ? <input value={profile.college || ''} onChange={(e) => update('college', e.target.value)} /> : <b>{profile.college || 'Not added'}</b>}</div>
          <div><span>Degree</span>{editing('academic') ? <input value={profile.degree || ''} onChange={(e) => update('degree', e.target.value)} /> : <b>{profile.degree || 'Not added'}</b>}</div>
          <div><span>Branch</span>{editing('academic') ? <input value={profile.branch || ''} onChange={(e) => update('branch', e.target.value)} /> : <b>{profile.branch || 'Not added'}</b>}</div>
          <div><span>Graduation year</span>{editing('academic') ? <input value={profile.graduationYear || ''} onChange={(e) => update('graduationYear', e.target.value)} /> : <b>{profile.graduationYear || 'Not added'}</b>}</div>
          <div><span>Semester</span>{editing('academic') ? <input value={profile.semester || ''} onChange={(e) => update('semester', e.target.value)} /> : <b>{profile.semester || '–'}</b>}</div>
          <div><span>CGPA</span>{editing('academic') ? <input value={profile.cgpa || ''} onChange={(e) => update('cgpa', e.target.value)} /> : <b>{profile.cgpa || '–'}</b>}</div>
        </section>

        <section className="profile-info-card dashboard-panel">
          <CardHead title="Placement preferences" editing={editing('preferences')} onEdit={() => startEdit('preferences')} onSave={saveEdit} onCancel={cancelEdit} saving={saving} />
          <div><span>Preferred role</span>{editing('preferences') ? <input value={profile.role || ''} onChange={(e) => update('role', e.target.value)} /> : <b>{profile.role || 'Not added'}</b>}</div>
          <div><span>Locations</span>{editing('preferences') ? <input value={profile.locations || ''} onChange={(e) => update('locations', e.target.value)} /> : <b>{profile.locations || 'Not added'}</b>}</div>
          <div><span>Target companies</span>{editing('preferences') ? <input value={companies.join(', ')} onChange={(e) => update('companies', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} placeholder="Amazon, Microsoft" /> : <b>{companies.length ? companies.join(', ') : 'Not added'}</b>}</div>
        </section>
      </div>

      <ContributionCalendar />
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Download, Eye, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { resumeService } from '../services/resumeService';

type Section = 'personal' | 'education' | 'skills' | 'projects' | 'experience' | 'certifications';

const sections: { key: Section; label: string }[] = [
  { key: 'personal', label: 'Personal Info' },
  { key: 'education', label: 'Education' },
  { key: 'skills', label: 'Skills' },
  { key: 'projects', label: 'Projects' },
  { key: 'experience', label: 'Experience' },
  { key: 'certifications', label: 'Certifications' },
];

type Project = { title: string; tech: string; desc: string };
type Experience = { title: string; detail: string };
type Certification = { name: string; issuer: string; date: string };

const emptyForm = {
  name: '', email: '', phone: '',
  linkedin: '', github: '',
  college: '', degree: '', cgpa: '', gradYear: '',
  skills: '',
  projects: [] as Project[],
  experience: [] as Experience[],
  certifications: [] as Certification[],
};

export default function Resume() {
  const [activeSection, setActiveSection] = useState<Section>('personal');
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [atsScore, setAtsScore] = useState(0);
  const [resumeLoaded, setResumeLoaded] = useState(false);
  const dirtyRef = useRef(false);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dirtyRef.current = true;
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateListItem = <K extends 'projects' | 'experience' | 'certifications'>(
    key: K, index: number, patch: Partial<(typeof emptyForm)[K][number]>
  ) => {
    dirtyRef.current = true;
    setForm(prev => ({
      ...prev,
      [key]: (prev[key] as any[]).map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };

  const addListItem = (key: 'projects' | 'experience' | 'certifications') => {
    dirtyRef.current = true;
    const blank =
      key === 'projects' ? { title: '', tech: '', desc: '' }
      : key === 'experience' ? { title: '', detail: '' }
      : { name: '', issuer: '', date: '' };
    setForm(prev => ({ ...prev, [key]: [...(prev[key] as any[]), blank] }));
  };

  const removeListItem = (key: 'projects' | 'experience' | 'certifications', index: number) => {
    dirtyRef.current = true;
    setForm(prev => ({ ...prev, [key]: (prev[key] as any[]).filter((_, i) => i !== index) }));
  };

  // Load saved resume from backend (falls back to local copy).
  // Nothing is saved until this finishes — blank defaults must never
  // overwrite real data.
  useEffect(() => {
    let active = true;
    resumeService
      .getResume()
      .then((saved: any) => {
        if (!active) return;
        const data = saved?.data;
        if (saved && typeof saved.atsScore === 'number') setAtsScore(saved.atsScore);
        if (data && Object.keys(data).length > 0) {
          setForm((prev) => ({ ...prev, ...data }));
        } else {
          const local = resumeService.getLocalResume();
          if (local) setForm((prev) => ({ ...prev, ...local }));
        }
      })
      .catch(() => {
        const local = resumeService.getLocalResume();
        if (active && local) setForm((prev) => ({ ...prev, ...local }));
      })
      .finally(() => active && setResumeLoaded(true));
    return () => {
      active = false;
    };
  }, []);

  // Autosave (debounced) to backend; keeps a local copy offline.
  // Skipped until the initial load completes AND the user has edited
  // something, so a fresh page view never PUTs blank defaults.
  useEffect(() => {
    if (!resumeLoaded || !dirtyRef.current) return;
    const t = setTimeout(() => {
      resumeService
        .saveResume(form)
        .then((saved: any) => {
          if (saved && typeof saved.atsScore === 'number') setAtsScore(saved.atsScore);
        })
        .catch(() => {});
    }, 1500);
    return () => clearTimeout(t);
  }, [form, resumeLoaded]);

  // ATS feedback derived from the actual resume content, not hardcoded.
  const atsFeedback = useMemo(() => {
    const skillCount = form.skills.split(',').map(s => s.trim()).filter(Boolean).length;
    return [
      { text: 'Contact information complete', ok: Boolean(form.name.trim() && form.email.trim() && form.phone.trim()) },
      { text: 'GPA included', ok: Boolean(form.cgpa.trim()) },
      { text: skillCount >= 5 ? `${skillCount} technical skills listed` : 'Skills section is thin — add more technical skills', ok: skillCount >= 5 },
      { text: form.projects.length > 0 ? `${form.projects.length} project(s) with impact details` : 'No projects yet — add at least one project', ok: form.projects.length > 0 },
      { text: form.experience.length > 0 ? 'Experience entries present' : 'Missing experience entries', ok: form.experience.length > 0 },
      { text: Boolean(form.college.trim() && form.degree.trim()) ? 'Education details complete' : 'Education details incomplete', ok: Boolean(form.college.trim() && form.degree.trim()) },
    ];
  }, [form]);

  const downloadPDF = () => {
    const win = window.open('', '_blank', 'width=800,height=900');
    if (!win) return;
    const esc = (s: string) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const skillItems = form.skills.split(',').map(s => s.trim()).filter(Boolean).map(esc).join(', ');
    win.document.write(`<!DOCTYPE html><html><head><title>Resume - ${esc(form.name) || 'Untitled'}</title>
<style>body{font-family:Arial,sans-serif;max-width:720px;margin:40px auto;color:#111}h1{margin:0;font-size:28px}h2{font-size:15px;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #0d9488;padding-bottom:4px;margin-top:24px}.meta{color:#555;font-size:13px;margin:4px 0 0}p,li{font-size:13.5px;line-height:1.5}.item{margin-bottom:10px}.tech{color:#0d9488;font-size:12.5px}</style>
</head><body>
<h1>${esc(form.name) || 'Your Name'}</h1>
<p class="meta">${esc(form.email)}${form.phone ? ' · ' + esc(form.phone) : ''}${form.linkedin ? ' · ' + esc(form.linkedin) : ''}${form.github ? ' · ' + esc(form.github) : ''}</p>
<h2>Education</h2><p>${esc(form.degree)}${form.college ? ', ' + esc(form.college) : ''}${form.cgpa ? ' · CGPA ' + esc(form.cgpa) : ''}${form.gradYear ? ' · ' + esc(form.gradYear) : ''}</p>
<h2>Skills</h2><p>${skillItems || '—'}</p>
<h2>Projects</h2>${form.projects.length ? form.projects.map(p => `<div class="item"><strong>${esc(p.title)}</strong> <span class="tech">${esc(p.tech)}</span><p>${esc(p.desc)}</p></div>`).join('') : '<p>—</p>'}
<h2>Experience</h2>${form.experience.length ? form.experience.map(e => `<div class="item"><strong>${esc(e.title)}</strong><p>${esc(e.detail)}</p></div>`).join('') : '<p>—</p>'}
<h2>Certifications</h2>${form.certifications.length ? '<ul>' + form.certifications.map(c => `<li><strong>${esc(c.name)}</strong> — ${esc(c.issuer)}${c.date ? ' · ' + esc(c.date) : ''}</li>`).join('') + '</ul>' : '<p>—</p>'}
<script>window.onload=()=>window.print()</script></body></html>`);
    win.document.close();
  };

  return (
    <div className="min-h-full bg-[#080810] flex">
      {/* Left panel */}
      <div className="w-48 border-r border-[#1e1e30] p-4 sticky top-0 h-screen">
        <div className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-3">Sections</div>
        <div className="space-y-1">
          {sections.map(s => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`sidebar-item w-full flex items-center px-3 py-2 rounded-lg text-xs text-left ${activeSection === s.key ? 'active' : 'text-[#64748b]'}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[#1e1e30]">
          <div className="text-xs font-semibold text-[#94a3b8] mb-2">ATS Score</div>
          <div className="relative w-16 h-16 mx-auto mb-2">
            <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e1e30" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#14b8a6" strokeWidth="3"
                strokeDasharray={`${atsScore} ${100 - atsScore}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-teal-400">{atsScore}%</span>
            </div>
          </div>
          <div className="text-[10px] text-[#64748b] text-center">{resumeLoaded ? 'Live score from server' : 'Loading...'}</div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-6 overflow-y-auto hide-scrollbar">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold font-[Plus_Jakarta_Sans] text-white">Resume Builder</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 text-xs border border-[#1e1e30] text-[#94a3b8] hover:text-white px-3 py-2 rounded-lg transition-all"
            >
              <Eye size={13} />{showPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-1.5 text-xs bg-teal-500 hover:bg-teal-400 text-white font-semibold px-3 py-2 rounded-lg transition-all"
            >
              <Download size={13} />Download PDF
            </button>
          </div>
        </div>

        {showPreview ? (
          <div className="max-w-2xl mx-auto bg-white text-gray-900 rounded-xl p-8">
            <h2 className="text-2xl font-bold">{form.name || 'Your Name'}</h2>
            <p className="text-xs text-gray-600 mt-1">
              {[form.email, form.phone, form.linkedin, form.github].filter(Boolean).join(' · ')}
            </p>
            <h3 className="text-xs font-bold uppercase tracking-widest text-teal-700 border-b-2 border-teal-600 pb-1 mt-5 mb-2">Education</h3>
            <p className="text-sm">{[form.degree, form.college].filter(Boolean).join(', ')}{form.cgpa ? ` · CGPA ${form.cgpa}` : ''}{form.gradYear ? ` · ${form.gradYear}` : ''}</p>
            <h3 className="text-xs font-bold uppercase tracking-widest text-teal-700 border-b-2 border-teal-600 pb-1 mt-5 mb-2">Skills</h3>
            <p className="text-sm">{form.skills || '—'}</p>
            <h3 className="text-xs font-bold uppercase tracking-widest text-teal-700 border-b-2 border-teal-600 pb-1 mt-5 mb-2">Projects</h3>
            {form.projects.length === 0 && <p className="text-sm text-gray-500">—</p>}
            {form.projects.map((p, i) => (
              <div key={i} className="mb-2">
                <div className="text-sm font-bold">{p.title}</div>
                <div className="text-xs text-teal-700">{p.tech}</div>
                <div className="text-sm text-gray-700">{p.desc}</div>
              </div>
            ))}
            <h3 className="text-xs font-bold uppercase tracking-widest text-teal-700 border-b-2 border-teal-600 pb-1 mt-5 mb-2">Experience</h3>
            {form.experience.length === 0 && <p className="text-sm text-gray-500">—</p>}
            {form.experience.map((e, i) => (
              <div key={i} className="mb-2">
                <div className="text-sm font-bold">{e.title}</div>
                <div className="text-sm text-gray-700">{e.detail}</div>
              </div>
            ))}
            <h3 className="text-xs font-bold uppercase tracking-widest text-teal-700 border-b-2 border-teal-600 pb-1 mt-5 mb-2">Certifications</h3>
            {form.certifications.length === 0 && <p className="text-sm text-gray-500">—</p>}
            {form.certifications.map((c, i) => (
              <div key={i} className="text-sm"><strong>{c.name}</strong> — {c.issuer}{c.date ? ` · ${c.date}` : ''}</div>
            ))}
          </div>
        ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            {activeSection === 'personal' && (
              <div className="card-dark rounded-xl p-5">
                <h2 className="text-sm font-bold text-white mb-4">Personal Information</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Full Name', name: 'name' },
                    { label: 'Email', name: 'email' },
                    { label: 'Phone', name: 'phone' },
                    { label: 'LinkedIn', name: 'linkedin' },
                    { label: 'GitHub', name: 'github' },
                  ].map(f => (
                    <div key={f.name} className={f.name === 'name' ? 'col-span-2' : ''}>
                      <label className="block text-xs text-[#94a3b8] mb-1">{f.label}</label>
                      <input name={f.name} value={form[f.name as keyof typeof form] as string} onChange={handle}
                        className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'education' && (
              <div className="card-dark rounded-xl p-5">
                <h2 className="text-sm font-bold text-white mb-4">Education</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'College / University', name: 'college' },
                    { label: 'Degree', name: 'degree' },
                    { label: 'CGPA / Percentage', name: 'cgpa' },
                    { label: 'Graduation Year', name: 'gradYear' },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="block text-xs text-[#94a3b8] mb-1">{f.label}</label>
                      <input name={f.name} value={form[f.name as keyof typeof form] as string} onChange={handle}
                        className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'skills' && (
              <div className="card-dark rounded-xl p-5">
                <h2 className="text-sm font-bold text-white mb-4">Technical Skills</h2>
                <label className="block text-xs text-[#94a3b8] mb-1.5">Skills (comma-separated)</label>
                <textarea name="skills" value={form.skills} onChange={handle} rows={4}
                  className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all resize-none mb-3" />
                <div className="flex flex-wrap gap-1.5">
                  {form.skills.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                    <span key={s} className="text-[11px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'projects' && (
              <div className="card-dark rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-white">Projects</h2>
                  <button onClick={() => addListItem('projects')} className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300">
                    <Plus size={12} />Add Project
                  </button>
                </div>
                <div className="space-y-3">
                  {form.projects.map((p, i) => (
                    <div key={i} className="bg-[#0f0f1a] rounded-lg p-4 border border-[#1e1e30]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] text-[#64748b]">Project {i + 1}</span>
                        <button onClick={() => removeListItem('projects', i)} className="text-[#475569] hover:text-red-400" title="Remove project">
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <input value={p.title} onChange={(e) => updateListItem('projects', i, { title: e.target.value })} placeholder="Project title"
                        className="w-full bg-[#080810] border border-[#1e1e30] rounded-lg px-3 py-2 text-sm text-white mb-2 focus:outline-none focus:border-teal-500/50" />
                      <input value={p.tech} onChange={(e) => updateListItem('projects', i, { tech: e.target.value })} placeholder="Tech stack (e.g. React, Node.js)"
                        className="w-full bg-[#080810] border border-[#1e1e30] rounded-lg px-3 py-2 text-xs text-teal-400 mb-2 focus:outline-none focus:border-teal-500/50" />
                      <textarea value={p.desc} onChange={(e) => updateListItem('projects', i, { desc: e.target.value })} placeholder="What did you build? Add numbers and impact."
                        rows={2} className="w-full bg-[#080810] border border-[#1e1e30] rounded-lg px-3 py-2 text-xs text-[#94a3b8] resize-none focus:outline-none focus:border-teal-500/50" />
                    </div>
                  ))}
                  {form.projects.length === 0 && (
                    <div className="py-6 text-center text-xs text-[#475569]">No projects yet. Click “Add Project” to add your first one.</div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'experience' && (
              <div className="card-dark rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-white">Experience</h2>
                  <button onClick={() => addListItem('experience')} className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300">
                    <Plus size={12} />Add
                  </button>
                </div>
                <div className="space-y-3">
                  {form.experience.map((e, i) => (
                    <div key={i} className="bg-[#0f0f1a] rounded-lg p-4 border border-[#1e1e30]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] text-[#64748b]">Role {i + 1}</span>
                        <button onClick={() => removeListItem('experience', i)} className="text-[#475569] hover:text-red-400" title="Remove entry">
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <input value={e.title} onChange={(ev) => updateListItem('experience', i, { title: ev.target.value })} placeholder="Role · Company · Duration"
                        className="w-full bg-[#080810] border border-[#1e1e30] rounded-lg px-3 py-2 text-sm text-white mb-2 focus:outline-none focus:border-teal-500/50" />
                      <textarea value={e.detail} onChange={(ev) => updateListItem('experience', i, { detail: ev.target.value })} placeholder="What did you do and achieve?"
                        rows={2} className="w-full bg-[#080810] border border-[#1e1e30] rounded-lg px-3 py-2 text-xs text-[#94a3b8] resize-none focus:outline-none focus:border-teal-500/50" />
                    </div>
                  ))}
                  {form.experience.length === 0 && (
                    <div className="py-6 text-center text-xs text-[#475569]">Add your internships and work experience here.</div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'certifications' && (
              <div className="card-dark rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-white">Certifications</h2>
                  <button onClick={() => addListItem('certifications')} className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300">
                    <Plus size={12} />Add
                  </button>
                </div>
                <div className="space-y-3">
                  {form.certifications.map((c, i) => (
                    <div key={i} className="bg-[#0f0f1a] rounded-lg p-4 border border-[#1e1e30]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] text-[#64748b]">Certification {i + 1}</span>
                        <button onClick={() => removeListItem('certifications', i)} className="text-[#475569] hover:text-red-400" title="Remove certification">
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <input value={c.name} onChange={(e) => updateListItem('certifications', i, { name: e.target.value })} placeholder="Certification name"
                        className="w-full bg-[#080810] border border-[#1e1e30] rounded-lg px-3 py-2 text-sm text-white mb-2 focus:outline-none focus:border-teal-500/50" />
                      <div className="grid grid-cols-2 gap-2">
                        <input value={c.issuer} onChange={(e) => updateListItem('certifications', i, { issuer: e.target.value })} placeholder="Issuer"
                          className="bg-[#080810] border border-[#1e1e30] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500/50" />
                        <input value={c.date} onChange={(e) => updateListItem('certifications', i, { date: e.target.value })} placeholder="Date (e.g. Sep 2024)"
                          className="bg-[#080810] border border-[#1e1e30] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500/50" />
                      </div>
                    </div>
                  ))}
                  {form.certifications.length === 0 && (
                    <div className="py-6 text-center text-xs text-[#475569]">No certifications yet. Click “Add” to add one.</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ATS Feedback — computed from the actual resume content */}
          <div className="card-dark rounded-xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">ATS Analysis</h2>
            <div className="space-y-2.5">
              {atsFeedback.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  {item.ok
                    ? <CheckCircle size={13} className="text-teal-500 flex-shrink-0 mt-0.5" />
                    : <AlertCircle size={13} className="text-orange-400 flex-shrink-0 mt-0.5" />
                  }
                  <span className={`text-xs ${item.ok ? 'text-[#64748b]' : 'text-orange-400'}`}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

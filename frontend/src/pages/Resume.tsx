import { useState } from 'react';
import { Plus, Download, Eye, CheckCircle, AlertCircle } from 'lucide-react';

type Section = 'personal' | 'education' | 'skills' | 'projects' | 'experience' | 'certifications';

const sections: { key: Section; label: string }[] = [
  { key: 'personal', label: 'Personal Info' },
  { key: 'education', label: 'Education' },
  { key: 'skills', label: 'Skills' },
  { key: 'projects', label: 'Projects' },
  { key: 'experience', label: 'Experience' },
  { key: 'certifications', label: 'Certifications' },
];

const atsScore = 78;
const atsFeedback = [
  { text: 'Strong action verbs detected', ok: true },
  { text: 'Quantifiable achievements present', ok: true },
  { text: 'Missing keywords: System Design, Agile', ok: false },
  { text: 'Contact information complete', ok: true },
  { text: 'GPA included', ok: true },
  { text: 'Skills section is generic — add more technical skills', ok: false },
];

export default function Resume() {
  const [activeSection, setActiveSection] = useState<Section>('personal');
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({
    name: 'Arjun Kumar', email: 'arjun.kumar@gmail.com', phone: '+91 98765 43210',
    linkedin: 'linkedin.com/in/arjunkumar', github: 'github.com/arjunkumar',
    college: 'IIT Delhi', degree: 'B.Tech Computer Science', cgpa: '8.7', gradYear: '2025',
    skills: 'Python, Java, C++, JavaScript, React, Node.js, MySQL, MongoDB, AWS, Git',
  });

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

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
          <div className="text-[10px] text-[#64748b] text-center">ATS Friendly</div>
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
              <Eye size={13} />Preview
            </button>
            <button className="flex items-center gap-1.5 text-xs bg-teal-500 hover:bg-teal-400 text-white font-semibold px-3 py-2 rounded-lg transition-all">
              <Download size={13} />Download PDF
            </button>
          </div>
        </div>

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
                      <input name={f.name} value={form[f.name as keyof typeof form]} onChange={handle}
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
                      <input name={f.name} value={form[f.name as keyof typeof form]} onChange={handle}
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
                  <button className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300">
                    <Plus size={12} />Add Project
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    { title: 'E-Commerce Platform', tech: 'React, Node.js, MongoDB', desc: 'Built a full-stack e-commerce app with 10,000+ product listings and payment integration. Reduced load time by 40%.' },
                    { title: 'Real-Time Chat App', tech: 'Socket.io, Express, Redis', desc: 'Developed a real-time messaging application supporting 500+ concurrent users with message persistence.' },
                  ].map((p, i) => (
                    <div key={i} className="bg-[#0f0f1a] rounded-lg p-4 border border-[#1e1e30]">
                      <div className="text-sm font-semibold text-white mb-1">{p.title}</div>
                      <div className="text-[11px] text-teal-400 mb-2">{p.tech}</div>
                      <div className="text-xs text-[#64748b]">{p.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeSection === 'experience' || activeSection === 'certifications') && (
              <div className="card-dark rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-white">{activeSection === 'experience' ? 'Experience' : 'Certifications'}</h2>
                  <button className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300">
                    <Plus size={12} />Add
                  </button>
                </div>
                {activeSection === 'certifications' && (
                  <div className="space-y-3">
                    {[
                      { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: 'Sep 2024' },
                      { name: 'Google Data Analytics', issuer: 'Google', date: 'Jun 2024' },
                    ].map((c, i) => (
                      <div key={i} className="bg-[#0f0f1a] rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-white">{c.name}</div>
                          <div className="text-[11px] text-[#64748b]">{c.issuer} · {c.date}</div>
                        </div>
                        <CheckCircle size={14} className="text-teal-500" />
                      </div>
                    ))}
                  </div>
                )}
                {activeSection === 'experience' && (
                  <div className="py-8 text-center text-sm text-[#475569]">
                    Add your internships and work experience here.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ATS Feedback */}
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
            <div className="mt-4 pt-4 border-t border-[#1e1e30]">
              <div className="text-xs text-[#64748b] mb-1">Suggested keywords to add:</div>
              {['System Design', 'Agile', 'REST API', 'CI/CD', 'Docker'].map(kw => (
                <span key={kw} className="inline-block text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 mr-1 mb-1">{kw}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

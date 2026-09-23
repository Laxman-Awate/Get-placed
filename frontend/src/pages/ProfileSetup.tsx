import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown } from 'lucide-react';
import Logo from '../components/Logo';

const skills = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'Machine Learning', 'Data Structures', 'Algorithms', 'System Design', 'AWS'];
const branches = ['Computer Science', 'Information Technology', 'Electronics', 'Electrical', 'Mechanical', 'Civil', 'Other'];
const roles = ['Software Engineer', 'Data Scientist', 'Full Stack Developer', 'Backend Engineer', 'Frontend Engineer', 'ML Engineer', 'DevOps', 'Product Manager'];

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [form, setForm] = useState({ college: '', branch: '', year: '', gradYear: '', cgpa: '', role: '', goal: '' });

  const toggleSkill = (s: string) =>
    setSelectedSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Logo size="md" to="/" />
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {['Account', 'Profile', 'Companies', 'Dashboard'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold ${i <= 1 ? 'bg-teal-500 text-white' : 'bg-[#1e1e30] text-[#475569]'}`}>
                {i + 1}
              </div>
              <span className={`text-xs ${i === 1 ? 'text-white' : 'text-[#475569]'}`}>{step}</span>
              {i < 3 && <div className={`w-8 h-px ${i < 1 ? 'bg-teal-500' : 'bg-[#1e1e30]'}`} />}
            </div>
          ))}
        </div>

        <div className="card-dark rounded-2xl p-8">
          <h1 className="text-xl font-bold font-[Plus_Jakarta_Sans] text-white mb-1">Set up your profile</h1>
          <p className="text-sm text-[#64748b] mb-6">Help us personalize your placement preparation journey.</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">College / University</label>
              <input name="college" placeholder="IIT Delhi, NIT Trichy, BITS Pilani..." value={form.college} onChange={handle}
                className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-teal-500/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Branch</label>
              <div className="relative">
                <select name="branch" value={form.branch} onChange={handle}
                  className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all appearance-none">
                  <option value="">Select branch</option>
                  {branches.map(b => <option key={b}>{b}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Current Year</label>
              <div className="relative">
                <select name="year" value={form.year} onChange={handle}
                  className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all appearance-none">
                  <option value="">Select year</option>
                  {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year'].map(y => <option key={y}>{y}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Graduation Year</label>
              <input name="gradYear" placeholder="2025" value={form.gradYear} onChange={handle}
                className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-teal-500/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">CGPA</label>
              <input name="cgpa" placeholder="8.5" value={form.cgpa} onChange={handle}
                className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-teal-500/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Preferred Job Role</label>
              <div className="relative">
                <select name="role" value={form.role} onChange={handle}
                  className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50 transition-all appearance-none">
                  <option value="">Select role</option>
                  {roles.map(r => <option key={r}>{r}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#94a3b8] mb-2">Skills <span className="text-[#475569]">(select all that apply)</span></label>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <button
                  key={s}
                  onClick={() => toggleSkill(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                    selectedSkills.includes(s)
                      ? 'bg-teal-500/15 border-teal-500/40 text-teal-400'
                      : 'border-[#1e1e30] text-[#64748b] hover:border-[#2e2e45] hover:text-[#94a3b8]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Career Goal */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">Career Goal</label>
            <textarea name="goal" placeholder="e.g., Land a SDE-2 role at a product company with 20+ LPA package..." value={form.goal}
              onChange={e => setForm(prev => ({ ...prev, goal: e.target.value }))}
              rows={3}
              className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-teal-500/50 transition-all resize-none" />
          </div>

          <button
            onClick={() => navigate('/target-companies')}
            className="w-full bg-teal-500 hover:bg-teal-400 text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-teal-500/20"
          >
            Continue to Target Companies →
          </button>
        </div>
      </div>
    </div>
  );
}

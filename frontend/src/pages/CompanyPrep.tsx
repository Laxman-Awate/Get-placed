import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, ChevronRight, CheckCircle, Map } from 'lucide-react';

const companies = [
  { name: 'TCS', logo: '🏢', type: 'Service', progress: 65, package: '3.5-7 LPA', color: 'from-blue-700 to-indigo-600',
    rounds: ['Online Aptitude', 'Technical Interview', 'HR Interview'],
    topics: ['Aptitude', 'Coding Basics', 'Core CS', 'HR'],
    eligibility: 'CGPA ≥ 6.0, No active backlogs' },
  { name: 'Google', logo: '🔍', type: 'Product', progress: 34, package: '25-50 LPA', color: 'from-blue-500 to-green-500',
    rounds: ['Online Assessment', 'Phone Screen', 'System Design', 'Onsite (4-5 rounds)'],
    topics: ['DSA', 'System Design', 'Behavioral', 'LLD'],
    eligibility: 'No CGPA cutoff, Strong DSA required' },
  { name: 'Amazon', logo: '📦', type: 'Product', progress: 78, package: '18-40 LPA', color: 'from-orange-500 to-amber-500',
    rounds: ['Online Test', 'Technical Interview (3)', 'Bar Raiser', 'Hiring Manager'],
    topics: ['DSA', 'Leadership Principles', 'System Design', 'Behavioral'],
    eligibility: 'No strict CGPA, Top universities preferred' },
  { name: 'Microsoft', logo: '🪟', type: 'Product', progress: 53, package: '20-45 LPA', color: 'from-blue-600 to-cyan-500',
    rounds: ['Online Assessment', 'Technical (3-4 rounds)'],
    topics: ['DSA', 'OOP', 'System Design', 'Behavioral'],
    eligibility: 'CGPA ≥ 7.0 preferred' },
];

const allCompanies = [...companies,
  { name: 'Infosys', logo: '💼', type: 'Service', progress: 42, package: '3.6-6.5 LPA', color: 'from-indigo-700 to-blue-600', rounds: [], topics: [], eligibility: 'CGPA ≥ 6.0' },
  { name: 'Wipro', logo: '🌐', type: 'Service', progress: 71, package: '3.5-6 LPA', color: 'from-purple-700 to-violet-600', rounds: [], topics: [], eligibility: 'CGPA ≥ 6.0' },
  { name: 'Accenture', logo: '⚡', type: 'Service', progress: 58, package: '4-8 LPA', color: 'from-violet-600 to-purple-500', rounds: [], topics: [], eligibility: 'CGPA ≥ 5.5' },
  { name: 'Adobe', logo: '🎨', type: 'Product', progress: 28, package: '15-35 LPA', color: 'from-red-600 to-rose-500', rounds: [], topics: [], eligibility: 'CGPA ≥ 7.5' },
  { name: 'Cognizant', logo: '🧠', type: 'Service', progress: 45, package: '4-7 LPA', color: 'from-blue-500 to-sky-400', rounds: [], topics: [], eligibility: 'CGPA ≥ 6.0' },
  { name: 'Deloitte', logo: '🔷', type: 'Consulting', progress: 44, package: '6-15 LPA', color: 'from-green-700 to-teal-600', rounds: [], topics: [], eligibility: 'CGPA ≥ 7.0' },
];

export default function CompanyPrep() {
  const navigate = useNavigate();
  const [active, setActive] = useState(companies[0]);

  return (
    <div className="min-h-full bg-[#080810] p-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold font-[Plus_Jakarta_Sans] text-white mb-1">Company Preparation</h1>
        <p className="text-sm text-[#64748b]">Detailed prep roadmap, process & resources for top companies.</p>
      </div>

      {/* Featured */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-[#94a3b8] mb-3">Featured Companies</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {companies.map(c => (
            <button
              key={c.name}
              onClick={() => setActive(c)}
              className={`flex-shrink-0 w-52 card-dark card-lift rounded-xl p-4 text-left transition-all border ${active.name === c.name ? 'border-teal-500/40 bg-teal-500/5' : 'border-[#1e1e30] hover:border-[#2e2e45]'}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-lg`}>{c.logo}</div>
                <div>
                  <div className="text-sm font-bold text-white">{c.name}</div>
                  <div className="text-[10px] text-[#64748b]">{c.type}</div>
                </div>
              </div>
              <div className="h-1.5 bg-[#1e1e30] rounded-full mb-1.5">
                <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full" style={{ width: `${c.progress}%` }} />
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[#64748b]">{c.progress}% ready</span>
                <span className="text-teal-400 font-medium">{c.package}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Company Detail */}
      {active.rounds.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-2 space-y-4">
            {/* Hiring Process */}
            <div className="card-dark rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">{active.name} — Hiring Process</h3>
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                {active.rounds.map((round, i) => (
                  <div key={round} className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">{i + 1}</div>
                      <div className="text-[10px] text-[#94a3b8] mt-1 text-center w-20 leading-tight">{round}</div>
                    </div>
                    {i < active.rounds.length - 1 && <ChevronRight size={14} className="text-[#2e2e45] flex-shrink-0 mt-0" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Prep Areas */}
            <div className="card-dark rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-3">Preparation Areas</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Aptitude', 'Coding', 'Core CS', 'Technical Interview', 'HR Interview'].map((area, i) => {
                  const pcts = [85, 70, 60, 45, 90];
                  const colors = ['bg-teal-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-green-500'];
                  return (
                    <div key={area} className="bg-[#0f0f1a] rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-[#94a3b8]">{area}</span>
                        <span className="text-xs font-semibold text-white">{pcts[i]}%</span>
                      </div>
                      <div className="h-1 bg-[#1e1e30] rounded-full">
                        <div className={`h-full ${colors[i]} rounded-full`} style={{ width: `${pcts[i]}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Previous Questions */}
            <div className="card-dark rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-3">Previous Year Questions</h3>
              <div className="space-y-2">
                {[
                  'Find the odd one out: 2, 5, 10, 17, 26, 37, 50, 64',
                  'A train of length 150m crosses a platform of 250m in 30 sec. Find the speed.',
                  'What does the acronym "API" stand for in software development?',
                  'Explain the difference between stack and heap memory.',
                ].map((q, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[#64748b] hover:text-[#94a3b8] cursor-pointer transition-colors py-1.5 border-b border-[#1e1e30] last:border-0">
                    <span className="text-teal-500 flex-shrink-0 mt-0.5">Q{i + 1}</span>
                    {q}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar info */}
          <div className="space-y-4">
            <div className="card-dark rounded-xl p-5">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${active.color} flex items-center justify-center text-2xl mb-3`}>{active.logo}</div>
              <div className="text-sm font-bold text-white mb-0.5">{active.name}</div>
              <div className="text-xs text-[#64748b] mb-3">{active.type} · {active.package}</div>
              <div className="text-[10px] text-[#475569] mb-3">{active.eligibility}</div>
              <button
                onClick={() => navigate('/dashboard/mock-test')}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-white py-2 rounded-lg transition-all"
              >
                {active.name} Mock Test <ArrowRight size={11} />
              </button>
            </div>

            <div className="card-dark rounded-xl p-5">
              <h3 className="text-xs font-bold text-white mb-3 flex items-center gap-2"><Map size={12} className="text-teal-400" /> Preparation Roadmap</h3>
              <div className="space-y-2">
                {['Aptitude Basics', 'Coding Fundamentals', 'Core Subjects', 'Mock Tests', 'Interview Prep'].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${i < 3 ? 'border-teal-500 bg-teal-500/20' : 'border-[#2e2e45]'}`}>
                      {i < 3 ? <CheckCircle size={9} className="text-teal-400" /> : <span className="text-[9px] text-[#475569]">{i + 1}</span>}
                    </div>
                    <span className={`text-xs ${i < 3 ? 'text-teal-400' : 'text-[#64748b]'}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Companies Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">All Companies</h2>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {allCompanies.map(c => (
            <button
              key={c.name}
              onClick={() => c.rounds.length > 0 && setActive(c as typeof active)}
              className="card-dark card-lift rounded-xl p-4 text-center hover:border-[#2e2e45] transition-all"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-xl mx-auto mb-2`}>{c.logo}</div>
              <div className="text-xs font-semibold text-white">{c.name}</div>
              <div className="text-[10px] text-[#64748b] mt-0.5">{c.progress}% ready</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Zap, Check } from 'lucide-react';

const companies = [
  { name: 'Google', logo: '🔍', type: 'Product', package: '25-50 LPA', color: 'from-blue-500 to-green-500' },
  { name: 'Microsoft', logo: '🪟', type: 'Product', package: '20-45 LPA', color: 'from-blue-600 to-cyan-500' },
  { name: 'Amazon', logo: '📦', type: 'Product', package: '18-40 LPA', color: 'from-orange-500 to-amber-500' },
  { name: 'Adobe', logo: '🎨', type: 'Product', package: '15-35 LPA', color: 'from-red-600 to-rose-500' },
  { name: 'TCS', logo: '🏢', type: 'Service', package: '3.5-7 LPA', color: 'from-blue-700 to-indigo-600' },
  { name: 'Infosys', logo: '💼', type: 'Service', package: '3.6-6.5 LPA', color: 'from-indigo-700 to-blue-600' },
  { name: 'Wipro', logo: '🌐', type: 'Service', package: '3.5-6 LPA', color: 'from-purple-700 to-violet-600' },
  { name: 'Accenture', logo: '⚡', type: 'Service', package: '4-8 LPA', color: 'from-violet-600 to-purple-500' },
  { name: 'Cognizant', logo: '🧠', type: 'Service', package: '4-7 LPA', color: 'from-blue-500 to-sky-400' },
  { name: 'Deloitte', logo: '🔷', type: 'Consulting', package: '6-15 LPA', color: 'from-green-700 to-teal-600' },
];

export default function TargetCompanies() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (name: string) =>
    setSelected(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-bold text-white font-[Plus_Jakarta_Sans]">LevelUp</span>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {['Account', 'Profile', 'Companies', 'Dashboard'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold ${i <= 2 ? 'bg-teal-500 text-white' : 'bg-[#1e1e30] text-[#475569]'}`}>
                {i < 2 ? <Check size={12} /> : i + 1}
              </div>
              <span className={`text-xs ${i === 2 ? 'text-white' : i < 2 ? 'text-teal-400' : 'text-[#475569]'}`}>{step}</span>
              {i < 3 && <div className={`w-8 h-px ${i < 2 ? 'bg-teal-500' : 'bg-[#1e1e30]'}`} />}
            </div>
          ))}
        </div>

        <div className="card-dark rounded-2xl p-8">
          <h1 className="text-xl font-bold font-[Plus_Jakarta_Sans] text-white mb-1">Select Target Companies</h1>
          <p className="text-sm text-[#64748b] mb-6">
            We'll tailor your preparation roadmap based on your target companies.
            {selected.length > 0 && <span className="text-teal-400 ml-1">{selected.length} selected</span>}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {companies.map(c => {
              const isSelected = selected.includes(c.name);
              return (
                <button
                  key={c.name}
                  onClick={() => toggle(c.name)}
                  className={`relative flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                    isSelected ? 'border-teal-500/40 bg-teal-500/8' : 'border-[#1e1e30] hover:border-[#2e2e45] bg-[#0f0f1a]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-lg`}>
                    {c.logo}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{c.name}</div>
                    <div className="text-[10px] text-[#64748b]">{c.type} · {c.package}</div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                      <Check size={10} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            disabled={selected.length === 0}
            className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-teal-500/20"
          >
            {selected.length === 0 ? 'Select at least 1 company' : `Continue with ${selected.length} compan${selected.length === 1 ? 'y' : 'ies'} →`}
          </button>
        </div>
      </div>
    </div>
  );
}

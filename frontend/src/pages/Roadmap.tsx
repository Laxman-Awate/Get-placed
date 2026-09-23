import { useNavigate } from 'react-router';
import { CheckCircle, Lock, ArrowRight, Zap } from 'lucide-react';

const levels = [
  {
    id: 1, label: 'Level 1', title: 'Foundation', status: 'done',
    topics: ['Aptitude Basics', 'Math Fundamentals', 'Verbal Basics', 'Arrays & Strings', 'Basic Sorting'],
    desc: 'Build a strong foundation across aptitude and basic DSA concepts.',
  },
  {
    id: 2, label: 'Level 2', title: 'Intermediate', status: 'done',
    topics: ['Logical Reasoning', 'Linked Lists', 'Stacks & Queues', 'Core CS Basics', 'Trees'],
    desc: 'Strengthen core data structures and logical problem solving.',
  },
  {
    id: 3, label: 'Level 3', title: 'Advanced', status: 'active',
    topics: ['Graphs & BFS/DFS', 'Dynamic Programming', 'DBMS Deep Dive', 'OS Concepts', 'LLD Basics'],
    desc: 'Tackle advanced DSA and deepen your knowledge of core subjects.',
  },
  {
    id: 4, label: 'Level 4', title: 'Expert', status: 'locked',
    topics: ['System Design', 'High Level Design', 'Competitive Programming', 'Advanced Algorithms'],
    desc: 'Master system design and advanced problem-solving techniques.',
  },
  {
    id: 5, label: 'Advanced', title: 'Mock & Practice', status: 'locked',
    topics: ['Company Mock Tests', 'Interview Prep', 'Resume Polish', 'Soft Skills'],
    desc: 'Simulate real interviews with company-specific mocks and interview practice.',
  },
  {
    id: 6, label: 'Interview Ready', title: '🎯 Placement Ready!', status: 'locked',
    topics: ['Final Mock', 'Resume Review', 'Company Applications', 'Offer Negotiation'],
    desc: 'You are fully prepared. Apply to your target companies with confidence!',
  },
];

const statusColor: Record<string, string> = {
  done: 'border-teal-500 bg-teal-500/20 text-teal-400',
  active: 'border-blue-500 bg-blue-500/20 text-blue-400',
  locked: 'border-[#2e2e45] bg-[#0f0f1a] text-[#475569]',
};

export default function Roadmap() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-[#080810] p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold font-[Plus_Jakarta_Sans] text-white mb-1">Your Placement Roadmap</h1>
        <p className="text-sm text-[#64748b]">6-level structured journey from beginner to interview ready.</p>
      </div>

      {/* Progress */}
      <div className="card-dark rounded-xl p-5 mb-6 flex items-center gap-6">
        <div className="flex-1 h-2 bg-[#1e1e30] rounded-full overflow-hidden">
          <div className="h-full w-[40%] bg-gradient-to-r from-teal-500 to-blue-500 rounded-full" />
        </div>
        <div className="text-sm text-[#94a3b8] flex-shrink-0">Level 3 of 6 · 40% complete</div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-400">
          <Zap size={12} />Keep going!
        </div>
      </div>

      {/* Levels */}
      <div className="relative">
        {/* Connector line */}
        <div className="absolute left-[27px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-teal-500 via-blue-500 to-[#1e1e30]" />

        <div className="space-y-4">
          {levels.map((level, i) => (
            <div key={level.id} className="flex gap-5 items-start relative">
              {/* Indicator */}
              <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 ${statusColor[level.status]}`}>
                {level.status === 'done' ? (
                  <CheckCircle size={20} />
                ) : level.status === 'active' ? (
                  <div className="w-3 h-3 rounded-full bg-blue-400 pulse-dot" />
                ) : (
                  <Lock size={16} />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 card-dark rounded-xl p-5 transition-all ${level.status === 'locked' ? 'opacity-50' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-[10px] font-semibold text-[#64748b] uppercase tracking-widest mb-0.5">{level.label}</div>
                    <h3 className="text-sm font-bold text-white">{level.title}</h3>
                  </div>
                  {level.status === 'active' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 font-semibold">In Progress</span>
                  )}
                  {level.status === 'done' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-400 border border-teal-500/30 font-semibold">Completed ✓</span>
                  )}
                </div>
                <p className="text-xs text-[#64748b] mb-3">{level.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {level.topics.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-[#0f0f1a] border border-[#1e1e30] text-[#64748b]">{t}</span>
                  ))}
                </div>
                {level.status !== 'locked' && (
                  <button
                    onClick={() => navigate('/dashboard/learn')}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition-all ${level.status === 'done' ? 'text-teal-400 hover:text-teal-300' : 'bg-blue-500 hover:bg-blue-400 text-white px-3 py-1.5 rounded-lg'}`}
                  >
                    {level.status === 'done' ? 'Review' : 'Continue'} <ArrowRight size={11} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

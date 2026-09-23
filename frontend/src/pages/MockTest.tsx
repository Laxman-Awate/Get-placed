import { useNavigate } from 'react-router';
import { Clock, BarChart3, Building2, Brain, Code2, BookOpen, ArrowRight, Star } from 'lucide-react';

const testTypes = [
  {
    title: 'Company Mock Test',
    icon: Building2,
    color: 'from-blue-600 to-indigo-600',
    accent: 'border-blue-500/30 bg-blue-500/8',
    tests: [
      { name: 'TCS NQT Full Mock', duration: '120 min', questions: 76, difficulty: 'Medium' },
      { name: 'Infosys Specialist', duration: '95 min', questions: 65, difficulty: 'Medium' },
      { name: 'Amazon SDE-1 Mock', duration: '90 min', questions: 45, difficulty: 'Hard' },
      { name: 'Google Kick Start Style', duration: '150 min', questions: 20, difficulty: 'Hard' },
    ],
  },
  {
    title: 'Aptitude Test',
    icon: Brain,
    color: 'from-teal-600 to-cyan-600',
    accent: 'border-teal-500/30 bg-teal-500/8',
    tests: [
      { name: 'Quantitative Aptitude', duration: '60 min', questions: 40, difficulty: 'Medium' },
      { name: 'Logical Reasoning', duration: '45 min', questions: 30, difficulty: 'Easy' },
      { name: 'Verbal Ability', duration: '40 min', questions: 35, difficulty: 'Easy' },
      { name: 'Full Aptitude Mock', duration: '90 min', questions: 80, difficulty: 'Mixed' },
    ],
  },
  {
    title: 'Coding Test',
    icon: Code2,
    color: 'from-purple-600 to-violet-600',
    accent: 'border-purple-500/30 bg-purple-500/8',
    tests: [
      { name: 'DSA Fundamentals', duration: '60 min', questions: 5, difficulty: 'Easy' },
      { name: 'Data Structures', duration: '90 min', questions: 4, difficulty: 'Medium' },
      { name: 'Algorithms', duration: '120 min', questions: 3, difficulty: 'Hard' },
      { name: 'Full Coding Mock', duration: '180 min', questions: 6, difficulty: 'Mixed' },
    ],
  },
  {
    title: 'Core CS Test',
    icon: BookOpen,
    color: 'from-orange-600 to-amber-600',
    accent: 'border-orange-500/30 bg-orange-500/8',
    tests: [
      { name: 'Operating Systems', duration: '45 min', questions: 30, difficulty: 'Medium' },
      { name: 'DBMS Essentials', duration: '45 min', questions: 30, difficulty: 'Medium' },
      { name: 'Computer Networks', duration: '45 min', questions: 30, difficulty: 'Medium' },
      { name: 'Core CS Full Mock', duration: '120 min', questions: 90, difficulty: 'Mixed' },
    ],
  },
];

const diffColor: Record<string, string> = {
  Easy: 'text-green-400 bg-green-500/10',
  Medium: 'text-yellow-400 bg-yellow-500/10',
  Hard: 'text-red-400 bg-red-500/10',
  Mixed: 'text-teal-400 bg-teal-500/10',
};

export default function MockTest() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-[#080810] p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold font-[Plus_Jakarta_Sans] text-white mb-1">Mock Tests</h1>
        <p className="text-sm text-[#64748b]">Company-wise and subject-wise full-length mock tests with detailed analysis.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Tests Attempted', val: '12', icon: BarChart3, color: 'text-teal-400' },
          { label: 'Best Score', val: '94%', icon: Star, color: 'text-yellow-400' },
          { label: 'Avg Score', val: '82%', icon: BarChart3, color: 'text-blue-400' },
          { label: 'Time Spent', val: '18h', icon: Clock, color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="card-dark rounded-xl p-4 flex items-center gap-3">
            <s.icon size={18} className={s.color} />
            <div>
              <div className="text-lg font-bold text-white font-[Plus_Jakarta_Sans]">{s.val}</div>
              <div className="text-xs text-[#64748b]">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {testTypes.map(type => {
          const Icon = type.icon;
          return (
            <div key={type.title}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                  <Icon size={15} className="text-white" />
                </div>
                <h2 className="text-base font-bold font-[Plus_Jakarta_Sans] text-white">{type.title}</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {type.tests.map(test => (
                  <div key={test.name} className={`card-dark card-lift rounded-xl p-4 border ${type.accent}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-sm font-semibold text-white leading-tight">{test.name}</div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ml-2 flex-shrink-0 ${diffColor[test.difficulty]}`}>{test.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#64748b] mb-4">
                      <div className="flex items-center gap-1"><Clock size={10} />{test.duration}</div>
                      <div>{test.questions} Q</div>
                    </div>
                    <button
                      onClick={() => navigate('/dashboard/test-ui')}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold bg-[#0f0f1a] hover:bg-[#17172a] text-[#94a3b8] hover:text-white border border-[#1e1e30] hover:border-[#2e2e45] py-2 rounded-lg transition-all"
                    >
                      Start Test <ArrowRight size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

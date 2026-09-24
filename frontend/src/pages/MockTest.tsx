import { useNavigate } from 'react-router';
import { Clock, BarChart3, Building2, Brain, Code2, BookOpen, ArrowRight, Star } from 'lucide-react';
import { useMockTests } from '../hooks/useMockTests';

const diffColor: Record<string, string> = {
  Easy: 'text-green-400 bg-green-500/10',
  Medium: 'text-yellow-400 bg-yellow-500/10',
  Hard: 'text-red-400 bg-red-500/10',
  Mixed: 'text-teal-400 bg-teal-500/10',
};

export default function MockTest() {
  const navigate = useNavigate();
  const { tests, summary, loading, error } = useMockTests();
  const grouped = tests.reduce((acc: Record<string, any[]>, test: any) => {
    const key = test.type || test.category || 'Mock Tests';
    acc[key] = acc[key] || [];
    acc[key].push(test);
    return acc;
  }, {});
  const typeMeta: Record<string, any> = {
    Company: { icon: Building2, color: 'from-blue-600 to-indigo-600', accent: 'border-blue-500/30 bg-blue-500/8' },
    Aptitude: { icon: Brain, color: 'from-teal-600 to-cyan-600', accent: 'border-teal-500/30 bg-teal-500/8' },
    Coding: { icon: Code2, color: 'from-purple-600 to-violet-600', accent: 'border-purple-500/30 bg-purple-500/8' },
    Core: { icon: BookOpen, color: 'from-orange-600 to-amber-600', accent: 'border-orange-500/30 bg-orange-500/8' },
  };
  const metaFor = (title: string) =>
    typeMeta[Object.keys(typeMeta).find((key) => title.toLowerCase().includes(key.toLowerCase())) || 'Company'];

  return (
    <div className="min-h-full bg-[#080810] p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold font-[Plus_Jakarta_Sans] text-white mb-1">Mock Tests</h1>
        <p className="text-sm text-[#64748b]">Company-wise and subject-wise full-length mock tests with detailed analysis.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Tests Attempted', val: String(summary.attempted || 0), icon: BarChart3, color: 'text-teal-400' },
          { label: 'Best Score', val: `${summary.bestScore || 0}%`, icon: Star, color: 'text-yellow-400' },
          { label: 'Avg Score', val: `${summary.averageScore || 0}%`, icon: BarChart3, color: 'text-blue-400' },
          { label: 'Questions', val: String(summary.questionsAttempted || 0), icon: Clock, color: 'text-purple-400' },
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
        {Object.entries(grouped).map(([title, group]) => {
          const type = { title, tests: group, ...metaFor(title) };
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
                {type.tests.map((test: any) => (
                  <div key={test.id} className={`card-dark card-lift rounded-xl p-4 border ${type.accent}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-sm font-semibold text-white leading-tight">{test.title}</div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ml-2 flex-shrink-0 ${diffColor[test.difficulty]}`}>{test.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#64748b] mb-4">
                      <div className="flex items-center gap-1"><Clock size={10} />{test.durationMinutes} min</div>
                      <div>{test.totalQuestions} Q</div>
                    </div>
                    <button
                      onClick={() => navigate('/dashboard/test-ui', { state: { testId: test.id } })}
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
        {(loading || error || tests.length === 0) && (
          <div className="card-dark rounded-xl p-8 text-center text-sm text-[#64748b]">
            {loading ? 'Loading mock tests...' : error ? 'Could not load mock tests from the backend.' : 'No mock tests are published yet.'}
          </div>
        )}
      </div>
    </div>
  );
}

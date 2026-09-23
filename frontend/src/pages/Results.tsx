import { useNavigate } from 'react-router';
import { Trophy, Target, Zap, Clock, TrendingUp, ArrowRight, Star, CheckCircle, AlertCircle } from 'lucide-react';

const sectionData = [
  { name: 'Quantitative Aptitude', score: 28, total: 35, time: '32 min', pct: 80 },
  { name: 'Logical Reasoning', score: 22, total: 30, time: '28 min', pct: 73 },
  { name: 'Verbal Ability', score: 18, total: 25, time: '20 min', pct: 72 },
];

const strongTopics = ['Number Series', 'Percentages', 'Seating Arrangement', 'Reading Comprehension'];
const weakTopics = ['Time & Work', 'Probability', 'Blood Relations', 'Critical Reasoning'];

export default function Results() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-[#080810] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="card-dark rounded-2xl p-8 mb-6 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-purple-500/5" />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
              <Trophy size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-extrabold font-[Plus_Jakarta_Sans] text-white mb-1">Test Complete!</h1>
            <p className="text-sm text-[#64748b] mb-6">TCS NQT Aptitude Mock · 76 Questions · 45 Minutes</p>

            <div className="grid grid-cols-4 gap-4 max-w-xl mx-auto mb-6">
              {[
                { label: 'Score', value: '68/90', icon: Star, color: 'text-yellow-400' },
                { label: 'Accuracy', value: '75.6%', icon: Target, color: 'text-teal-400' },
                { label: 'Speed', value: '1.2 Q/min', icon: Zap, color: 'text-purple-400' },
                { label: 'Percentile', value: 'Top 22%', icon: TrendingUp, color: 'text-blue-400' },
              ].map(m => (
                <div key={m.label} className="bg-[#0f0f1a] rounded-xl p-4">
                  <m.icon size={16} className={`${m.color} mx-auto mb-2`} />
                  <div className="text-lg font-bold text-white font-[Plus_Jakarta_Sans]">{m.value}</div>
                  <div className="text-[11px] text-[#64748b] mt-0.5">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => navigate('/dashboard/mock-test')}
                className="flex items-center gap-2 border border-[#1e1e30] text-[#94a3b8] hover:text-white text-sm px-5 py-2.5 rounded-xl transition-all"
              >
                Retake Test
              </button>
              <button
                onClick={() => navigate('/dashboard/practice')}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all"
              >
                Practice Weak Areas <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Section Analysis */}
          <div className="card-dark rounded-xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">Section Analysis</h2>
            <div className="space-y-4">
              {sectionData.map(s => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-[#94a3b8]">{s.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#64748b]">{s.score}/{s.total}</span>
                      <span className="text-xs font-semibold text-teal-400">{s.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-[#1e1e30] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full" style={{ width: `${s.pct}%` }} />
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock size={9} className="text-[#475569]" />
                    <span className="text-[10px] text-[#475569]">{s.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strong & Weak */}
          <div className="card-dark rounded-xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">Topic Performance</h2>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={13} className="text-teal-500" />
                <span className="text-xs font-semibold text-teal-400">Strong Areas</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {strongTopics.map(t => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={13} className="text-orange-500" />
                <span className="text-xs font-semibold text-orange-400">Needs Improvement</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {weakTopics.map(t => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="card-dark rounded-xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Personalized Recommendations</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { title: 'Practice Time & Work', sub: '15 targeted problems', cta: 'Practice', route: '/dashboard/practice' },
              { title: 'Attempt Probability', sub: '10 concept questions', cta: 'Learn', route: '/dashboard/learn' },
              { title: 'Retake Full Mock', sub: 'Aim for 85%+ score', cta: 'Start Test', route: '/dashboard/mock-test' },
            ].map(r => (
              <div key={r.title} className="bg-[#0f0f1a] rounded-xl p-4">
                <div className="text-sm font-semibold text-white mb-1">{r.title}</div>
                <div className="text-xs text-[#64748b] mb-3">{r.sub}</div>
                <button
                  onClick={() => navigate(r.route)}
                  className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
                >
                  {r.cta} <ArrowRight size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

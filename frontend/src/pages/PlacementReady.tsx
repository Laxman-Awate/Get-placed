import { useNavigate } from 'react-router';
import { Trophy, CheckCircle, ArrowRight, Star, Zap, TrendingUp, Target } from 'lucide-react';

const areas = [
  { name: 'Aptitude', pct: 85, color: 'bg-teal-500' },
  { name: 'DSA', pct: 72, color: 'bg-blue-500' },
  { name: 'Core CS', pct: 68, color: 'bg-purple-500' },
  { name: 'Coding', pct: 75, color: 'bg-indigo-500' },
  { name: 'Mock Tests', pct: 82, color: 'bg-orange-500' },
  { name: 'Interview Prep', pct: 60, color: 'bg-pink-500' },
  { name: 'Resume', pct: 78, color: 'bg-green-500' },
];

const achievements = [
  { icon: '🎯', title: '347 Problems Solved', sub: 'Across all categories' },
  { icon: '📝', title: '12 Mock Tests', sub: 'Avg score 82%' },
  { icon: '🏆', title: 'Top 15%', sub: 'Among all students' },
  { icon: '⚡', title: '64 Study Days', sub: 'Consistent learner' },
];

const readyFor = ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant'];
const nearReady = ['Amazon', 'Microsoft', 'Adobe'];

export default function PlacementReady() {
  const navigate = useNavigate();
  const overall = Math.round(areas.reduce((sum, a) => sum + a.pct, 0) / areas.length);

  return (
    <div className="min-h-full bg-[#080810] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="card-dark rounded-2xl p-10 mb-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-purple-500/5 to-blue-500/5" />
          <div className="absolute top-4 right-4 text-4xl opacity-10">🎓</div>
          <div className="absolute bottom-4 left-4 text-4xl opacity-10">⭐</div>

          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-orange-500/20">
              <Trophy size={36} className="text-white" />
            </div>
            <div className="text-[11px] font-semibold tracking-widest uppercase text-teal-400 mb-2">Placement Readiness Report</div>
            <h1 className="text-3xl font-extrabold font-[Plus_Jakarta_Sans] text-white mb-2">
              You're <span className="gradient-teal">{overall}% Placement Ready!</span>
            </h1>
            <p className="text-[#64748b] mb-6 max-w-lg mx-auto">
              Great progress, Arjun! You've built a strong foundation. Keep practicing to hit 90%+ and maximize your chances at dream companies.
            </p>

            <div className="flex justify-center gap-4 mb-6">
              <div className="bg-[#0f0f1a] rounded-xl px-6 py-4 text-center">
                <TrendingUp size={18} className="text-teal-400 mx-auto mb-1" />
                <div className="text-xl font-bold text-white">{overall}%</div>
                <div className="text-[11px] text-[#64748b]">Overall Score</div>
              </div>
              <div className="bg-[#0f0f1a] rounded-xl px-6 py-4 text-center">
                <Target size={18} className="text-purple-400 mx-auto mb-1" />
                <div className="text-xl font-bold text-white">Top 22%</div>
                <div className="text-[11px] text-[#64748b]">Percentile</div>
              </div>
              <div className="bg-[#0f0f1a] rounded-xl px-6 py-4 text-center">
                <Star size={18} className="text-yellow-400 mx-auto mb-1" />
                <div className="text-xl font-bold text-white">{readyFor.length}</div>
                <div className="text-[11px] text-[#64748b]">Companies Ready</div>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-3 rounded-xl mx-auto transition-all hover:shadow-lg hover:shadow-teal-500/20"
            >
              <Zap size={15} />
              Continue Preparing
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Area breakdown */}
          <div className="card-dark rounded-xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">Preparation Breakdown</h2>
            <div className="space-y-3">
              {areas.map(a => (
                <div key={a.name} className="flex items-center gap-3">
                  <span className="text-xs text-[#64748b] w-24 flex-shrink-0">{a.name}</span>
                  <div className="flex-1 h-2 bg-[#1e1e30] rounded-full overflow-hidden">
                    <div className={`h-full ${a.color} rounded-full transition-all`} style={{ width: `${a.pct}%` }} />
                  </div>
                  <span className={`text-xs font-semibold w-9 text-right ${a.pct >= 80 ? 'text-teal-400' : a.pct >= 65 ? 'text-blue-400' : 'text-orange-400'}`}>{a.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Company readiness */}
          <div className="card-dark rounded-xl p-5">
            <h2 className="text-sm font-bold text-white mb-4">Company Readiness</h2>
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={12} className="text-teal-500" />
                <span className="text-xs font-semibold text-teal-400">Ready to Apply</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {readyFor.map(c => (
                  <span key={c} className="text-xs px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium">{c}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-orange-500/50 border border-orange-500 pulse-dot" />
                <span className="text-xs font-semibold text-orange-400">Nearly Ready (85%+)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {nearReady.map(c => (
                  <span key={c} className="text-xs px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 font-medium">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="card-dark rounded-xl p-5 mb-4">
          <h2 className="text-sm font-bold text-white mb-4">Your Achievements</h2>
          <div className="grid grid-cols-4 gap-3">
            {achievements.map(a => (
              <div key={a.title} className="bg-[#0f0f1a] rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">{a.icon}</div>
                <div className="text-xs font-semibold text-white">{a.title}</div>
                <div className="text-[10px] text-[#64748b] mt-0.5">{a.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Next steps */}
        <div className="card-dark rounded-xl p-5">
          <h2 className="text-sm font-bold text-white mb-4">Recommended Next Steps</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { title: 'Boost Interview Prep to 80%', sub: 'Practice 20 more interview questions', cta: 'Practice Now', route: '/dashboard/interviews' },
              { title: 'Complete Level 3 DSA', sub: 'Graphs and DP remaining', cta: 'Continue', route: '/dashboard/learn' },
              { title: 'Take Amazon Mock Test', sub: 'You are 78% ready for Amazon', cta: 'Start Mock', route: '/dashboard/mock-test' },
            ].map(step => (
              <div key={step.title} className="bg-[#0f0f1a] rounded-xl p-4">
                <div className="text-sm font-semibold text-white mb-1">{step.title}</div>
                <div className="text-xs text-[#64748b] mb-3">{step.sub}</div>
                <button
                  onClick={() => navigate(step.route)}
                  className="flex items-center gap-1 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
                >
                  {step.cta} <ArrowRight size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

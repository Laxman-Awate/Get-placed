import { useEffect, useState } from 'react';
import { MessageSquare, Code2, Brain, Users, Building2, ArrowRight } from 'lucide-react';
import { interviewService } from '../services/interviewService';

const interviewTypes = [
  { icon: Code2, title: 'Technical Interview', sub: 'DSA, coding, CS fundamentals', color: 'from-teal-600 to-cyan-500', tag: 'Most Common', category: 'technical' },
  { icon: Users, title: 'HR Interview', sub: 'Behavioral, personality, culture fit', color: 'from-blue-600 to-indigo-500', tag: 'All companies', category: 'hr' },
  { icon: MessageSquare, title: 'Coding Round', sub: 'Live problem solving with interviewer', color: 'from-purple-600 to-violet-500', tag: 'Product companies', category: 'technical' },
  { icon: Brain, title: 'Behavioral Interview', sub: 'STAR method, leadership stories', color: 'from-orange-600 to-amber-500', tag: 'Senior roles', category: 'hr' },
  { icon: Building2, title: 'Company-Specific', sub: 'Tailored to company culture & process', color: 'from-pink-600 to-rose-500', tag: 'Targeted prep', category: 'technical' },
];

const fallbackQuestions: Record<string, string[]> = {
  technical: [
    'Explain the difference between process and thread.',
    'What is ACID in DBMS?',
    'How does HTTP differ from HTTPS?',
    'What are the SOLID principles?',
    'Explain the concept of polymorphism with example.',
    'What is the time complexity of QuickSort in worst case?',
  ],
  hr: [
    'Tell me about yourself.',
    'What are your greatest strengths and weaknesses?',
    'Why do you want to work at our company?',
    'Where do you see yourself in 5 years?',
    'Describe a challenging situation and how you handled it.',
    'What is your salary expectation?',
  ],
};

const fallbackTips: Record<string, string[]> = {
  hr: ['Use the STAR method', 'Be specific with examples', 'Show self-awareness', 'Research the company', 'Prepare 3-5 stories'],
  technical: ['Think out loud', 'Ask clarifying questions', 'Cover edge cases', 'Optimize after correctness', 'Practice on whiteboard'],
};

export default function Interviews() {
  const [activeType, setActiveType] = useState(0);
  const [answer, setAnswer] = useState('');
  const [currentQ, setCurrentQ] = useState(0);
  // Live question bank from /api/interviews/questions; hardcoded fallback
  // keeps the page usable offline.
  const [bank, setBank] = useState<Record<string, { id: string; question: string; tips: string }[]>>({});
  const [stats, setStats] = useState<{ category: string; practiced: number }[]>([]);

  const category = interviewTypes[activeType].category;

  useEffect(() => {
    let active = true;
    interviewService
      .getQuestions(category)
      .then((rows) => active && Array.isArray(rows) && setBank((cur) => ({ ...cur, [category]: rows })))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [category]);

  useEffect(() => {
    let active = true;
    interviewService
      .getStats()
      .then((rows) => active && Array.isArray(rows) && setStats(rows))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const live = bank[category] || [];
  const questions: string[] = live.length > 0 ? live.map((q) => q.question) : fallbackQuestions[category];
  const currentTip: string | undefined = live[currentQ]?.tips;
  const safeQ = Math.min(currentQ, questions.length - 1);

  const persistAttempt = () => {
    const questionId = live[safeQ]?.id || `${category === 'hr' ? 'hr' : 'tech'}-${safeQ + 1}`;
    interviewService
      .saveAttempt({ questionId, answer, feedback: '' })
      .then(() => interviewService.getStats().then(setStats).catch(() => {}))
      .catch(() => {});
  };

  const practicedTotal = stats.reduce((sum, s) => sum + (Number(s.practiced) || 0), 0);

  return (
    <div className="min-h-full bg-[#080810] p-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold font-[Plus_Jakarta_Sans] text-white mb-1">Interview Arena</h1>
        <p className="text-sm text-[#64748b]">Practice interviews and track your preparation.</p>
      </div>

      {/* Type selector */}
      <div className="grid grid-cols-3 gap-3 mb-6 lg:grid-cols-5">
        {interviewTypes.map((type, i) => {
          const Icon = type.icon;
          return (
            <button
              key={type.title}
              onClick={() => { setActiveType(i); setCurrentQ(0); setAnswer(''); }}
              className={`card-dark card-lift rounded-xl p-4 text-left transition-all border ${activeType === i ? 'border-teal-500/40 bg-teal-500/5' : 'border-[#1e1e30] hover:border-[#2e2e45]'}`}
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-2`}>
                <Icon size={16} className="text-white" />
              </div>
              <div className="text-xs font-semibold text-white leading-tight mb-1">{type.title}</div>
              <div className="text-[9px] text-[#64748b] leading-tight">{type.sub}</div>
              {type.tag && (
                <div className="mt-1.5 text-[9px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 inline-block">{type.tag}</div>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Question practice */}
        <div className="col-span-2 card-dark rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">{interviewTypes[activeType].title}</h2>
              <div className="text-xs text-[#64748b] mt-0.5">Q {safeQ + 1} of {questions.length}</div>
            </div>
            <div className="flex items-center gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentQ(i); setAnswer(''); }}
                  className={`w-6 h-6 rounded-full text-[10px] font-semibold transition-all ${safeQ === i ? 'bg-teal-500 text-white' : 'bg-[#1e1e30] text-[#64748b] hover:bg-[#2e2e45]'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0f0f1a] rounded-xl p-5 mb-4">
            <p className="text-white font-medium leading-relaxed">{questions[safeQ]}</p>
            {currentTip && <p className="text-xs text-[#64748b] mt-2">💡 {currentTip}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-[#94a3b8] mb-2">Your Answer</label>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Type your answer here... (use STAR method for behavioral questions)"
              rows={6}
              className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-xl px-4 py-3 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-teal-500/50 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              disabled={safeQ === 0}
              onClick={() => { setCurrentQ(p => Math.max(0, p - 1)); setAnswer(''); }}
              className="px-4 py-2 rounded-lg text-sm border border-[#1e1e30] text-[#94a3b8] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <button
              disabled={safeQ === questions.length - 1}
              onClick={() => { persistAttempt(); setCurrentQ(p => p + 1); setAnswer(''); }}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-teal-500 hover:bg-teal-400 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save & Next <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="space-y-4">
          <div className="card-dark rounded-xl p-5">
            <h3 className="text-xs font-bold text-white mb-3">💡 Interview Tips</h3>
            <div className="space-y-2">
              {fallbackTips[category].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#64748b]">
                  <span className="text-teal-500 font-bold mt-0.5">{i + 1}.</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          <div className="card-dark rounded-xl p-5">
            <h3 className="text-xs font-bold text-white mb-3">📊 Your Stats</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#64748b]">Questions practiced</span>
                <span className="text-white font-semibold">{practicedTotal}</span>
              </div>
              {stats.map(s => (
                <div key={s.category} className="flex items-center justify-between text-xs">
                  <span className="text-[#64748b] capitalize">{s.category}</span>
                  <span className="text-white font-semibold">{s.practiced}</span>
                </div>
              ))}
              {stats.length === 0 && (
                <div className="text-[11px] text-[#475569]">Practice a question to start tracking.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MessageSquare, Code2, Brain, Users, Building2, Cpu, ArrowRight, Mic, Star } from 'lucide-react';

const interviewTypes = [
  { icon: Code2, title: 'Technical Interview', sub: 'DSA, coding, CS fundamentals', color: 'from-teal-600 to-cyan-500', tag: 'Most Common' },
  { icon: Users, title: 'HR Interview', sub: 'Behavioral, personality, culture fit', color: 'from-blue-600 to-indigo-500', tag: 'All companies' },
  { icon: MessageSquare, title: 'Coding Round', sub: 'Live problem solving with interviewer', color: 'from-purple-600 to-violet-500', tag: 'Product companies' },
  { icon: Brain, title: 'Behavioral Interview', sub: 'STAR method, leadership stories', color: 'from-orange-600 to-amber-500', tag: 'Senior roles' },
  { icon: Building2, title: 'Company-Specific', sub: 'Tailored to company culture & process', color: 'from-pink-600 to-rose-500', tag: 'Targeted prep' },
  { icon: Cpu, title: 'AI Mock Interview', sub: 'Practice with AI, get real-time feedback', color: 'from-green-600 to-emerald-500', tag: 'New 🔥' },
];

const hrQuestions = [
  'Tell me about yourself.',
  'What are your greatest strengths and weaknesses?',
  'Why do you want to work at our company?',
  'Where do you see yourself in 5 years?',
  'Describe a challenging situation and how you handled it.',
  'What is your salary expectation?',
];

const techQuestions = [
  'Explain the difference between process and thread.',
  'What is ACID in DBMS?',
  'How does HTTP differ from HTTPS?',
  'What are the SOLID principles?',
  'Explain the concept of polymorphism with example.',
  'What is the time complexity of QuickSort in worst case?',
];

export default function Interviews() {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState(0);
  const [answer, setAnswer] = useState('');
  const [currentQ, setCurrentQ] = useState(0);

  const questions = activeType === 1 ? hrQuestions : techQuestions;

  return (
    <div className="min-h-full bg-[#080810] p-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold font-[Plus_Jakarta_Sans] text-white mb-1">Interview Arena</h1>
        <p className="text-sm text-[#64748b]">Practice interviews, get feedback and build confidence.</p>
      </div>

      {/* Type selector */}
      <div className="grid grid-cols-3 gap-3 mb-6 lg:grid-cols-6">
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

      {activeType === 5 ? (
        /* AI Interview */
        <div className="card-dark rounded-2xl p-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center mx-auto mb-4">
            <Cpu size={28} className="text-white" />
          </div>
          <h2 className="text-lg font-bold font-[Plus_Jakarta_Sans] text-white mb-2">AI Mock Interview</h2>
          <p className="text-sm text-[#64748b] mb-6 max-w-md mx-auto">
            Practice with our AI interviewer. Get real-time feedback on your answers, communication style and confidence.
          </p>
          <div className="flex justify-center gap-3 mb-6">
            {['Technical', 'HR', 'Behavioral', 'Coding'].map(t => (
              <span key={t} className="text-xs px-3 py-1 rounded-full border border-[#1e1e30] text-[#64748b]">{t}</span>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl mx-auto transition-all">
            <Mic size={16} />
            Start AI Interview
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {/* Question practice */}
          <div className="col-span-2 card-dark rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white">{interviewTypes[activeType].title}</h2>
                <div className="text-xs text-[#64748b] mt-0.5">Q {currentQ + 1} of {questions.length}</div>
              </div>
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <button
                    key={i}
                    onClick={() => { setCurrentQ(i); setAnswer(''); }}
                    className={`w-6 h-6 rounded-full text-[10px] font-semibold transition-all ${currentQ === i ? 'bg-teal-500 text-white' : 'bg-[#1e1e30] text-[#64748b] hover:bg-[#2e2e45]'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0f0f1a] rounded-xl p-5 mb-4">
              <p className="text-white font-medium leading-relaxed">{questions[currentQ]}</p>
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
                disabled={currentQ === 0}
                onClick={() => { setCurrentQ(p => p - 1); setAnswer(''); }}
                className="px-4 py-2 rounded-lg text-sm border border-[#1e1e30] text-[#94a3b8] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-purple-500/15 hover:bg-purple-500/25 text-purple-400 border border-purple-500/30 text-sm font-medium py-2 rounded-lg transition-all">
                <Star size={13} />
                Get AI Feedback
              </button>
              <button
                disabled={currentQ === questions.length - 1}
                onClick={() => { setCurrentQ(p => p + 1); setAnswer(''); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-teal-500 hover:bg-teal-400 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="space-y-4">
            <div className="card-dark rounded-xl p-5">
              <h3 className="text-xs font-bold text-white mb-3">💡 Interview Tips</h3>
              <div className="space-y-2">
                {(activeType === 1
                  ? ['Use the STAR method', 'Be specific with examples', 'Show self-awareness', 'Research the company', 'Prepare 3-5 stories']
                  : ['Think out loud', 'Ask clarifying questions', 'Cover edge cases', 'Optimize after correctness', 'Practice on whiteboard']
                ).map((tip, i) => (
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
                {[
                  { label: 'Questions practiced', val: '47' },
                  { label: 'Mock interviews done', val: '5' },
                  { label: 'Confidence score', val: '74%' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between text-xs">
                    <span className="text-[#64748b]">{s.label}</span>
                    <span className="text-white font-semibold">{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

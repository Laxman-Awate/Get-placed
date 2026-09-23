import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, Play, BookOpen, HelpCircle, Lightbulb, Star, CheckCircle } from 'lucide-react';

const modules = [
  { id: 1, title: 'Arrays & Strings', done: true, topics: 12 },
  { id: 2, title: 'Linked Lists', done: true, topics: 8 },
  { id: 3, title: 'Stacks & Queues', done: false, topics: 10, active: true },
  { id: 4, title: 'Trees & BST', done: false, topics: 15 },
  { id: 5, title: 'Graphs', done: false, topics: 18 },
  { id: 6, title: 'Dynamic Programming', done: false, topics: 22 },
];

const conceptContent = [
  { section: 'Concept', icon: BookOpen, color: 'teal', content: 'A stack is a linear data structure that follows LIFO (Last In, First Out). Elements are added and removed from the same end — called the top. Push adds an element; pop removes the top element.' },
  { section: 'Example', icon: Lightbulb, color: 'blue', content: 'Think of a stack of plates — you always add and remove from the top. In code: stack = [], stack.append(1), stack.append(2), stack.pop() returns 2.' },
  { section: 'Quick Check', icon: HelpCircle, color: 'purple', content: 'Which operation removes an element from a stack?\nA) Enqueue  B) Pop  C) Dequeue  D) Push' },
  { section: 'Interview Insight', icon: Star, color: 'orange', content: 'Stacks are used in: function call management, expression evaluation, undo/redo operations, DFS traversal, and balanced parentheses problems.' },
];

const colorMap: Record<string, string> = {
  teal: 'text-teal-400 bg-teal-500/10',
  blue: 'text-blue-400 bg-blue-500/10',
  purple: 'text-purple-400 bg-purple-500/10',
  orange: 'text-orange-400 bg-orange-500/10',
};

export default function Learn() {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(3);
  const [tab, setTab] = useState<'concept' | 'practice' | 'test' | 'faq'>('concept');

  return (
    <div className="min-h-full bg-[#080810] flex">
      {/* Module sidebar */}
      <div className="w-56 border-r border-[#1e1e30] p-4 sticky top-0 h-screen overflow-y-auto hide-scrollbar">
        <div className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-3">DSA Course</div>
        <div className="space-y-1">
          {modules.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all text-xs ${
                activeModule === m.id
                  ? 'bg-teal-500/12 text-teal-400 border border-teal-500/20'
                  : m.done
                  ? 'text-[#64748b] hover:text-[#94a3b8]'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              {m.done ? (
                <CheckCircle size={13} className="text-teal-500 flex-shrink-0" />
              ) : (
                <div className={`w-3 h-3 rounded-full border flex-shrink-0 ${activeModule === m.id ? 'border-teal-500 bg-teal-500/30' : 'border-[#2e2e45]'}`} />
              )}
              <span className="truncate">{m.title}</span>
              {m.active && <span className="ml-auto text-[9px] text-teal-400 font-medium">Active</span>}
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-[#1e1e30]">
          <button
            onClick={() => navigate('/dashboard/roadmap')}
            className="w-full flex items-center gap-2 text-xs text-[#64748b] hover:text-teal-400 transition-colors py-1"
          >
            <ChevronRight size={12} />
            View Roadmap
          </button>
          <button
            onClick={() => navigate('/dashboard/practice')}
            className="w-full flex items-center gap-2 text-xs text-[#64748b] hover:text-teal-400 transition-colors py-1 mt-1"
          >
            <Play size={12} />
            Practice Problems
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="mb-2">
          <div className="flex items-center gap-2 text-xs text-[#64748b] mb-2">
            <span>DSA</span><ChevronRight size={10} /><span>Stacks & Queues</span>
          </div>
          <h1 className="text-xl font-bold font-[Plus_Jakarta_Sans] text-white mb-1">Stacks & Queues</h1>
          <p className="text-sm text-[#64748b]">Linear data structures with ordered access patterns</p>
        </div>

        {/* Progress */}
        <div className="card-dark rounded-xl p-4 mb-5 flex items-center gap-4">
          <div className="flex-1 h-1.5 bg-[#1e1e30] rounded-full">
            <div className="h-full w-[40%] bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full" />
          </div>
          <span className="text-xs text-[#64748b]">4 / 10 topics done</span>
          <button
            onClick={() => navigate('/dashboard/practice')}
            className="flex items-center gap-1.5 text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            <Play size={11} />Practice
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-5 border-b border-[#1e1e30] pb-0">
          {(['concept', 'practice', 'test', 'faq'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
                tab === t
                  ? 'text-teal-400 border-teal-400'
                  : 'text-[#64748b] border-transparent hover:text-[#94a3b8]'
              }`}
            >
              {t === 'faq' ? 'FAQ' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'concept' && (
          <div className="space-y-4 max-w-2xl">
            {conceptContent.map(c => {
              const Icon = c.icon;
              return (
                <div key={c.section} className="card-dark rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-7 h-7 rounded-lg ${colorMap[c.color]} flex items-center justify-center`}>
                      <Icon size={13} />
                    </div>
                    <span className="text-sm font-semibold text-white">{c.section}</span>
                  </div>
                  <p className="text-sm text-[#94a3b8] leading-relaxed whitespace-pre-line">{c.content}</p>
                </div>
              );
            })}
            <div className="card-dark rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg text-green-400 bg-green-500/10 flex items-center justify-center">
                  <BookOpen size={13} />
                </div>
                <span className="text-sm font-semibold text-white">FAQ</span>
              </div>
              <div className="space-y-3">
                {[
                  'What is the time complexity of push and pop?',
                  'How does a monotonic stack work?',
                  'When to use stack vs queue in interviews?',
                ].map(q => (
                  <div key={q} className="flex items-start gap-2 text-sm text-[#64748b] hover:text-[#94a3b8] cursor-pointer transition-colors">
                    <ChevronRight size={13} className="mt-0.5 flex-shrink-0 text-teal-500" />
                    {q}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'practice' && (
          <div className="max-w-2xl">
            <div className="card-dark rounded-xl p-5 mb-4">
              <h3 className="font-semibold text-white mb-3">Practice Problems</h3>
              <div className="space-y-2">
                {[
                  { title: 'Valid Parentheses', diff: 'Easy', status: 'done' },
                  { title: 'Min Stack', diff: 'Medium', status: 'done' },
                  { title: 'Evaluate Reverse Polish Notation', diff: 'Medium', status: 'pending' },
                  { title: 'Daily Temperatures', diff: 'Medium', status: 'pending' },
                  { title: 'Largest Rectangle in Histogram', diff: 'Hard', status: 'pending' },
                ].map(p => (
                  <div
                    key={p.title}
                    onClick={() => navigate('/dashboard/coding')}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#0f0f1a] hover:bg-[#17172a] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      {p.status === 'done' ? <CheckCircle size={13} className="text-teal-500" /> : <div className="w-3 h-3 rounded-full border border-[#2e2e45]" />}
                      <span className="text-sm text-[#94a3b8] group-hover:text-white transition-colors">{p.title}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${p.diff === 'Easy' ? 'text-green-400 bg-green-500/10' : p.diff === 'Medium' ? 'text-yellow-400 bg-yellow-500/10' : 'text-red-400 bg-red-500/10'}`}>{p.diff}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'test' && (
          <div className="max-w-lg">
            <div className="card-dark rounded-xl p-8 text-center">
              <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <HelpCircle size={24} className="text-purple-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Stacks & Queues Test</h3>
              <p className="text-sm text-[#64748b] mb-6">10 questions · 20 minutes · Mixed difficulty</p>
              <button
                onClick={() => navigate('/dashboard/test-ui')}
                className="bg-purple-500 hover:bg-purple-400 text-white font-semibold px-6 py-2.5 rounded-xl transition-all"
              >
                Start Test →
              </button>
            </div>
          </div>
        )}

        {tab === 'faq' && (
          <div className="max-w-2xl space-y-3">
            {[
              { q: 'What is the difference between stack and queue?', a: 'Stack follows LIFO; queue follows FIFO. Stack has push/pop; queue has enqueue/dequeue.' },
              { q: 'What is the time complexity of stack operations?', a: 'Push, pop, and peek are all O(1) for a standard array/linked-list based stack.' },
              { q: 'When should I use a monotonic stack?', a: 'Use monotonic stacks for problems involving next greater/smaller element, stock span problems, and histogram problems.' },
            ].map(item => (
              <div key={item.q} className="card-dark rounded-xl p-5">
                <div className="text-sm font-semibold text-white mb-2">{item.q}</div>
                <div className="text-sm text-[#64748b]">{item.a}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

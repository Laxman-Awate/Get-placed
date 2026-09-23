import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Clock, Flag, ChevronLeft, ChevronRight, AlertTriangle, X } from 'lucide-react';

const questions = [
  { id: 1, text: 'A train travels 60 km in 45 minutes. What is its speed in km/h?', options: ['75', '80', '90', '85'], answer: 1 },
  { id: 2, text: 'Find the next term: 2, 6, 12, 20, 30, ?', options: ['40', '42', '44', '48'], answer: 1 },
  { id: 3, text: 'If A is the brother of B, B is the sister of C, and C is the father of D, then A is D\'s?', options: ['Uncle', 'Nephew', 'Brother', 'Cousin'], answer: 0 },
  { id: 4, text: 'What is the compound interest on ₹5000 at 10% p.a. for 2 years?', options: ['₹1000', '₹1050', '₹1100', '₹950'], answer: 1 },
  { id: 5, text: 'In how many ways can the letters of "LEVEL" be arranged?', options: ['30', '60', '120', '20'], answer: 0 },
  { id: 6, text: 'Choose the synonym of "Ephemeral":', options: ['Permanent', 'Transient', 'Eternal', 'Stable'], answer: 1 },
  { id: 7, text: 'A pipe fills a tank in 6 hours. Another pipe empties it in 9 hours. If both are open, in how many hours does the tank fill?', options: ['12', '15', '18', '24'], answer: 2 },
  { id: 8, text: 'What is 15% of 3 hours in minutes?', options: ['27', '25.5', '27.5', '24'], answer: 0 },
  { id: 9, text: 'Select the odd one out: Triangle, Square, Circle, Cube', options: ['Triangle', 'Square', 'Circle', 'Cube'], answer: 3 },
  { id: 10, text: 'Complete: BOOK : LIBRARY :: PAINTING : ?', options: ['Artist', 'Canvas', 'Museum', 'Brush'], answer: 2 },
];

type Status = 'unattempted' | 'answered' | 'marked' | 'marked-answered';

export default function TestUI() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [statuses, setStatuses] = useState<Record<number, Status>>({});
  const [time, setTime] = useState(45 * 60);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = Math.floor(time / 60).toString().padStart(2, '0');
  const ss = (time % 60).toString().padStart(2, '0');

  const select = (optIdx: number) => {
    setSelected(prev => ({ ...prev, [current]: optIdx }));
    setStatuses(prev => ({
      ...prev,
      [current]: prev[current] === 'marked' ? 'marked-answered' : 'answered',
    }));
  };

  const toggleMark = () => {
    setStatuses(prev => {
      const cur = prev[current];
      if (cur === 'answered') return { ...prev, [current]: 'marked-answered' };
      if (cur === 'marked-answered') return { ...prev, [current]: 'answered' };
      if (cur === 'marked') return { ...prev, [current]: 'unattempted' };
      return { ...prev, [current]: 'marked' };
    });
  };

  const getStatusColor = (i: number) => {
    const s = statuses[i] || 'unattempted';
    if (s === 'answered') return 'bg-teal-500 text-white';
    if (s === 'marked' || s === 'marked-answered') return 'bg-orange-500 text-white';
    return 'bg-[#1e1e30] text-[#64748b]';
  };

  const answered = Object.values(statuses).filter(s => s === 'answered' || s === 'marked-answered').length;
  const marked = Object.values(statuses).filter(s => s === 'marked' || s === 'marked-answered').length;
  const unattempted = questions.length - answered;

  return (
    <div className="min-h-full bg-[#080810] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#1e1e30] bg-[#0a0a14]">
        <div>
          <div className="text-sm font-semibold text-white">TCS NQT Aptitude Mock</div>
          <div className="text-xs text-[#64748b]">Q {current + 1} of {questions.length} · Section: Aptitude</div>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-sm ${time < 300 ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-[#1e1e30] text-teal-400'}`}>
          <Clock size={14} />
          {mm}:{ss}
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm px-4 py-2 rounded-xl transition-all"
        >
          Submit Test
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Question */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto hide-scrollbar">
          <div className="max-w-2xl">
            <div className="mb-6">
              <div className="text-xs font-semibold text-teal-400 mb-2">Question {current + 1}</div>
              <p className="text-white font-medium leading-relaxed">{questions[current].text}</p>
            </div>

            <div className="space-y-2.5 mb-8">
              {questions[current].options.map((opt, i) => {
                const isSelected = selected[current] === i;
                return (
                  <button
                    key={i}
                    onClick={() => select(i)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-teal-500/50 bg-teal-500/10 text-white'
                        : 'border-[#1e1e30] bg-[#0f0f1a] text-[#94a3b8] hover:border-[#2e2e45] hover:text-white'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${isSelected ? 'border-teal-400 bg-teal-500/20 text-teal-400' : 'border-[#2e2e45] text-[#475569]'}`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-sm">{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={toggleMark} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm hover:bg-orange-500/15 transition-all">
                <Flag size={13} />
                Mark for Review
              </button>
              <div className="flex-1" />
              <button
                disabled={current === 0}
                onClick={() => setCurrent(prev => prev - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border border-[#1e1e30] text-[#94a3b8] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />Prev
              </button>
              <button
                disabled={current === questions.length - 1}
                onClick={() => setCurrent(prev => prev + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm bg-teal-500 hover:bg-teal-400 text-white disabled:opacity-40 disabled:cursor-not-allowed font-medium"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="w-56 border-l border-[#1e1e30] p-4 overflow-y-auto hide-scrollbar">
          <div className="text-xs font-semibold text-[#94a3b8] mb-3">Question Navigator</div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${getStatusColor(i)} ${current === i ? 'ring-2 ring-teal-400 ring-offset-1 ring-offset-[#080810]' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="space-y-2 text-[11px]">
            {[
              { label: 'Answered', count: answered, color: 'bg-teal-500' },
              { label: 'Marked', count: marked, color: 'bg-orange-500' },
              { label: 'Unattempted', count: unattempted, color: 'bg-[#1e1e30]' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${item.color}`} />
                  <span className="text-[#64748b]">{item.label}</span>
                </div>
                <span className="text-[#94a3b8] font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="card-dark rounded-2xl p-8 w-80 relative">
            <button onClick={() => setShowConfirm(false)} className="absolute top-4 right-4 text-[#475569] hover:text-[#94a3b8]"><X size={16} /></button>
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={22} className="text-orange-400" />
            </div>
            <h3 className="text-base font-bold text-white text-center mb-2">Submit Test?</h3>
            <div className="text-sm text-[#64748b] text-center mb-6">
              <div>{answered} answered · {unattempted} unattempted · {marked} marked</div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-2 rounded-xl text-sm border border-[#1e1e30] text-[#94a3b8] hover:text-white transition-colors">Cancel</button>
              <button onClick={() => navigate('/dashboard/results')} className="flex-1 py-2 rounded-xl text-sm bg-teal-500 hover:bg-teal-400 text-white font-semibold transition-all">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

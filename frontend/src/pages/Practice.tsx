import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Filter, Search, CheckCircle, Clock, ChevronDown } from 'lucide-react';

const problems = [
  { id: 1, title: 'Two Sum', category: 'Arrays', difficulty: 'Easy', solved: true, attempts: 12420 },
  { id: 2, title: 'Valid Parentheses', category: 'Stacks', difficulty: 'Easy', solved: true, attempts: 8930 },
  { id: 3, title: 'Merge K Sorted Lists', category: 'Linked Lists', difficulty: 'Hard', solved: false, attempts: 4210 },
  { id: 4, title: 'Longest Substring Without Repeating Characters', category: 'Strings', difficulty: 'Medium', solved: false, attempts: 7890 },
  { id: 5, title: 'Binary Tree Level Order Traversal', category: 'Trees', difficulty: 'Medium', solved: true, attempts: 5670 },
  { id: 6, title: 'Median of Two Sorted Arrays', category: 'Arrays', difficulty: 'Hard', solved: false, attempts: 3120 },
  { id: 7, title: 'Reverse Linked List', category: 'Linked Lists', difficulty: 'Easy', solved: true, attempts: 9870 },
  { id: 8, title: 'Coin Change', category: 'DP', difficulty: 'Medium', solved: false, attempts: 6540 },
  { id: 9, title: 'Number of Islands', category: 'Graphs', difficulty: 'Medium', solved: false, attempts: 7120 },
  { id: 10, title: 'Climbing Stairs', category: 'DP', difficulty: 'Easy', solved: true, attempts: 11230 },
  { id: 11, title: 'Course Schedule', category: 'Graphs', difficulty: 'Medium', solved: false, attempts: 4890 },
  { id: 12, title: 'Word Break', category: 'DP', difficulty: 'Medium', solved: false, attempts: 5430 },
];

const categories = ['All', 'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Stacks', 'DP'];
const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

const diffColor: Record<string, string> = {
  Easy: 'text-green-400 bg-green-500/10',
  Medium: 'text-yellow-400 bg-yellow-500/10',
  Hard: 'text-red-400 bg-red-500/10',
};

export default function Practice() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [timer, setTimer] = useState(false);

  const filtered = problems.filter(p =>
    (category === 'All' || p.category === category) &&
    (difficulty === 'All' || p.difficulty === difficulty) &&
    (p.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-full bg-[#080810] p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold font-[Plus_Jakarta_Sans] text-white mb-1">Practice Arena</h1>
        <p className="text-sm text-[#64748b]">Filter by topic, difficulty and solve at your own pace.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', val: '1,200', color: 'text-[#94a3b8]' },
          { label: 'Solved', val: '347', color: 'text-teal-400' },
          { label: 'In Progress', val: '23', color: 'text-yellow-400' },
          { label: 'Unsolved', val: '830', color: 'text-[#64748b]' },
        ].map(s => (
          <div key={s.label} className="card-dark rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold font-[Plus_Jakarta_Sans] ${s.color}`}>{s.val}</div>
            <div className="text-xs text-[#475569] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card-dark rounded-xl p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-40">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search problems..."
            className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-teal-500/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={13} className="text-[#475569]" />
          <div className="flex gap-1">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${category === c ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30' : 'text-[#64748b] hover:text-[#94a3b8] border border-transparent'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-1">
          {difficulties.map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${difficulty === d
                ? d === 'Easy' ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                  : d === 'Medium' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                  : d === 'Hard' ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                  : 'bg-teal-500/15 text-teal-400 border border-teal-500/30'
                : 'text-[#64748b] hover:text-[#94a3b8] border border-transparent'}`}
            >
              {d}
            </button>
          ))}
        </div>

        <button
          onClick={() => setTimer(!timer)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${timer ? 'bg-orange-500/15 text-orange-400 border-orange-500/30' : 'text-[#64748b] border-[#1e1e30] hover:border-[#2e2e45]'}`}
        >
          <Clock size={12} />
          Timer Mode
        </button>
      </div>

      {/* Problem List */}
      <div className="card-dark rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 text-[10px] font-semibold text-[#475569] uppercase tracking-widest px-4 py-3 border-b border-[#1e1e30]">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Problem</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Difficulty</div>
          <div className="col-span-2">Attempts</div>
        </div>
        {filtered.map((p, i) => (
          <div
            key={p.id}
            onClick={() => navigate('/dashboard/coding')}
            className="grid grid-cols-12 items-center px-4 py-3 border-b border-[#1e1e30] last:border-0 hover:bg-[#0f0f1a] cursor-pointer transition-colors group"
          >
            <div className="col-span-1 text-xs text-[#475569]">
              {p.solved ? <CheckCircle size={13} className="text-teal-500" /> : <span>{p.id}</span>}
            </div>
            <div className="col-span-5 text-sm text-[#94a3b8] group-hover:text-white transition-colors truncate pr-4">{p.title}</div>
            <div className="col-span-2 text-xs text-[#64748b]">{p.category}</div>
            <div className="col-span-2">
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${diffColor[p.difficulty]}`}>{p.difficulty}</span>
            </div>
            <div className="col-span-2 text-xs text-[#475569]">{p.attempts.toLocaleString()}</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-[#475569]">No problems match your filters.</div>
        )}
      </div>
    </div>
  );
}

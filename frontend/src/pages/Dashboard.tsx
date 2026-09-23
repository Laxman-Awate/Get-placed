import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Bell, Search, TrendingUp, Code2, ClipboardList, BarChart3, BookOpen,
  ChevronRight, MoreHorizontal, Play, ArrowRight, Star, Zap, X
} from 'lucide-react';

const notifications = [
  { id: 1, text: 'You have a TCS Mock Test scheduled tomorrow', time: '1h ago', type: 'test', read: false },
  { id: 2, text: 'New DSA problems added: Graphs — 15 problems', time: '3h ago', type: 'content', read: false },
  { id: 3, text: 'Weekly report ready: You improved by 5% this week!', time: '1d ago', type: 'report', read: true },
  { id: 4, text: 'Amazon is visiting your campus in 2 weeks', time: '2d ago', type: 'placement', read: true },
];

const summaryCards = [
  { label: 'Placement Readiness', value: '78%', sub: '+5% this week', color: 'teal', icon: TrendingUp, bar: 78 },
  { label: 'Questions Solved', value: '347', sub: '1,200+ available', color: 'blue', icon: Code2, bar: 29 },
  { label: 'Mock Tests', value: '12', sub: '3 pending', color: 'purple', icon: ClipboardList, bar: 60 },
  { label: 'Average Score', value: '82%', sub: 'Top 15%', color: 'orange', icon: BarChart3, bar: 82 },
  { label: 'Learning Progress', value: '64%', sub: '8 modules done', color: 'green', icon: BookOpen, bar: 64 },
];

const colorMap: Record<string, string> = {
  teal: 'text-teal-400 bg-teal-500/10',
  blue: 'text-blue-400 bg-blue-500/10',
  purple: 'text-purple-400 bg-purple-500/10',
  orange: 'text-orange-400 bg-orange-500/10',
  green: 'text-green-400 bg-green-500/10',
};

const barColorMap: Record<string, string> = {
  teal: 'from-teal-500 to-cyan-400',
  blue: 'from-blue-500 to-indigo-400',
  purple: 'from-purple-500 to-violet-400',
  orange: 'from-orange-500 to-amber-400',
  green: 'from-green-500 to-emerald-400',
};

const weekActivity = [
  { day: 'Mon', val: 85 }, { day: 'Tue', val: 60 }, { day: 'Wed', val: 92 },
  { day: 'Thu', val: 45 }, { day: 'Fri', val: 78 }, { day: 'Sat', val: 95 }, { day: 'Sun', val: 30 },
];

const skills = [
  { name: 'Aptitude', pct: 82, color: 'bg-teal-500' },
  { name: 'DSA', pct: 67, color: 'bg-blue-500' },
  { name: 'DBMS', pct: 75, color: 'bg-purple-500' },
  { name: 'OS', pct: 58, color: 'bg-orange-500' },
  { name: 'CN', pct: 63, color: 'bg-pink-500' },
  { name: 'Coding', pct: 71, color: 'bg-indigo-500' },
];

const featuredCards = [
  { title: 'Data Structures & Algorithms', sub: 'Master arrays to graphs', tag: '450+ Problems', color: 'from-teal-600 to-cyan-500', img: '🌳' },
  { title: 'Low Level Design', sub: 'Design patterns & OOP', tag: 'Advanced', color: 'from-purple-600 to-violet-500', img: '🔧' },
  { title: 'All Problems', sub: '1,200+ curated questions', tag: 'Mixed', color: 'from-blue-600 to-indigo-500', img: '📚' },
  { title: 'Object Oriented Programming', sub: 'Core OOP concepts', tag: 'Foundation', color: 'from-orange-600 to-amber-500', img: '🎯' },
];

type LearnCard = { title: string; desc: string; accent: string; };

const sections: { title: string; cards: LearnCard[] }[] = [
  {
    title: 'Data Structures and Algorithms',
    cards: [
      { title: 'DSA', desc: 'Complete structured course', accent: 'bg-teal-500' },
      { title: 'All Problems', desc: '1200+ practice questions', accent: 'bg-blue-500' },
      { title: 'DSA Concept Revision', desc: 'Quick concept refresher', accent: 'bg-purple-500' },
      { title: 'DSA Quick Revision', desc: 'Last-minute revision pack', accent: 'bg-orange-500' },
    ],
  },
  {
    title: 'Design',
    cards: [
      { title: 'OOP', desc: 'Classes, inheritance & more', accent: 'bg-pink-500' },
      { title: 'Low Level Design', desc: 'Design patterns & SOLID', accent: 'bg-violet-500' },
    ],
  },
  {
    title: 'Core Subjects',
    cards: [
      { title: 'Operating Systems', desc: 'Processes, memory & I/O', accent: 'bg-indigo-500' },
      { title: 'Computer Networks', desc: 'TCP/IP, protocols & security', accent: 'bg-cyan-500' },
      { title: 'DBMS', desc: 'SQL, normalization & transactions', accent: 'bg-emerald-500' },
    ],
  },
  {
    title: 'Aptitude',
    cards: [
      { title: 'Logical Reasoning', desc: 'Puzzles, syllogisms & more', accent: 'bg-yellow-500' },
      { title: 'Quantitative Aptitude', desc: 'Maths for placement tests', accent: 'bg-orange-500' },
      { title: 'Verbal Ability', desc: 'Grammar, vocab & RC', accent: 'bg-rose-500' },
      { title: 'Mock Test', desc: 'Full-length aptitude test', accent: 'bg-teal-500' },
    ],
  },
];

const companies = [
  { name: 'TCS', logo: '🏢', progress: 65, type: 'Service', color: 'from-blue-700 to-indigo-600' },
  { name: 'Infosys', logo: '💼', progress: 42, type: 'Service', color: 'from-indigo-700 to-blue-600' },
  { name: 'Amazon', logo: '📦', progress: 78, type: 'Product', color: 'from-orange-500 to-amber-500' },
  { name: 'Microsoft', logo: '🪟', progress: 53, type: 'Product', color: 'from-blue-600 to-cyan-500' },
  { name: 'Google', logo: '🔍', progress: 34, type: 'Product', color: 'from-blue-500 to-green-500' },
  { name: 'Adobe', logo: '🎨', progress: 28, type: 'Product', color: 'from-red-600 to-rose-500' },
  { name: 'Wipro', logo: '🌐', progress: 71, type: 'Service', color: 'from-purple-700 to-violet-600' },
  { name: 'Deloitte', logo: '🔷', progress: 44, type: 'Consulting', color: 'from-green-700 to-teal-600' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifList, setNotifList] = useState(notifications);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unread = notifList.filter(n => !n.read).length;

  return (
    <div className="min-h-full bg-[#080810] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold font-[Plus_Jakarta_Sans] text-white">Good morning, Arjun 👋</h1>
          <p className="text-sm text-[#64748b]">You're 78% placement ready. Keep going!</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search topics..."
              className="bg-[#0f0f1a] border border-[#1e1e30] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-teal-500/50 w-48"
            />
          </div>
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifs(s => !s)}
              className="relative p-2 rounded-xl border border-[#1e1e30] bg-[#0f0f1a] text-[#94a3b8] hover:text-white transition-colors"
            >
              <Bell size={16} />
              {unread > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-500 pulse-dot" />}
            </button>
            {showNotifs && (
              <div className="absolute right-0 top-11 w-80 card-dark rounded-2xl border border-[#1e1e30] shadow-2xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e30]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">Notifications</span>
                    {unread > 0 && <span className="text-[10px] font-bold bg-teal-500 text-white px-1.5 py-0.5 rounded-full">{unread}</span>}
                  </div>
                  <button
                    onClick={() => setNotifList(prev => prev.map(n => ({ ...n, read: true })))}
                    className="text-[10px] text-teal-400 hover:underline"
                  >Mark all read</button>
                </div>
                <div className="max-h-72 overflow-y-auto hide-scrollbar">
                  {notifList.map(n => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-[#1e1e30] last:border-0 cursor-pointer hover:bg-[#0f0f1a] transition-colors ${!n.read ? 'bg-teal-500/3' : ''}`}
                      onClick={() => setNotifList(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? 'bg-[#2e2e45]' : 'bg-teal-400'}`} />
                      <div className="flex-1">
                        <div className={`text-xs leading-relaxed ${n.read ? 'text-[#64748b]' : 'text-[#94a3b8]'}`}>{n.text}</div>
                        <div className="text-[10px] text-[#475569] mt-1">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer">A</div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {summaryCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card-dark card-lift rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg ${colorMap[card.color]} flex items-center justify-center`}>
                  <Icon size={15} />
                </div>
                <span className={`text-[10px] font-medium ${colorMap[card.color].split(' ')[0]}`}>{card.sub}</span>
              </div>
              <div className="text-2xl font-bold text-white font-[Plus_Jakarta_Sans] mb-0.5">{card.value}</div>
              <div className="text-[11px] text-[#64748b] mb-3">{card.label}</div>
              <div className="h-1.5 bg-[#1e1e30] rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${barColorMap[card.color]} rounded-full`} style={{ width: `${card.bar}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Weekly Activity */}
        <div className="col-span-2 card-dark rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-white">Weekly Activity</div>
            <span className="text-xs text-[#64748b]">This week</span>
          </div>
          <div className="flex items-end gap-2 h-24">
            {weekActivity.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-lg ${i === 6 ? 'bg-gradient-to-t from-teal-600 to-teal-400' : 'bg-[#1e1e30] hover:bg-[#2e2e45] transition-colors'}`}
                  style={{ height: `${d.val}%` }}
                />
                <span className="text-[9px] text-[#475569]">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Progress */}
        <div className="card-dark rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-white">Skill Progress</div>
            <button className="text-xs text-teal-400 hover:underline" onClick={() => navigate('/dashboard/roadmap')}>View roadmap</button>
          </div>
          <div className="space-y-2.5">
            {skills.map(s => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="text-[11px] text-[#64748b] w-14">{s.name}</span>
                <div className="flex-1 h-1.5 bg-[#1e1e30] rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                </div>
                <span className="text-[11px] text-[#94a3b8] w-7 text-right">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Carousel */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold font-[Plus_Jakarta_Sans] text-white">Featured</h2>
          <button className="text-xs text-teal-400 flex items-center gap-1 hover:underline">View all <ChevronRight size={12} /></button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {featuredCards.map(card => (
            <div
              key={card.title}
              onClick={() => navigate('/dashboard/learn')}
              className={`flex-shrink-0 w-56 h-36 rounded-2xl bg-gradient-to-br ${card.color} p-5 cursor-pointer relative overflow-hidden card-lift`}
            >
              <div className="absolute -right-4 -bottom-4 text-6xl opacity-30">{card.img}</div>
              <div className="inline-block px-2 py-0.5 rounded-full bg-white/20 text-[10px] text-white font-medium mb-2">{card.tag}</div>
              <div className="text-sm font-bold text-white leading-tight mb-1">{card.title}</div>
              <div className="text-[10px] text-white/70">{card.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Sections */}
      {sections.map(section => (
        <div key={section.title} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold font-[Plus_Jakarta_Sans] text-white">{section.title}</h2>
            <button className="text-xs text-teal-400 flex items-center gap-1 hover:underline" onClick={() => navigate('/dashboard/learn')}>
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {section.cards.map(card => (
              <div key={card.title} className="flex-shrink-0 w-52 card-dark card-lift rounded-xl overflow-hidden flex">
                <div className={`w-1 ${card.accent} flex-shrink-0 rounded-l-xl`} />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="text-sm font-semibold text-white leading-tight">{card.title}</div>
                    <button className="text-[#475569] hover:text-[#94a3b8] ml-2 flex-shrink-0">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                  <div className="text-[11px] text-[#64748b] mb-3">{card.desc}</div>
                  <button
                    onClick={() => navigate('/dashboard/learn')}
                    className="flex items-center gap-1.5 text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    <Play size={10} className="fill-current" />
                    Start Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Company Preparation */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold font-[Plus_Jakarta_Sans] text-white">Company Preparation</h2>
            <p className="text-xs text-[#64748b] mt-0.5">Tailored prep for your target companies</p>
          </div>
          <button className="text-xs text-teal-400 flex items-center gap-1 hover:underline" onClick={() => navigate('/dashboard/company-prep')}>
            View all companies <ChevronRight size={12} />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {companies.map(c => (
            <div key={c.name} className="flex-shrink-0 w-64 card-dark card-lift rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-xl`}>
                  {c.logo}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{c.name}</div>
                  <div className="text-[10px] text-[#64748b]">{c.type} Company</div>
                </div>
                <div className="ml-auto text-xs font-semibold text-teal-400">{c.progress}%</div>
              </div>
              <div className="h-1.5 bg-[#1e1e30] rounded-full mb-3">
                <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all" style={{ width: `${c.progress}%` }} />
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {['Aptitude', 'Coding', 'Core CS', 'Technical', 'HR'].map(area => (
                  <span key={area} className="text-[9px] px-1.5 py-0.5 rounded bg-[#0f0f1a] text-[#64748b] border border-[#1e1e30]">{area}</span>
                ))}
              </div>
              <button
                onClick={() => navigate('/dashboard/company-prep')}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-teal-400 border border-teal-500/30 bg-teal-500/8 hover:bg-teal-500/15 py-2 rounded-lg transition-all"
              >
                Prepare Now <ArrowRight size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Placement Ready Prompt */}
      <div
        onClick={() => navigate('/dashboard/placement-ready')}
        className="card-dark rounded-xl p-5 flex items-center justify-between cursor-pointer hover:border-teal-500/30 transition-all group mb-2"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
            <Star size={22} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Check Your Placement Readiness</div>
            <div className="text-xs text-[#64748b]">See your score, analysis and next steps</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-teal-400 group-hover:gap-3 transition-all">
          <span className="text-xs font-semibold">View Report</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
}

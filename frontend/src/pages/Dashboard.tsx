import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  ChevronRight,
  ClipboardList,
  Code2,
  Play,
  Search,
  Star,
  TrendingUp,
} from 'lucide-react';
import { useCodingProblems } from '../hooks/useCodingProblems';
import { useCompanyDirectory } from '../hooks/useCompanies';
import { useContributionActivity } from '../hooks/useContributionActivity';
import { useDashboard } from '../hooks/useDashboard';
import { useMockTests } from '../hooks/useMockTests';
import { authService } from '../services/authService';
import { learningService } from '../services/learningService';

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

const statIcons = [Code2, ClipboardList, BarChart3, BookOpen, TrendingUp];
const statColors = ['blue', 'purple', 'teal', 'green', 'orange'];
const accentColors = ['bg-teal-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-green-500'];
const companyColors: Record<string, string> = {
  Product: 'from-blue-600 to-cyan-500',
  Service: 'from-indigo-700 to-blue-600',
  Consulting: 'from-green-700 to-teal-600',
};

function percentFromValue(value: unknown) {
  const parsed = Number.parseInt(String(value || '0').replace(/[^\d]/g, ''), 10);
  return Number.isFinite(parsed) ? Math.min(100, parsed) : 0;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = authService.getUser();
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useDashboard();
  const { problems, loading: problemsLoading } = useCodingProblems();
  const { data: companies, loading: companiesLoading } = useCompanyDirectory();
  const { tests, summary: mockSummary, loading: mockLoading } = useMockTests();
  const activity = useContributionActivity();
  const [learning, setLearning] = useState<any>(() => learningService.peekLearning?.() || null);
  const [learningLoading, setLearningLoading] = useState(() => !learningService.peekLearning?.());
  const [search, setSearch] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const [readNotifications, setReadNotifications] = useState<Record<string, boolean>>({});
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    learningService
      .getLearning()
      .then((data) => active && setLearning(data))
      .catch(() => active && setLearning(null))
      .finally(() => active && setLearningLoading(false));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const summaryCards = useMemo(() => {
    const stats = dashboardData?.stats || [];
    return stats.map((stat: any, index: number) => ({
      label: stat.label,
      value: stat.value,
      sub: stat.change,
      color: statColors[index % statColors.length],
      icon: statIcons[index % statIcons.length],
      bar: percentFromValue(stat.value),
    }));
  }, [dashboardData]);

  const solvedProblems = problems.filter((problem: any) => problem.solved).length;
  const bookmarkedProblems = problems.filter((problem: any) => problem.bookmarked).length;

  const topicProgress = useMemo(() => {
    const grouped = new Map<string, { total: number; solved: number }>();
    problems.forEach((problem: any) => {
      const topic = problem.topic || 'Coding';
      const current = grouped.get(topic) || { total: 0, solved: 0 };
      current.total += 1;
      if (problem.solved) current.solved += 1;
      grouped.set(topic, current);
    });
    return Array.from(grouped.entries()).slice(0, 6).map(([name, value], index) => ({
      name,
      pct: value.total ? Math.round((value.solved * 100) / value.total) : 0,
      color: accentColors[index % accentColors.length],
    }));
  }, [problems]);

  const weeklyActivity = useMemo(() => {
    const allDays = activity.weeks?.flat?.() || [];
    const today = new Date();
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      const count = Number(allDays.find((day: any) => day.key === key)?.count || 0);
      return {
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        count,
        val: Math.min(100, count * 25),
      };
    });
  }, [activity.weeks]);

  const learningCards = useMemo(() => {
    const modules = (learning?.dsaModules || []).map((module: any, index: number) => ({
      title: module.name,
      desc: `${module.lessons || 0} lessons - ${module.progress || 0}% complete`,
      accent: accentColors[index % accentColors.length],
    }));
    const subjects = (learning?.subjects || []).map((subject: any, index: number) => ({
      title: subject.name,
      desc: `${subject.topics || 0} topics - ${subject.progress || 0}% complete`,
      accent: accentColors[(index + 2) % accentColors.length],
    }));
    return [
      { title: 'DSA Course', cards: modules.slice(0, 6) },
      { title: 'Core Subjects', cards: subjects.slice(0, 6) },
    ].filter((section) => section.cards.length > 0);
  }, [learning]);

  const featuredCards = useMemo(() => {
    const cards: Array<{ title: string; sub: string; tag: string; color: string; to: string }> = [];
    const nextCourse = dashboardData?.course;
    if (nextCourse) {
      cards.push({
        title: nextCourse.title,
        sub: `Next: ${nextCourse.next}`,
        tag: `${nextCourse.progress || 0}% complete`,
        color: 'from-teal-600 to-cyan-500',
        to: '/dashboard/learn',
      });
    }
    problems.slice(0, 3).forEach((problem: any) => {
      cards.push({
        title: problem.title,
        sub: `${problem.difficulty} - ${problem.topic}`,
        tag: problem.solved ? 'Solved' : problem.bookmarked ? 'Saved' : 'Practice',
        color:
          problem.difficulty === 'Hard'
            ? 'from-red-600 to-rose-500'
            : problem.difficulty === 'Medium'
              ? 'from-orange-600 to-amber-500'
              : 'from-blue-600 to-indigo-500',
        to: '/dashboard/practice',
      });
    });
    tests.slice(0, 2).forEach((test: any) => {
      cards.push({
        title: test.title,
        sub: `${test.totalQuestions || 0} questions - ${test.durationMinutes || 0} min`,
        tag: test.difficulty,
        color: 'from-purple-600 to-violet-500',
        to: '/dashboard/mock-test',
      });
    });
    return cards.slice(0, 6);
  }, [dashboardData, problems, tests]);

  const notifications = useMemo(() => {
    const recent = dashboardData?.recentActivity || [];
    const items = recent.map((item: any, index: number) => ({
      id: `activity-${index}-${item.title}`,
      text: `${item.title} - ${item.meta}`,
      time: 'Recent',
      read: Boolean(readNotifications[`activity-${index}-${item.title}`]),
    }));
    if (mockSummary.attempted === 0 && tests.length > 0) {
      items.unshift({
        id: 'first-mock-test',
        text: `Try your first mock test: ${tests[0].title}`,
        time: 'Suggested',
        read: Boolean(readNotifications['first-mock-test']),
      });
    }
    if (bookmarkedProblems > 0) {
      items.unshift({
        id: 'saved-problems',
        text: `${bookmarkedProblems} saved coding problems are waiting for practice`,
        time: 'Saved',
        read: Boolean(readNotifications['saved-problems']),
      });
    }
    return items;
  }, [bookmarkedProblems, dashboardData, mockSummary.attempted, readNotifications, tests]);

  const filteredLearningSections = learningCards
    .map((section) => ({
      ...section,
      cards: section.cards.filter((card: any) =>
        `${section.title} ${card.title} ${card.desc}`.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((section) => section.cards.length > 0);

  const unread = notifications.filter((item) => !item.read).length;
  const readiness = dashboardData?.course?.progress ?? percentFromValue(summaryCards.at(-1)?.value);
  // Atomic reveal: every section shares one gate, so the page appears
  // all at once instead of trickling in piece by piece. Warm cache
  // (return visits) reveals instantly; cold loads show one skeleton.
  const allSettled =
    !dashboardLoading && !problemsLoading && !mockLoading && !learningLoading && !companiesLoading && !activity.loading;
  const [revealed, setRevealed] = useState(allSettled);
  useEffect(() => {
    if (allSettled) {
      setRevealed(true);
      return;
    }
    // Failsafe: never trap the user on a skeleton if one source hangs.
    const t = setTimeout(() => setRevealed(true), 10000);
    return () => clearTimeout(t);
  }, [allSettled]);

  if (!revealed) {
    return (
      <div className="min-h-full bg-[#080810] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-6 w-64 rounded-lg bg-[#0f0f1a] border border-[#1e1e30] animate-pulse mb-2" />
            <div className="h-4 w-80 rounded-lg bg-[#0f0f1a] border border-[#1e1e30] animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-52 rounded-xl bg-[#0f0f1a] border border-[#1e1e30] animate-pulse" />
            <div className="h-9 w-9 rounded-xl bg-[#0f0f1a] border border-[#1e1e30] animate-pulse" />
            <div className="h-8 w-8 rounded-full bg-[#0f0f1a] border border-[#1e1e30] animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="card-dark rounded-xl p-4">
              <div className="h-8 w-8 rounded-lg bg-[#1e1e30] animate-pulse mb-3" />
              <div className="h-7 w-20 rounded bg-[#1e1e30] animate-pulse mb-2" />
              <div className="h-3 w-24 rounded bg-[#1e1e30] animate-pulse mb-3" />
              <div className="h-1.5 rounded-full bg-[#1e1e30] animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-2 card-dark rounded-xl p-5">
            <div className="h-4 w-32 rounded bg-[#1e1e30] animate-pulse mb-4" />
            <div className="flex items-end gap-2 h-24">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex-1 rounded-t-lg bg-[#1e1e30] animate-pulse" style={{ height: `${30 + ((i * 37) % 60)}%` }} />
              ))}
            </div>
          </div>
          <div className="card-dark rounded-xl p-5">
            <div className="h-4 w-28 rounded bg-[#1e1e30] animate-pulse mb-4" />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-3 rounded bg-[#1e1e30] animate-pulse mb-2.5" />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-[#64748b] py-4">
          <span className="w-4 h-4 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
          Loading your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#080810] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold font-[Plus_Jakarta_Sans] text-white">Good morning, {user?.name || 'there'}</h1>
          <p className="text-sm text-[#64748b]">
            {dashboardError ? 'Dashboard data is unavailable right now.' : `You are ${readiness}% through your current preparation plan.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search dashboard..."
              className="bg-[#0f0f1a] border border-[#1e1e30] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-teal-500/50 w-52"
            />
          </div>
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifs((show) => !show)}
              className="relative p-2 rounded-xl border border-[#1e1e30] bg-[#0f0f1a] text-[#94a3b8] hover:text-white transition-colors"
            >
              <Bell size={16} />
              {unread > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-500 pulse-dot" />}
            </button>
            {showNotifs && (
              <div className="absolute right-0 top-11 w-80 card-dark rounded-2xl border border-[#1e1e30] shadow-2xl z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e30]">
                  <span className="text-sm font-semibold text-white">Updates</span>
                  <button
                    onClick={() => setReadNotifications(Object.fromEntries(notifications.map((item) => [item.id, true])))}
                    className="text-[10px] text-teal-400 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto hide-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-[#64748b]">No recent updates yet.</div>
                  ) : (
                    notifications.map((item) => (
                      <button
                        key={item.id}
                        className={`w-full flex items-start gap-3 px-4 py-3 border-b border-[#1e1e30] last:border-0 text-left hover:bg-[#0f0f1a] transition-colors ${!item.read ? 'bg-teal-500/3' : ''}`}
                        onClick={() => setReadNotifications((current) => ({ ...current, [item.id]: true }))}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.read ? 'bg-[#2e2e45]' : 'bg-teal-400'}`} />
                        <div className="flex-1">
                          <div className={`text-xs leading-relaxed ${item.read ? 'text-[#64748b]' : 'text-[#94a3b8]'}`}>{item.text}</div>
                          <div className="text-[10px] text-[#475569] mt-1">{item.time}</div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
            {(user?.name || user?.email || 'U').slice(0, 1).toUpperCase()}
          </div>
        </div>
      </div>

      {dashboardError && (
        <div className="card-dark rounded-xl p-4 mb-6 text-sm text-[#64748b]">Dashboard data is unavailable right now.</div>
      )}

      <div className="grid grid-cols-4 gap-3 mb-6">
        {summaryCards.map((card: any) => {
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
        <div className="col-span-2 card-dark rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-white">Weekly Activity</div>
            <span className="text-xs text-[#64748b]">{activity.totalSubmissions || 0} total actions</span>
          </div>
          <div className="flex items-end gap-2 h-24">
            {weeklyActivity.map((day) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-lg ${day.count > 0 ? 'bg-gradient-to-t from-teal-600 to-teal-400' : 'bg-[#1e1e30]'}`}
                  style={{ height: `${Math.max(day.val, 8)}%` }}
                  title={`${day.count} actions`}
                />
                <span className="text-[9px] text-[#475569]">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-dark rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-white">Skill Progress</div>
            <button className="text-xs text-teal-400 hover:underline" onClick={() => navigate('/dashboard/practice')}>Practice</button>
          </div>
          <div className="space-y-2.5">
            {topicProgress.length === 0 ? (
              <div className="text-xs text-[#64748b]">Solve problems to build skill progress.</div>
            ) : (
              topicProgress.map((skill) => (
                <div key={skill.name} className="flex items-center gap-2">
                  <span className="text-[11px] text-[#64748b] w-20 truncate">{skill.name}</span>
                  <div className="flex-1 h-1.5 bg-[#1e1e30] rounded-full overflow-hidden">
                    <div className={`h-full ${skill.color} rounded-full`} style={{ width: `${skill.pct}%` }} />
                  </div>
                  <span className="text-[11px] text-[#94a3b8] w-7 text-right">{skill.pct}%</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {featuredCards.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold font-[Plus_Jakarta_Sans] text-white">Continue Next</h2>
            <button className="text-xs text-teal-400 flex items-center gap-1 hover:underline" onClick={() => navigate('/dashboard/practice')}>
              View practice <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {featuredCards.map((card) => (
              <button
                key={`${card.title}-${card.tag}`}
                onClick={() => navigate(card.to)}
                className={`flex-shrink-0 w-56 h-36 rounded-2xl bg-gradient-to-br ${card.color} p-5 cursor-pointer relative overflow-hidden card-lift text-left`}
              >
                <div className="inline-block px-2 py-0.5 rounded-full bg-white/20 text-[10px] text-white font-medium mb-2">{card.tag}</div>
                <div className="text-sm font-bold text-white leading-tight mb-1">{card.title}</div>
                <div className="text-[10px] text-white/70">{card.sub}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredLearningSections.map((section) => (
        <div key={section.title} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold font-[Plus_Jakarta_Sans] text-white">{section.title}</h2>
            <button className="text-xs text-teal-400 flex items-center gap-1 hover:underline" onClick={() => navigate('/dashboard/learn')}>
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {section.cards.map((card: any) => (
              <div key={card.title} className="flex-shrink-0 w-52 card-dark card-lift rounded-xl overflow-hidden flex">
                <div className={`w-1 ${card.accent} flex-shrink-0 rounded-l-xl`} />
                <div className="flex-1 p-4">
                  <div className="text-sm font-semibold text-white leading-tight mb-1.5">{card.title}</div>
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

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold font-[Plus_Jakarta_Sans] text-white">Company Preparation</h2>
            <p className="text-xs text-[#64748b] mt-0.5">Published company tracks from your backend</p>
          </div>
          <button className="text-xs text-teal-400 flex items-center gap-1 hover:underline" onClick={() => navigate('/dashboard/company-prep')}>
            View all companies <ChevronRight size={12} />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
          {companies.slice(0, 8).map((company: any) => (
            <div key={company.id || company.name} className="flex-shrink-0 w-64 card-dark card-lift rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${companyColors[company.type] || 'from-blue-600 to-cyan-500'} flex items-center justify-center text-sm font-bold text-white`}>
                  {company.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{company.name}</div>
                  <div className="text-[10px] text-[#64748b]">{company.type} - {company.difficulty}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {(company.areas || []).slice(0, 5).map((area: string) => (
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
          {!companiesLoading && companies.length === 0 && (
            <div className="card-dark rounded-xl p-6 text-sm text-[#64748b]">No companies have been published yet.</div>
          )}
        </div>
      </div>

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
            <div className="text-xs text-[#64748b]">
              {solvedProblems} solved - {mockSummary.attempted || 0} mock tests attempted
            </div>
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

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, CheckCircle, Bookmark, ChevronDown } from 'lucide-react';
import { useDSASheet } from '../hooks/useDSASheet';
import { aptitudeService } from '../services/aptitudeService';

const diffColor: Record<string, string> = {
  Easy: 'text-green-400 bg-green-500/10',
  Medium: 'text-yellow-400 bg-yellow-500/10',
  Hard: 'text-red-400 bg-red-500/10',
};

type Tab = 'dsa' | 'aptitude';

function Skeleton() {
  return (
    <div className="min-h-full bg-[#080810] p-6">
      <div className="h-6 w-56 rounded-lg bg-[#0f0f1a] border border-[#1e1e30] animate-pulse mb-2" />
      <div className="h-4 w-96 rounded-lg bg-[#0f0f1a] border border-[#1e1e30] animate-pulse mb-6" />
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card-dark rounded-xl p-4 text-center">
            <div className="h-7 w-16 rounded bg-[#1e1e30] animate-pulse mx-auto mb-2" />
            <div className="h-3 w-20 rounded bg-[#1e1e30] animate-pulse mx-auto" />
          </div>
        ))}
      </div>
      <div className="card-dark rounded-xl p-4 mb-4">
        <div className="h-9 rounded-lg bg-[#1e1e30] animate-pulse" />
      </div>
      <div className="card-dark rounded-xl overflow-hidden">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 border-b border-[#1e1e30] last:border-0 bg-[#0f0f1a]/50 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function AptitudeTab() {
  const [categories, setCategories] = useState<any[]>(() => aptitudeService.peekCategories() || []);
  const [loading, setLoading] = useState(() => !aptitudeService.peekCategories());
  const [error, setError] = useState<any>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [topics, setTopics] = useState<Record<string, any[]>>({});
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Record<string, any[]>>({});
  const [answers, setAnswers] = useState<Record<string, { selected: number | null; result: any }>>({});

  useEffect(() => {
    let active = true;
    aptitudeService
      .getCategories()
      .then((data) => active && (setCategories(data || []), setError(null)))
      .catch((err) => active && setError(err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const toggleCategory = async (id: string) => {
    if (openCategory === id) {
      setOpenCategory(null);
      return;
    }
    setOpenCategory(id);
    setOpenTopic(null);
    if (!topics[id]) {
      try {
        const data = await aptitudeService.getTopics(id);
        setTopics((cur) => ({ ...cur, [id]: data || [] }));
      } catch {
        // keep category open; topics show error state below
      }
    }
  };

  const toggleTopic = async (topicId: string) => {
    if (openTopic === topicId) {
      setOpenTopic(null);
      return;
    }
    setOpenTopic(topicId);
    if (!questions[topicId]) {
      try {
        const data = await aptitudeService.getQuestions(topicId);
        setQuestions((cur) => ({ ...cur, [topicId]: data || [] }));
      } catch {
        // handled by empty state
      }
    }
  };

  const submitAnswer = async (topicId: string, question: any) => {
    const entry = answers[question.id];
    if (!entry || entry.selected === null || entry.result) return;
    try {
      const result = await aptitudeService.submitAttempt(topicId, {
        questionId: question.id,
        selectedAnswer: entry.selected,
      });
      setAnswers((cur) => ({ ...cur, [question.id]: { ...entry, result } }));
      // Refresh category progress silently.
      aptitudeService.getCategories().then(setCategories).catch(() => {});
    } catch {
      // Offline or unreachable: grade locally only when this copy of the
      // question still carries the answer key, otherwise record neutrally.
      const fallback =
        question.correctAnswer === undefined || question.correctAnswer === null
          ? { correct: null, offline: true }
          : { correct: entry.selected === question.correctAnswer };
      setAnswers((cur) => ({
        ...cur,
        [question.id]: { ...entry, result: fallback },
      }));
    }
  };

  if (loading) return <Skeleton />;
  if (error && categories.length === 0) {
    return <div className="card-dark rounded-xl p-8 text-center text-sm text-[#64748b]">Could not load aptitude content from the server.</div>;
  }

  return (
    <div className="space-y-3">
      {categories.map((cat: any) => (
        <div key={cat.id} className="card-dark rounded-xl overflow-hidden">
          <button onClick={() => toggleCategory(cat.id)} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#0f0f1a] transition-colors text-left">
            <span className="text-lg">{cat.icon || '📘'}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{cat.name}</div>
              <div className="text-[11px] text-[#64748b] truncate">{cat.description}</div>
            </div>
            <div className="hidden sm:block w-28 h-1.5 bg-[#1e1e30] rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: `${cat.progress || 0}%` }} />
            </div>
            <span className="text-[11px] text-[#94a3b8] w-10 text-right">{cat.progress || 0}%</span>
            <ChevronDown size={14} className={`text-[#64748b] transition-transform ${openCategory === cat.id ? 'rotate-180' : ''}`} />
          </button>
          {openCategory === cat.id && (
            <div className="border-t border-[#1e1e30] px-4 py-3 space-y-2 bg-[#0a0a14]">
              {(topics[cat.id] || []).map((topic: any) => (
                <div key={topic.id} className="bg-[#0f0f1a] rounded-lg border border-[#1e1e30] overflow-hidden">
                  <button onClick={() => toggleTopic(topic.id)} className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-[#14141f] transition-colors">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-white">{topic.name}</div>
                      <div className="text-[10px] text-[#64748b]">{topic.questions} questions · {topic.difficulty}</div>
                    </div>
                    <span className="text-[10px] text-teal-400">{topic.progress || 0}%</span>
                    <ChevronDown size={12} className={`text-[#64748b] transition-transform ${openTopic === topic.id ? 'rotate-180' : ''}`} />
                  </button>
                  {openTopic === topic.id && (
                    <div className="border-t border-[#1e1e30] p-3 space-y-3">
                      {(questions[topic.id] || []).map((q: any, qi: number) => {
                        const entry = answers[q.id];
                        return (
                          <div key={q.id} className="bg-[#080810] rounded-lg p-3 border border-[#1e1e30]">
                            <div className="text-xs text-white font-medium mb-2">Q{qi + 1}. {q.question}</div>
                            <div className="grid grid-cols-2 gap-1.5 mb-2">
                              {(q.options || []).map((opt: string, oi: number) => (
                                <button
                                  key={oi}
                                  disabled={Boolean(entry?.result)}
                                  onClick={() => setAnswers((cur) => ({ ...cur, [q.id]: { selected: oi, result: null } }))}
                                  className={`text-left text-[11px] px-2.5 py-1.5 rounded-lg border transition-all ${
                                    entry?.selected === oi
                                      ? 'border-teal-500/50 bg-teal-500/10 text-teal-300'
                                      : 'border-[#1e1e30] text-[#94a3b8] hover:border-[#2e2e45]'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                            {!entry?.result ? (
                              <button
                                onClick={() => submitAnswer(topic.id, q)}
                                disabled={entry?.selected === null || entry?.selected === undefined}
                                className="text-[11px] font-semibold text-teal-400 hover:text-teal-300 disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                Check answer
                              </button>
                            ) : (
                              <div className={`text-[11px] font-medium ${entry.result.correct === false ? 'text-red-400' : 'text-teal-400'}`}>
                                {entry.result.correct === true && '✓ Correct'}
                                {entry.result.correct === false && '✗ Wrong — try the next one'}
                                {entry.result.correct === null && '✓ Saved — answer will be graded when you are back online'}
                                {(entry.result.explanation || q.explanation) && (
                                  <span className="block text-[#64748b] font-normal mt-1">
                                    {entry.result.explanation || q.explanation}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {(questions[topic.id] || []).length === 0 && (
                        <div className="text-[11px] text-[#475569] text-center py-3">No questions in this topic yet.</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {(topics[cat.id] || []).length === 0 && (
                <div className="text-[11px] text-[#475569] text-center py-2">Loading topics...</div>
              )}
            </div>
          )}
        </div>
      ))}
      {categories.length === 0 && (
        <div className="card-dark rounded-xl p-8 text-center text-sm text-[#475569]">No aptitude categories published yet.</div>
      )}
    </div>
  );
}

export default function Practice() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('dsa');
  const [search, setSearch] = useState('');
  const dsa = useDSASheet();

  const dsaFiltered = useMemo(() => {
    const q = search.toLowerCase();
    return dsa.problems.filter((p: any) => `${p.title} ${p.pattern}`.toLowerCase().includes(q));
  }, [dsa.problems, search]);

  // Atomic reveal per active tab: whole page appears at once, never staggered.
  const tabReady = tab === 'dsa' ? !dsa.loading : true;
  const [revealed, setRevealed] = useState(tabReady);
  useEffect(() => {
    if (tabReady) {
      setRevealed(true);
      return;
    }
    setRevealed(false);
    const t = setTimeout(() => setRevealed(true), 10000);
    return () => clearTimeout(t);
  }, [tabReady, tab]);

  if (!revealed) return <Skeleton />;

  return (
    <div className="min-h-full bg-[#080810] p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold font-[Plus_Jakarta_Sans] text-white mb-1">Practice Arena</h1>
        <p className="text-sm text-[#64748b]">DSA sheet and aptitude — all live from your backend.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-6">
        {(
          [
            { key: 'dsa', label: `DSA Sheet (${dsa.problems.length})` },
            { key: 'aptitude', label: 'Aptitude' },
          ] as { key: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              tab === t.key
                ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30'
                : 'text-[#64748b] border border-[#1e1e30] hover:text-[#94a3b8]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'dsa' && (
        <>
          <div className="card-dark rounded-xl p-4 mb-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-white">DSA Sheet Progress</span>
                <span className="text-xs text-teal-400 font-semibold">{dsa.progress.solved}/{dsa.progress.total} · {dsa.progress.percentage}%</span>
              </div>
              <div className="h-2 bg-[#1e1e30] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transition-all" style={{ width: `${dsa.progress.percentage}%` }} />
              </div>
            </div>
            <div className="relative w-56">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search DSA problems..."
                className="w-full bg-[#0f0f1a] border border-[#1e1e30] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-teal-500/50"
              />
            </div>
          </div>
          <div className="card-dark rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 text-[10px] font-semibold text-[#475569] uppercase tracking-widest px-4 py-3 border-b border-[#1e1e30]">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Problem</div>
              <div className="col-span-2">Pattern</div>
              <div className="col-span-2">Difficulty</div>
              <div className="col-span-2">Status</div>
            </div>
            {dsaFiltered.map((p: any) => (
              <div
                key={p.id}
                onClick={() => navigate(`/dashboard/practice/${p.id}`)}
                className="grid grid-cols-12 items-center px-4 py-3 border-b border-[#1e1e30] last:border-0 hover:bg-[#0f0f1a] cursor-pointer transition-colors group"
              >
                <div className="col-span-1">
                  <button onClick={(e) => { e.stopPropagation(); dsa.updateStatus(p.id, !p.solved); }} title={p.solved ? 'Mark unsolved' : 'Mark solved'}>
                    {p.solved ? <CheckCircle size={13} className="text-teal-500" /> : <span className="text-xs text-[#475569]">{p.number}</span>}
                  </button>
                </div>
                <div className="col-span-5 text-sm text-[#94a3b8] group-hover:text-white transition-colors truncate pr-4">{p.title}</div>
                <div className="col-span-2 text-xs text-[#64748b]">{p.pattern}</div>
                <div className="col-span-2">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${diffColor[p.difficulty] || 'text-[#94a3b8] bg-[#1e1e30]'}`}>{p.difficulty}</span>
                </div>
                <div className="col-span-2 flex items-center gap-2 text-xs text-[#475569]">
                  <span>{p.solved ? 'Solved' : p.bookmarked ? 'Saved' : 'Not started'}</span>
                  <button onClick={(e) => { e.stopPropagation(); dsa.toggleBookmark(p.id); }} title={p.bookmarked ? 'Unsave' : 'Save'}>
                    <Bookmark size={12} className={p.bookmarked ? 'text-yellow-400 fill-current' : 'text-[#475569] hover:text-[#94a3b8]'} />
                  </button>
                </div>
              </div>
            ))}
            {(dsa.loading || dsa.error || dsaFiltered.length === 0) && (
              <div className="py-12 text-center text-sm text-[#475569]">
                {dsa.loading ? 'Loading DSA sheet...' : dsa.error ? 'Could not load the DSA sheet.' : 'No DSA problems match your filters.'}
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'aptitude' && <AptitudeTab />}
    </div>
  );
}

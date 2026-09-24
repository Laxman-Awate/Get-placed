import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, Play, BookOpen, CheckCircle, ListChecks } from 'lucide-react';
import { learningService } from '../services/learningService';
import { dsaService } from '../services/dsaService';

const colorMap: Record<string, string> = {
  teal: 'text-teal-400 bg-teal-500/10',
  blue: 'text-blue-400 bg-blue-500/10',
  purple: 'text-purple-400 bg-purple-500/10',
  orange: 'text-orange-400 bg-orange-500/10',
};

const diffColor: Record<string, string> = {
  Easy: 'text-green-400 bg-green-500/10',
  Medium: 'text-yellow-400 bg-yellow-500/10',
  Hard: 'text-red-400 bg-red-500/10',
};

export default function Learn() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(() => learningService.peekLearning?.() || null);
  const [loading, setLoading] = useState(() => !learningService.peekLearning?.());
  const [error, setError] = useState<any>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [tab, setTab] = useState<'concept' | 'practice' | 'test'>('concept');
  const [dsaProblems, setDsaProblems] = useState<any[]>([]);
  const [dsaLoading, setDsaLoading] = useState(false);

  useEffect(() => {
    let active = true;
    learningService
      .getLearning()
      .then((res) => active && (setData(res), setError(null)))
      .catch((err) => active && setError(err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const modules: any[] = data?.dsaModules || [];
  const topics: any[] = data?.topics || [];
  const lessons: any[] = data?.dsaLessons || [];
  const activeModule = modules.find((m: any) => m.id === activeModuleId) || modules[0];

  useEffect(() => {
    if (!activeModuleId && modules.length > 0) setActiveModuleId(modules[0].id);
  }, [activeModuleId, modules]);

  useEffect(() => {
    if (tab !== 'practice' || dsaProblems.length > 0 || dsaLoading) return;
    let active = true;
    setDsaLoading(true);
    dsaService
      .getDSAProblems()
      .then((items) => active && setDsaProblems(items || []))
      .catch(() => active && setDsaProblems([]))
      .finally(() => active && setDsaLoading(false));
    return () => {
      active = false;
    };
  }, [tab, dsaProblems.length, dsaLoading]);

  const topicsDone = topics.filter((t: any) => t.complete).length;

  const toggleTopic = async (topic: any) => {
    const next = !topic.complete;
    setData((cur: any) =>
      cur && { ...cur, topics: cur.topics.map((t: any) => (t.id === topic.id ? { ...t, complete: next } : t)) }
    );
    try {
      await learningService.updateProgress({ contentType: 'topic', contentId: topic.id, complete: next });
      const fresh = await learningService.getLearning();
      setData(fresh);
    } catch {
      setData((cur: any) =>
        cur && { ...cur, topics: cur.topics.map((t: any) => (t.id === topic.id ? { ...t, complete: !next } : t)) }
      );
    }
  };

  const toggleLesson = async (lesson: any) => {
    const next = !lesson.complete;
    setData((cur: any) =>
      cur && { ...cur, dsaLessons: cur.dsaLessons.map((l: any) => (l.name === lesson.name ? { ...l, complete: next } : l)) }
    );
    try {
      await learningService.updateProgress({ contentType: 'lesson', contentId: lesson.name, complete: next });
      const fresh = await learningService.getLearning();
      setData(fresh);
    } catch {
      setData((cur: any) =>
        cur && { ...cur, dsaLessons: cur.dsaLessons.map((l: any) => (l.name === lesson.name ? { ...l, complete: !next } : l)) }
      );
    }
  };

  const toggleDsaSolved = async (problem: any) => {
    try {
      const updated = await dsaService.updateProblemStatus(problem.id, !problem.solved);
      setDsaProblems((cur) => cur.map((p) => (p.id === problem.id ? { ...p, ...updated } : p)));
    } catch {
      // leave state untouched on failure
    }
  };

  const lessonsDone = useMemo(() => lessons.filter((l: any) => l.complete).length, [lessons]);

  if (loading) {
    return (
      <div className="min-h-full bg-[#080810] flex">
        <div className="w-56 border-r border-[#1e1e30] p-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 rounded-lg bg-[#0f0f1a] border border-[#1e1e30] animate-pulse mb-1" />
          ))}
        </div>
        <div className="flex-1 p-6">
          <div className="h-6 w-64 rounded-lg bg-[#0f0f1a] border border-[#1e1e30] animate-pulse mb-2" />
          <div className="h-4 w-96 rounded-lg bg-[#0f0f1a] border border-[#1e1e30] animate-pulse mb-5" />
          <div className="card-dark rounded-xl p-4 mb-5">
            <div className="h-2 rounded-full bg-[#1e1e30] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-full bg-[#080810] p-6">
        <div className="card-dark rounded-xl p-8 text-center text-sm text-[#64748b]">
          Could not load learning content from the backend.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#080810] flex">
      {/* Module sidebar — live DSA modules from /api/learning */}
      <div className="w-56 border-r border-[#1e1e30] p-4 sticky top-0 h-screen overflow-y-auto hide-scrollbar">
        <div className="text-xs font-semibold text-[#94a3b8] uppercase tracking-widest mb-3">DSA Course</div>
        <div className="space-y-1">
          {modules.map((m: any) => {
            const isActive = activeModule?.id === m.id;
            const done = (m.progress || 0) >= 100;
            return (
              <button
                key={m.id}
                onClick={() => setActiveModuleId(m.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all text-xs ${
                  isActive
                    ? 'bg-teal-500/12 text-teal-400 border border-teal-500/20'
                    : done
                    ? 'text-[#64748b] hover:text-[#94a3b8]'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                {done ? (
                  <CheckCircle size={13} className="text-teal-500 flex-shrink-0" />
                ) : (
                  <div className={`w-3 h-3 rounded-full border flex-shrink-0 ${isActive ? 'border-teal-500 bg-teal-500/30' : 'border-[#2e2e45]'}`} />
                )}
                <span className="truncate">{m.name}</span>
                {isActive && <span className="ml-auto text-[9px] text-teal-400 font-medium">Active</span>}
              </button>
            );
          })}
          {modules.length === 0 && (
            <div className="text-xs text-[#475569] px-1">No modules published yet.</div>
          )}
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
            <span>DSA</span><ChevronRight size={10} /><span>{activeModule?.name || 'Course'}</span>
          </div>
          <h1 className="text-xl font-bold font-[Plus_Jakarta_Sans] text-white mb-1">{activeModule?.name || 'Learn'}</h1>
          <p className="text-sm text-[#64748b]">
            {activeModule ? `${activeModule.level || ''} · ${activeModule.lessons || 0} lessons`.trim() : 'Structured lessons with progress tracking'}
          </p>
        </div>

        {/* Progress — real topic completion */}
        <div className="card-dark rounded-xl p-4 mb-5 flex items-center gap-4">
          <div className="flex-1 h-1.5 bg-[#1e1e30] rounded-full">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all"
              style={{ width: `${topics.length ? Math.round((topicsDone * 100) / topics.length) : 0}%` }}
            />
          </div>
          <span className="text-xs text-[#64748b]">{topicsDone} / {topics.length} topics done</span>
          <button
            onClick={() => navigate('/dashboard/practice')}
            className="flex items-center gap-1.5 text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            <Play size={11} />Practice
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-5 border-b border-[#1e1e30] pb-0">
          {(['concept', 'practice', 'test'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-all border-b-2 -mb-px ${
                tab === t
                  ? 'text-teal-400 border-teal-400'
                  : 'text-[#64748b] border-transparent hover:text-[#94a3b8]'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'concept' && (
          <div className="space-y-4 max-w-2xl">
            <div className="card-dark rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg text-teal-400 bg-teal-500/10 flex items-center justify-center">
                  <BookOpen size={13} />
                </div>
                <span className="text-sm font-semibold text-white">Module Overview</span>
              </div>
              <div className="text-sm text-[#94a3b8] leading-relaxed">
                {activeModule?.name} · {activeModule?.level} level · {activeModule?.lessons || 0} lessons · {lessonsDone}/{lessons.length} lessons complete
              </div>
            </div>

            <div className="card-dark rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg text-blue-400 bg-blue-500/10 flex items-center justify-center">
                  <ListChecks size={13} />
                </div>
                <span className="text-sm font-semibold text-white">Lessons</span>
              </div>
              <div className="space-y-2">
                {lessons.map((lesson: any) => (
                  <button
                    key={lesson.name}
                    onClick={() => toggleLesson(lesson)}
                    className="w-full flex items-center gap-2 p-3 rounded-lg bg-[#0f0f1a] hover:bg-[#17172a] transition-colors text-left"
                  >
                    {lesson.complete ? (
                      <CheckCircle size={13} className="text-teal-500 flex-shrink-0" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-[#2e2e45] flex-shrink-0" />
                    )}
                    <span className="text-sm text-[#94a3b8]">{lesson.name}</span>
                    {lesson.current && !lesson.complete && (
                      <span className="ml-auto text-[9px] text-teal-400 font-medium">Up next</span>
                    )}
                  </button>
                ))}
                {lessons.length === 0 && (
                  <div className="text-xs text-[#475569]">No lessons published for this module yet.</div>
                )}
              </div>
            </div>

            <div className="card-dark rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg text-purple-400 bg-purple-500/10 flex items-center justify-center">
                  <ListChecks size={13} />
                </div>
                <span className="text-sm font-semibold text-white">Core Topics</span>
              </div>
              <div className="space-y-2">
                {topics.map((topic: any) => (
                  <button
                    key={topic.id}
                    onClick={() => toggleTopic(topic)}
                    className="w-full flex items-center gap-2 p-3 rounded-lg bg-[#0f0f1a] hover:bg-[#17172a] transition-colors text-left"
                  >
                    {topic.complete ? (
                      <CheckCircle size={13} className="text-teal-500 flex-shrink-0" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-[#2e2e45] flex-shrink-0" />
                    )}
                    <span className="text-sm text-[#94a3b8]">{topic.name}</span>
                    <span className="ml-auto text-[10px] text-[#475569]">{topic.minutes} min</span>
                  </button>
                ))}
                {topics.length === 0 && (
                  <div className="text-xs text-[#475569]">No topics published yet.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === 'practice' && (
          <div className="max-w-2xl">
            <div className="card-dark rounded-xl p-5 mb-4">
              <h3 className="font-semibold text-white mb-3">Practice Problems</h3>
              {dsaLoading ? (
                <div className="text-xs text-[#64748b]">Loading problems...</div>
              ) : (
                <div className="space-y-2">
                  {dsaProblems.slice(0, 8).map((p: any) => (
                    <div
                      key={p.id}
                      onClick={() => navigate('/dashboard/coding')}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#0f0f1a] hover:bg-[#17172a] cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDsaSolved(p);
                          }}
                          title={p.solved ? 'Mark unsolved' : 'Mark solved'}
                        >
                          {p.solved ? (
                            <CheckCircle size={13} className="text-teal-500" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-[#2e2e45]" />
                          )}
                        </button>
                        <span className="text-sm text-[#94a3b8] group-hover:text-white transition-colors">{p.title}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${diffColor[p.difficulty] || 'text-[#94a3b8] bg-[#1e1e30]'}`}>{p.difficulty}</span>
                    </div>
                  ))}
                  {dsaProblems.length === 0 && (
                    <div className="text-xs text-[#475569]">No practice problems published yet.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'test' && (
          <div className="max-w-lg">
            <div className="card-dark rounded-xl p-8 text-center">
              <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <BookOpen size={24} className="text-purple-400" />
              </div>
              <h3 className="font-bold text-white mb-2">Test yourself on {activeModule?.name || 'this module'}</h3>
              <p className="text-sm text-[#64748b] mb-6">Timed mock tests with real scoring live under Mock Tests.</p>
              <button
                onClick={() => navigate('/dashboard/mock-test')}
                className="bg-purple-500 hover:bg-purple-400 text-white font-semibold px-6 py-2.5 rounded-xl transition-all"
              >
                Browse Mock Tests →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Bookmark, CheckCircle, ChevronLeft, Play, RotateCcw, Send, XCircle } from 'lucide-react';
import { Editor, loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import editorWorker from '../../node_modules/monaco-editor/esm/vs/editor/editor.worker.js?worker';
import { dsaService } from '../services/dsaService';
import { codeExecutionService } from '../services/codeExecutionService';

// Bundle Monaco locally (no CDN): keeps syntax highlighting working offline
// and inside sandboxed networks. Basic languages (python/js/java/c/cpp)
// are all served by the editor worker.
loader.config({ monaco });
(self as any).MonacoEnvironment = { getWorker: () => new editorWorker() };

const languages = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
  { id: 'c', label: 'C' },
];

// Starters read the test-case input from stdin and print the answer —
// that is the contract the judge checks (stdout vs expected output).
const starterFor = (lang: string, title: string) => {
  switch (lang) {
    case 'python':
      return `# ${title}\n# Read stdin, print the answer to stdout\nimport sys\n\ndef solve(lines):\n    # TODO: parse \`lines\` as described, return the answer\n    return ""\n\ndef main():\n    data = sys.stdin.read().splitlines()\n    print(solve(data))\n\nif __name__ == "__main__":\n    main()\n`;
    case 'javascript':
      return `// ${title}\n// Read stdin, print the answer to stdout\nconst fs = require('fs');\n\nfunction solve(lines) {\n  // TODO: parse \`lines\` as described, return the answer\n  return '';\n}\n\nfunction main() {\n  const data = fs.readFileSync(0, 'utf8').split('\\n').map((l) => l.replace(/\\r$/, ''));\n  console.log(solve(data));\n}\n\nmain();\n`;
    case 'java':
      return `// ${title}\n// Read stdin, print the answer to stdout\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<String> lines = new ArrayList<>();\n        while (sc.hasNextLine()) lines.add(sc.nextLine());\n        // TODO: parse \`lines\` as described, print the answer\n        System.out.println("");\n    }\n}\n`;
    case 'cpp':
      return `// ${title}\n// Read stdin, print the answer to stdout\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    string line;\n    vector<string> lines;\n    while (getline(cin, line)) lines.push_back(line);\n    // TODO: parse \`lines\` as described, print the answer\n    cout << "" << "\\n";\n    return 0;\n}\n`;
    default:
      return `/* ${title} */\n/* Read stdin, print the answer to stdout */\n#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char line[4096];\n    /* TODO: parse stdin lines as described, print the answer */\n    while (fgets(line, sizeof(line), stdin)) {}\n    printf("\\n");\n    return 0;\n}\n`;
  }
};

type Submission = { time: string; language: string; status: string; output: string };

function loadSubmissions(problemId: string): Submission[] {
  try {
    return JSON.parse(window.localStorage.getItem(`placepro.submissions.${problemId}`) || '[]');
  } catch {
    return [];
  }
}

const diffColor: Record<string, string> = {
  Easy: 'text-green-400 bg-green-500/10',
  Medium: 'text-yellow-400 bg-yellow-500/10',
  Hard: 'text-red-400 bg-red-500/10',
};

export default function Problem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leftTab, setLeftTab] = useState<'description' | 'submissions'>('description');
  const [lang, setLang] = useState('python');
  const [code, setCode] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>(() => (id ? loadSubmissions(id) : []));
  const [verdict, setVerdict] = useState<string | null>(null);
  const [verdictOk, setVerdictOk] = useState<boolean | null>(null);
  const [failedDetail, setFailedDetail] = useState<any>(null);
  const [caseResults, setCaseResults] = useState<Record<number, { passed: boolean; actual?: string }>>({});
  const [running, setRunning] = useState(false);
  const [testCases, setTestCases] = useState<{ samples: any[]; hidden: any[]; hiddenCount: number } | null>(null);
  const [bottomTab, setBottomTab] = useState<'tests' | 'result'>('tests');

  useEffect(() => {
    let active = true;
    setLoading(true);
    dsaService
      .getDSAProblemById(id as string)
      .then((p) => active && (setProblem(p), setError(null)))
      .catch(() => active && setError('Could not load this problem from the backend.'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  // Per-problem, per-language draft: restore saved code or starter template.
  useEffect(() => {
    if (!problem) return;
    const saved = window.localStorage.getItem(`placepro.draft.${problem.id}.${lang}`);
    setCode(saved ?? starterFor(lang, problem.title));
    setVerdict(null);
  }, [problem, lang]);

  useEffect(() => {
    if (!problem || !code) return;
    const t = setTimeout(() => {
      window.localStorage.setItem(`placepro.draft.${problem.id}.${lang}`, code);
    }, 500);
    return () => clearTimeout(t);
  }, [code, lang, problem]);

  const monacoLang = lang === 'cpp' ? 'cpp' : lang;

  useEffect(() => {
    if (!id) return;
    dsaService
      .getTestCases(id as string)
      .then((tc) => setTestCases(tc))
      .catch(() => setTestCases(null));
  }, [id]);

  const recordSubmission = (status: string, output: string) => {
    if (!id) return;
    const entry = { time: new Date().toISOString(), language: lang, status, output };
    setSubmissions((cur) => {
      const next = [entry, ...cur].slice(0, 20);
      window.localStorage.setItem(`placepro.submissions.${id}`, JSON.stringify(next));
      return next;
    });
  };

  const onRun = async () => {
    if (!code.trim() || running) return;
    setVerdict(null);
    setVerdictOk(null);
    setFailedDetail(null);
    setRunning(true);
    setBottomTab('tests');
    try {
      const res = await codeExecutionService.submit({ problemId: id, language: lang, source: code, samplesOnly: true });
      const map: Record<number, { passed: boolean; actual?: string }> = {};
      (res.results || []).forEach((r: any) => {
        map[r.order] = { passed: r.passed, actual: r.actual };
      });
      setCaseResults(map);
      const ok = res.passed === res.total && res.total > 0;
      setVerdictOk(ok);
      setVerdict(ok ? `All ${res.total} sample cases passed — submit to check hidden cases.` : `${res.passed}/${res.total} sample cases passed.`);
    } catch (e: any) {
      const detail = e.message || 'execution engine unreachable.';
      setVerdictOk(false);
      setVerdict(`Run failed${e.status ? ` (${e.status})` : ''}: ${detail}`);
    } finally {
      setRunning(false);
    }
  };

  const onSubmit = async () => {
    if (!code.trim() || running) return;
    setVerdict(null);
    setVerdictOk(null);
    setFailedDetail(null);
    setRunning(true);
    try {
      const res = await codeExecutionService.submit({ problemId: id, language: lang, source: code, samplesOnly: false });
      const map: Record<number, { passed: boolean; actual?: string }> = {};
      (res.results || []).forEach((r: any) => {
        map[r.order] = { passed: r.passed, actual: r.actual };
      });
      setCaseResults(map);
      if (res.status === 'accepted') {
        setVerdictOk(true);
        setVerdict(`Accepted — all ${res.total} test cases passed.`);
        recordSubmission('Accepted', `Passed ${res.passed}/${res.total}`);
        if (!problem?.solved) {
          try {
            const updated = await dsaService.updateProblemStatus(problem.id, true);
            setProblem((cur: any) => (cur ? { ...cur, ...updated } : cur));
          } catch {
            setVerdict(`Accepted — all ${res.total} test cases passed. (Solved state could not be saved: offline?)`);
          }
        }
      } else {
        const failed = (res.results || []).find((r: any) => !r.passed);
        setVerdictOk(false);
        setVerdict(`Wrong Answer — passed ${res.passed}/${res.total}.`);
        setFailedDetail(failed || null);
        recordSubmission('Wrong Answer', `Passed ${res.passed}/${res.total}`);
        setBottomTab('tests');
      }
    } catch (e: any) {
      const detail = e.message || 'execution engine unreachable.';
      setVerdictOk(false);
      setVerdict(`Submit failed${e.status ? ` (${e.status})` : ''}: ${detail}`);
    } finally {
      setRunning(false);
    }
  };

  const toggleBookmark = async () => {
    if (!problem) return;
    try {
      const updated = await dsaService.toggleBookmark(problem.id);
      setProblem((cur: any) => (cur ? { ...cur, ...updated } : cur));
    } catch {
      // ignore — stays as-is
    }
  };

  if (loading) {
    return (
      <div className="h-full flex bg-[#080810]">
        <div className="w-[42%] border-r border-[#1e1e30] p-5 space-y-3">
          <div className="h-6 w-48 rounded bg-[#1e1e30] animate-pulse" />
          <div className="h-4 w-full rounded bg-[#1e1e30] animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-[#1e1e30] animate-pulse" />
        </div>
        <div className="flex-1 p-5">
          <div className="h-full rounded-xl bg-[#0f0f1a] animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 bg-[#080810] text-sm text-[#64748b]">
        <div>{error || 'Problem not found.'}</div>
        <button onClick={() => navigate('/dashboard/practice')} className="flex items-center gap-1.5 text-teal-400 hover:text-teal-300 text-xs font-semibold">
          <ArrowLeft size={12} />Back to Practice
        </button>
      </div>
    );
  }

  const examples: string[] = Array.isArray(problem.examples) ? problem.examples : [];

  return (
    <div className="h-full flex bg-[#080810]">
      {/* Left: problem */}
      <div className="w-[42%] border-r border-[#1e1e30] flex flex-col min-w-0">
        <div className="flex items-center gap-2 px-4 pt-3">
          <button onClick={() => navigate('/dashboard/practice')} title="Back to Practice" className="text-[#64748b] hover:text-white transition-colors">
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-1 border-b border-[#1e1e30]">
            {(['description', 'submissions'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setLeftTab(t)}
                className={`px-3 py-2 text-xs font-medium capitalize transition-all border-b-2 -mb-px ${leftTab === t ? 'text-teal-400 border-teal-400' : 'text-[#64748b] border-transparent hover:text-[#94a3b8]'}`}
              >
                {t}{t === 'submissions' && submissions.length > 0 ? ` (${submissions.length})` : ''}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <button onClick={toggleBookmark} title={problem.bookmarked ? 'Unsave' : 'Save'} className="p-1.5 transition-colors">
            <Bookmark size={14} className={problem.bookmarked ? 'text-yellow-400 fill-current' : 'text-[#475569] hover:text-[#94a3b8]'} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 hide-scrollbar">
          {leftTab === 'description' && (
            <>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${diffColor[problem.difficulty] || 'text-[#94a3b8] bg-[#1e1e30]'}`}>{problem.difficulty}</span>
                <span className="text-xs text-[#64748b]">#{problem.number}{problem.topicId ? ` · ${problem.topicId}` : ''}{problem.pattern ? ` · ${problem.pattern}` : ''}</span>
                {problem.solved && (
                  <span className="flex items-center gap-1 text-xs text-teal-400 font-medium"><CheckCircle size={11} />Solved</span>
                )}
              </div>
              <h2 className="text-lg font-bold font-[Plus_Jakarta_Sans] text-white mb-3">{problem.title}</h2>
              <p className="text-sm text-[#94a3b8] leading-relaxed mb-5">{problem.description}</p>

              {examples.length > 0 && (
                <div className="space-y-3 mb-5">
                  {examples.map((ex, i) => (
                    <div key={i} className="bg-[#0f0f1a] rounded-xl p-4">
                      <div className="text-xs font-semibold text-[#94a3b8] mb-2">Example {i + 1}</div>
                      <div className="font-mono text-xs text-[#94a3b8] whitespace-pre-wrap">{ex}</div>
                    </div>
                  ))}
                </div>
              )}

              {problem.constraints && (
                <div className="mb-5">
                  <div className="text-xs font-semibold text-[#94a3b8] mb-2">Constraints</div>
                  <div className="bg-[#0f0f1a] rounded-xl p-4 font-mono text-xs text-[#64748b] whitespace-pre-wrap">
                    {problem.constraints}
                  </div>
                </div>
              )}
            </>
          )}

          {leftTab === 'submissions' && (
            <div className="space-y-2 pt-1">
              {submissions.length === 0 && (
                <div className="text-xs text-[#475569] text-center py-8">No submissions yet — run or submit your solution.</div>
              )}
              {submissions.map((s, i) => (
                <div key={i} className="bg-[#0f0f1a] rounded-xl p-4 border border-[#1e1e30]">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold ${s.status === 'Error' ? 'text-red-400' : 'text-teal-400'}`}>{s.status}</span>
                    <span className="text-[10px] text-[#475569]">{s.language} · {new Date(s.time).toLocaleString()}</span>
                  </div>
                  <div className="font-mono text-[11px] text-[#64748b] whitespace-pre-wrap max-h-24 overflow-y-auto hide-scrollbar">{s.output}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: editor */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1e1e30] bg-[#0a0a14]">
          <div className="flex gap-1 flex-wrap">
            {languages.map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${lang === l.id ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30' : 'text-[#64748b] hover:text-[#94a3b8]'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCode(starterFor(lang, problem.title))} title="Reset to starter code" className="flex items-center gap-1.5 text-xs text-[#64748b] hover:text-[#94a3b8] transition-colors">
              <RotateCcw size={12} />Reset
            </button>
            <button
              onClick={onRun}
              disabled={running}
              className="flex items-center gap-1.5 text-xs bg-[#1e1e30] hover:bg-[#2e2e45] text-[#94a3b8] px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
            >
              <Play size={11} />{running ? 'Running...' : 'Run'}
            </button>
            <button
              onClick={onSubmit}
              disabled={running}
              className="flex items-center gap-1.5 text-xs bg-teal-500 hover:bg-teal-400 text-white px-3 py-1.5 rounded-lg transition-all font-semibold disabled:opacity-50"
            >
              <Send size={11} />Submit
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
          <Editor
            height="100%"
            language={monacoLang}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value ?? '')}
            loading={<div className="h-full flex items-center justify-center text-xs text-[#64748b]">Loading editor...</div>}
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              insertSpaces: true,
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              padding: { top: 12 },
              scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
            }}
          />
        </div>

        {/* Testcases / Result */}
        <div className="border-t border-[#1e1e30] bg-[#0a0a14] max-h-60 flex flex-col">
          <div className="flex items-center gap-1 px-4 pt-2">
            {(['tests', 'result'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setBottomTab(t)}
                className={`px-3 py-1.5 text-xs font-semibold transition-all border-b-2 -mb-px ${bottomTab === t ? 'text-teal-400 border-teal-400' : 'text-[#64748b] border-transparent hover:text-[#94a3b8]'}`}
              >
                {t === 'tests' ? `Testcases${testCases ? ` (${testCases.samples.length + testCases.hiddenCount})` : ''}` : 'Result'}
              </button>
            ))}
            <div className="flex-1" />
            {verdict && (
              <span className={`text-[11px] font-medium ${verdictOk ? 'text-teal-400' : 'text-red-400'}`}>{verdict}</span>
            )}
          </div>
          <div className="overflow-y-auto hide-scrollbar">
            {bottomTab === 'tests' ? (
              <div className="px-4 py-2">
                {!testCases ? (
                  <div className="text-[11px] text-[#475569] py-2">Loading test cases...</div>
                ) : (
                  <>
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                      {testCases.samples.map((tc: any, i: number) => {
                        const r = caseResults[tc.order];
                        return (
                          <div key={tc.id ?? i} className={`flex-shrink-0 w-64 bg-[#0f0f1a] rounded-xl p-3 border ${r ? (r.passed ? 'border-teal-500/40' : 'border-red-500/40') : 'border-[#1e1e30]'}`}>
                            <div className="flex items-center gap-1.5 mb-1.5">
                              {r && (r.passed
                                ? <CheckCircle size={11} className="text-teal-500" />
                                : <XCircle size={11} className="text-red-500" />)}
                              <span className="text-[10px] font-semibold text-[#94a3b8]">Case {i + 1}</span>
                            </div>
                            <div className="font-mono text-[10px] text-[#64748b] space-y-1">
                              <div><span className="text-[#475569]">Input:</span> {tc.input}</div>
                              <div><span className="text-teal-400">Expected:</span> {tc.expected}</div>
                              {r?.actual !== undefined && (
                                <div><span className={r.passed ? 'text-teal-400' : 'text-red-400'}>Actual:</span> {String(r.actual).slice(0, 200) || '(empty)'}</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {testCases.samples.length === 0 && (
                        <div className="text-[11px] text-[#475569] py-2">No sample cases for this problem yet.</div>
                      )}
                    </div>
                    {testCases.hiddenCount > 0 && (
                      <div className="text-[10px] text-[#475569] px-1 py-1.5">
                        + {testCases.hiddenCount} hidden test case{testCases.hiddenCount === 1 ? '' : 's'} evaluated on submit
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="px-4 py-2">
                {!verdict && !failedDetail && (
                  <div className="text-[11px] text-[#475569] py-2">Run or submit your code to see the verdict here.</div>
                )}
                {failedDetail && (
                  <div className="bg-[#0f0f1a] rounded-xl p-3 border border-red-500/30 max-w-xl">
                    <div className="text-[11px] font-semibold text-red-400 mb-1.5">
                      {failedDetail.sample ? 'Wrong Answer on sample case' : 'Wrong Answer on hidden case'}
                    </div>
                    <div className="font-mono text-[10px] text-[#64748b] space-y-1">
                      <div><span className="text-[#475569]">Input:</span> {failedDetail.input}</div>
                      {failedDetail.sample && (
                        <>
                          <div><span className="text-teal-400">Expected:</span> {failedDetail.expected}</div>
                          <div><span className="text-red-400">Your output:</span> {String(failedDetail.actual ?? '').slice(0, 500) || '(empty)'}</div>
                        </>
                      )}
                      {!failedDetail.sample && (
                        <div className="text-[#475569]">Expected output is hidden — check edge cases and try again.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

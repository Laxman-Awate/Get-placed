import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Play, RefreshCw, Send, ChevronRight, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useCodeExecution } from '../hooks/useCodeExecution';

const defaultCode: Record<string, string> = {
  python: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) return [map.get(complement), i];
        map.set(nums[i], i);
    }
    return [];
};`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.count(complement)) return {map[complement], i};
            map[nums[i]] = i;
        }
        return {};
    }
};`,
  c: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    int* result = (int*)malloc(2 * sizeof(int));
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                *returnSize = 2;
                return result;
            }
        }
    }
    *returnSize = 0;
    return NULL;
}`,
};

const testCases = [
  { input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]', output: '[0,1]', pass: true },
  { input: 'nums = [3,2,4], target = 6', expected: '[1,2]', output: '[1,2]', pass: true },
  { input: 'nums = [3,3], target = 6', expected: '[0,1]', output: '[0,1]', pass: true },
];

const langs = ['python', 'javascript', 'java', 'cpp', 'c'];

type Tab = 'description' | 'submissions' | 'editorial';

export default function Coding() {
  const navigate = useNavigate();
  const [lang, setLang] = useState('python');
  const [code, setCode] = useState(defaultCode.python);
  const [tab, setTab] = useState<Tab>('description');
  const [ran, setRan] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const exec = useCodeExecution();

  const onRun = async () => {
    setRan(true);
    await exec.run({ language: lang, source: code, problemId: 'two-sum' });
  };

  const onSubmit = async () => {
    setSubmitted(true);
    await exec.run({ language: lang, source: code, problemId: 'two-sum' });
    navigate('/dashboard/results');
  };

  const changeLang = (l: string) => {
    setLang(l);
    setCode(defaultCode[l]);
  };

  return (
    <div className="h-full flex bg-[#080810]">
      {/* Left: Problem */}
      <div className="w-[42%] border-r border-[#1e1e30] flex flex-col">
        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 pt-4 border-b border-[#1e1e30]">
          {(['description', 'submissions', 'editorial'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-2 text-xs font-medium capitalize transition-all border-b-2 -mb-px ${tab === t ? 'text-teal-400 border-teal-400' : 'text-[#64748b] border-transparent hover:text-[#94a3b8]'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 hide-scrollbar">
          {tab === 'description' && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 rounded font-medium text-green-400 bg-green-500/10">Easy</span>
                <span className="text-xs text-[#64748b]">#1 · Arrays · Hash Map</span>
              </div>
              <h2 className="text-lg font-bold font-[Plus_Jakarta_Sans] text-white mb-3">Two Sum</h2>
              <p className="text-sm text-[#94a3b8] leading-relaxed mb-4">
                Given an array of integers <code className="text-teal-400 bg-teal-500/10 px-1 rounded text-xs">nums</code> and an integer <code className="text-teal-400 bg-teal-500/10 px-1 rounded text-xs">target</code>, return <em>indices of the two numbers such that they add up to target</em>.
              </p>
              <p className="text-sm text-[#94a3b8] mb-4">You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>

              <div className="space-y-3 mb-5">
                {[
                  { label: 'Example 1', input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', exp: 'nums[0] + nums[1] == 9, return [0, 1].' },
                  { label: 'Example 2', input: 'nums = [3,2,4], target = 6', output: '[1,2]', exp: 'nums[1] + nums[2] == 6, return [1, 2].' },
                ].map(ex => (
                  <div key={ex.label} className="bg-[#0f0f1a] rounded-xl p-4">
                    <div className="text-xs font-semibold text-[#94a3b8] mb-2">{ex.label}</div>
                    <div className="font-mono text-xs text-[#94a3b8] space-y-0.5">
                      <div><span className="text-[#64748b]">Input:</span> {ex.input}</div>
                      <div><span className="text-[#64748b]">Output:</span> {ex.output}</div>
                      <div><span className="text-[#64748b]">Explanation:</span> {ex.exp}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-5">
                <div className="text-xs font-semibold text-[#94a3b8] mb-2">Constraints</div>
                <div className="bg-[#0f0f1a] rounded-xl p-4 font-mono text-xs text-[#64748b] space-y-1">
                  <div>2 &lt;= nums.length &lt;= 10⁴</div>
                  <div>-10⁹ &lt;= nums[i] &lt;= 10⁹</div>
                  <div>-10⁹ &lt;= target &lt;= 10⁹</div>
                  <div>Only one valid answer exists.</div>
                </div>
              </div>
            </>
          )}

          {tab === 'submissions' && (
            <div className="space-y-2 pt-2">
              {[
                { status: 'Accepted', lang: 'Python', time: '48ms', mem: '14.2MB', when: '2 days ago' },
                { status: 'Wrong Answer', lang: 'Python', time: '-', mem: '-', when: '2 days ago' },
                { status: 'Accepted', lang: 'JavaScript', time: '72ms', mem: '44.1MB', when: '1 week ago' },
              ].map((s, i) => (
                <div key={i} className="bg-[#0f0f1a] rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className={`text-xs font-semibold ${s.status === 'Accepted' ? 'text-teal-400' : 'text-red-400'}`}>{s.status}</span>
                    <div className="text-[10px] text-[#475569] mt-0.5">{s.lang} · {s.when}</div>
                  </div>
                  <div className="text-right text-[10px] text-[#64748b]">
                    {s.time !== '-' && <div>Runtime: {s.time}</div>}
                    {s.mem !== '-' && <div>Memory: {s.mem}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'editorial' && (
            <div className="pt-2">
              <div className="bg-[#0f0f1a] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-2">Approach: Hash Map</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed mb-3">Use a hash map to store each number's index. For each number, check if its complement (target - num) exists in the map.</p>
                <div className="text-xs font-semibold text-[#64748b] mb-1">Time: O(n) · Space: O(n)</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Editor */}
      <div className="flex-1 flex flex-col">
        {/* Lang select + actions */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e30] bg-[#0a0a14]">
          <div className="flex gap-1">
            {langs.map(l => (
              <button
                key={l}
                onClick={() => changeLang(l)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${lang === l ? 'bg-teal-500/15 text-teal-400 border border-teal-500/30' : 'text-[#64748b] hover:text-[#94a3b8]'}`}
              >
                {l === 'cpp' ? 'C++' : l.charAt(0).toUpperCase() + l.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCode(defaultCode[lang])} className="flex items-center gap-1.5 text-xs text-[#64748b] hover:text-[#94a3b8] transition-colors">
              <RefreshCw size={12} />Reset
            </button>
            <button onClick={onRun} className="flex items-center gap-1.5 text-xs bg-[#1e1e30] hover:bg-[#2e2e45] text-[#94a3b8] px-3 py-1.5 rounded-lg transition-all">
              <Play size={11} />{exec.state === 'running' ? 'Running...' : 'Run'}
            </button>
            <button onClick={onSubmit} className="flex items-center gap-1.5 text-xs bg-teal-500 hover:bg-teal-400 text-white px-3 py-1.5 rounded-lg transition-all font-semibold">
              <Send size={11} />Submit
            </button>
          </div>
        </div>

        {/* Code area */}
        <div className="flex-1 overflow-hidden">
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            className="w-full h-full bg-[#080810] text-[#e2e8f0] code-editor resize-none outline-none p-5 border-0"
            style={{ tabSize: 4 }}
          />
        </div>

        {/* Test cases */}
        <div className="border-t border-[#1e1e30] bg-[#0a0a14]" style={{ height: 200 }}>
          <div className="flex items-center gap-4 px-4 pt-3 mb-3">
            <span className="text-xs font-semibold text-white">Test Cases</span>
            {ran && <span className="text-xs text-teal-400 font-medium flex items-center gap-1"><CheckCircle size={11} /> All 3 passed</span>}
            {exec.output && <span className="text-[11px] text-[#64748b] truncate max-w-md" title={exec.output}>{exec.output}</span>}
          </div>
          <div className="overflow-x-auto hide-scrollbar px-4">
            <div className="flex gap-3">
              {testCases.map((tc, i) => (
                <div key={i} className="flex-shrink-0 w-64 bg-[#0f0f1a] rounded-xl p-3 border border-[#1e1e30]">
                  <div className="flex items-center gap-1.5 mb-2">
                    {ran ? (tc.pass ? <CheckCircle size={11} className="text-teal-500" /> : <XCircle size={11} className="text-red-500" />) : <Clock size={11} className="text-[#475569]" />}
                    <span className="text-[10px] font-semibold text-[#94a3b8]">Case {i + 1}</span>
                  </div>
                  <div className="font-mono text-[10px] text-[#64748b] space-y-1">
                    <div><span className="text-[#475569]">Input:</span> {tc.input}</div>
                    <div><span className="text-[#475569]">Expected:</span> {tc.expected}</div>
                    {ran && <div><span className={tc.pass ? 'text-teal-400' : 'text-red-400'}>Output:</span> {tc.output}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

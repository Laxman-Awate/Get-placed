import { useState } from 'react';
import { codeExecutionService } from '../services/codeExecutionService';

export function useCodeExecution() {
  const [state, setState] = useState('idle');
  const [output, setOutput] = useState('');

  const run = async ({ language = 'python', source = '', problemId = null } = {}) => {
    if (!source.trim()) {
      setState('error');
      setOutput('Nothing to run — write some code first.');
      return;
    }
    setState('running');
    setOutput('Running...');
    try {
      const res = await codeExecutionService.execute({ language, source, problemId });
      setState(res.status === 'ok' ? 'success' : 'error');
      setOutput(res.output || 'Done.');
    } catch (e) {
      setState('error');
      setOutput(`Execution service unreachable: ${e.message}. Your code is saved locally.`);
    }
  };

  const submit = async (args = {}) => {
    await run(args);
  };

  return { state, output, run, submit };
}

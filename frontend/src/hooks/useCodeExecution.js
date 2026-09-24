import { useState } from 'react';
import { codeExecutionService } from '../services/codeExecutionService';

export function useCodeExecution() {
  const [state, setState] = useState('idle');
  const [output, setOutput] = useState('');

  const run = async ({ language = 'python', source = '', problemId = null } = {}) => {
    if (!source.trim()) {
      const output = 'Nothing to run — write some code first.';
      setState('error');
      setOutput(output);
      return { status: 'error', output };
    }
    setState('running');
    setOutput('Running...');
    try {
      const res = await codeExecutionService.execute({ language, source, problemId });
      const status = res.status === 'ok' ? 'success' : 'error';
      const output = res.output || 'Done.';
      setState(status);
      setOutput(output);
      return { status, output };
    } catch (e) {
      const output = `Execution service unreachable: ${e.message}. Your code is saved locally.`;
      setState('error');
      setOutput(output);
      return { status: 'error', output };
    }
  };

  const submit = async (args = {}) => {
    await run(args);
  };

  return { state, output, run, submit };
}

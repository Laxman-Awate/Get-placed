import { useEffect, useState } from 'react';
import { mockTestService } from '../services/mockTestService';

const defaultSummary = { attempted: 0, bestScore: 0, averageScore: 0, questionsAttempted: 0 };

export function useMockTests() {
  const [state, setState] = useState(() => {
    const tests = mockTestService.peekMockTests();
    const history = mockTestService.peekMockHistory();
    const summary = mockTestService.peekMockSummary();
    const hasCache = tests !== undefined && history !== undefined && summary !== undefined;
    return {
      tests: tests || [],
      history: history || [],
      summary: summary || defaultSummary,
      loading: !hasCache,
      error: null,
    };
  });

  useEffect(() => {
    let active = true;
    Promise.all([
      mockTestService.getMockTests(),
      mockTestService.getMockTestHistory(),
      mockTestService.getMockTestSummary(),
    ])
      .then(([tests, history, summary]) => {
        if (active) setState({ tests, history, summary, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState((current) => ({ ...current, loading: false, error }));
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}

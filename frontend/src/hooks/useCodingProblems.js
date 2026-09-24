import { useEffect, useMemo, useState } from 'react';
import { codingService } from '../services/codingService';

export function useCodingProblems() {
  const [problems, setProblems] = useState(() => codingService.peekProblems() || []);
  const [loading, setLoading] = useState(() => !codingService.peekProblems());
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    difficulty: 'all',
    status: 'all',
    topic: 'all',
    pattern: 'all',
  });

  useEffect(() => {
    let active = true;
    codingService
      .getCodingProblems()
      .then((items) => {
        if (active) {
          setProblems(items || []);
          setError(null);
        }
      })
      .catch((err) => active && setError(err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const filter = (values) => setFilters((current) => ({ ...current, ...values }));
  const visible = useMemo(
    () =>
      problems.filter(
        (p) =>
          (!filters.search ||
            `${p.title} ${p.topic} ${p.pattern}`.toLowerCase().includes(filters.search.toLowerCase())) &&
          (filters.difficulty === 'all' || p.difficulty === filters.difficulty) &&
          (filters.status === 'all' ||
            (filters.status === 'solved' && p.solved) ||
            (filters.status === 'unsolved' && !p.solved)) &&
          (filters.topic === 'all' || p.topic === filters.topic) &&
          (filters.pattern === 'all' || p.pattern === filters.pattern)
      ),
    [problems, filters]
  );

  return { problems, visible, filters, filter, setProblems, loading, error };
}

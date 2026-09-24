import { useEffect, useMemo, useState } from 'react';
import { dsaService } from '../services/dsaService';

export function useDSASheet() {
  const [problems, setProblems] = useState(() => dsaService.peekSheet()?.problems || []);
  const [topics, setTopics] = useState(() => dsaService.peekSheet()?.topics || []);
  const [loading, setLoading] = useState(() => !dsaService.peekSheet());
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    dsaService
      .getDSASheet()
      .then((data) => {
        if (!active) return;
        setProblems(data.problems || []);
        setTopics(data.topics || []);
        setError(null);
      })
      .catch((err) => active && setError(err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const progress = useMemo(
    () => ({
      solved: problems.filter((problem) => problem.solved).length,
      total: problems.length,
      percentage: problems.length
        ? Math.round((problems.filter((problem) => problem.solved).length / problems.length) * 100)
        : 0,
    }),
    [problems]
  );

  const updateStatus = async (id, solved) => {
    const item = await dsaService.updateProblemStatus(id, solved);
    setProblems((current) => current.map((problem) => (problem.id === id ? item : problem)));
  };

  const toggleBookmark = async (id) => {
    const item = await dsaService.toggleBookmark(id);
    setProblems((current) => current.map((problem) => (problem.id === id ? item : problem)));
  };

  return { problems, topics, progress, updateStatus, toggleBookmark, loading, error };
}

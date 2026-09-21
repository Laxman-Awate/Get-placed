import { useEffect, useMemo, useState } from 'react';
import { readinessService } from '../services/readinessService';
import { calculateReadinessScore, getReadinessLevel, getRecommendations } from '../utils/readinessUtils';

export function usePlacementReadiness() {
  const [metrics, setMetrics] = useState(() => readinessService.peekReadiness() || []);
  const [loading, setLoading] = useState(() => !readinessService.peekReadiness());
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    readinessService
      .getReadiness()
      .then((data) => active && setMetrics(data))
      .catch((err) => active && setError(err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const score = useMemo(() => calculateReadinessScore(metrics), [metrics]);
  return { metrics, score, level: getReadinessLevel(score), recommendations: getRecommendations(metrics), loading, error };
}

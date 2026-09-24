import { useEffect, useState } from 'react';
import { getDashboardData, peekDashboard, subscribeDashboard } from '../services/dashboardService';

export function useDashboard() {
  const [state, setState] = useState(() => {
    const cached = peekDashboard();
    return { data: cached || null, loading: !cached, error: null };
  });

  useEffect(() => {
    let active = true;
    // Instant render from persistent cache (survives reloads), then
    // background revalidation pushes fresh data via subscription.
    const unsubscribe = subscribeDashboard((data) => {
      if (active) setState({ data, loading: false, error: null });
    });
    getDashboardData()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) => active && setState((cur) => (cur.data ? { ...cur, loading: false } : { data: null, loading: false, error })));
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return state;
}

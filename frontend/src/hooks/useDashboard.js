import { useEffect, useState } from 'react';
import { getDashboardData, peekDashboard } from '../services/dashboardService';

export function useDashboard() {
  const [state, setState] = useState(() => {
    const cached = peekDashboard();
    return { data: cached || null, loading: !cached, error: null };
  });

  useEffect(() => {
    let active = true;
    getDashboardData()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) => active && setState((cur) => (cur.data ? { ...cur, loading: false } : { data: null, loading: false, error })));
    return () => {
      active = false;
    };
  }, []);

  return state;
}

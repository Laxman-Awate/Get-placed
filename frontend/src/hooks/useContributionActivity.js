import { useEffect, useMemo, useState } from 'react';
import { buildContributionCalendarFromCounts } from '../utils/contributionCalendar';
import { activityService } from '../services/activityService';

export function useContributionActivity() {
  const [counts, setCounts] = useState(() => activityService.peekCalendar() || {});
  const [loading, setLoading] = useState(() => !activityService.peekCalendar());
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    activityService
      .getCalendar()
      .then((data) => active && setCounts(data))
      .catch((err) => active && setError(err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const calendar = useMemo(() => buildContributionCalendarFromCounts(counts), [counts]);
  return { ...calendar, loading, error };
}

import { authService } from './authService';
import { cached, peek, TTL } from '../utils/cache';

const KEY = 'activity-calendar';

async function fetchCalendar() {
  const res = await authService.authFetch('/activity/calendar');
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Failed to load activity (${res.status})`);
  }
  return (await res.json()) || {};
}

export const activityService = {
  peekCalendar: () => peek(KEY),
  getCalendar: () => cached(KEY, TTL.CALENDAR, fetchCalendar),
};

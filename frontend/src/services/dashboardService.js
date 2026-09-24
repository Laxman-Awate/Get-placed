import { authService } from './authService';
import { cached, cachedStale, peek, subscribe, TTL } from '../utils/cache';

const KEY = 'dashboard';

async function fetchDashboard() {
  const res = await authService.authFetch('/dashboard');
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Failed to load dashboard (${res.status})`);
  }
  const data = await res.json();
  return {
    stats: Array.isArray(data.stats) ? data.stats : [],
    recentActivity: Array.isArray(data.recentActivity) ? data.recentActivity : [],
    course: data.course || { title: 'Data Structures & Algorithms', progress: 0, next: 'Binary Search' },
  };
}

export function peekDashboard() {
  return peek(KEY);
}

export function subscribeDashboard(fn) {
  return subscribe(KEY, fn);
}

// Stale-while-revalidate: reloads render instantly from the persisted
// cache (even if TTL expired), then refresh in background.
export async function getDashboardData() {
  return cachedStale(KEY, TTL.DASHBOARD, fetchDashboard);
}

export async function refreshDashboard() {
  return cached(KEY, 0, fetchDashboard);
}

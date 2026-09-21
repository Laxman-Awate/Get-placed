import { authService } from './authService';
import { cached, peek, TTL } from '../utils/cache';

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

export async function getDashboardData() {
  return cached(KEY, TTL.DASHBOARD, fetchDashboard);
}

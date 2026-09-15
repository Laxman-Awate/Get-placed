import { RECENT_ACTIVITY } from '../constants/dashboard';

export async function getDashboardData() {
  return { recentActivity: RECENT_ACTIVITY, course: { title: 'Data Structures & Algorithms', progress: 64, next: 'Binary Search' } };
}

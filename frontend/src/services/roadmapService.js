import { apiRequest } from './apiClient';
import { cached, invalidate, TTL } from '../utils/cache';

const KEY = 'roadmap';

export const roadmapService = {
  getRoadmap() {
    return cached(KEY, TTL.ROADMAP, () => apiRequest('/roadmap'));
  },
  async updateLevel(levelId, status) {
    try {
      const res = await apiRequest(`/roadmap/levels/${levelId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      invalidate(KEY);
      return res;
    } catch {
      return { levelId, status, offline: true };
    }
  },
};

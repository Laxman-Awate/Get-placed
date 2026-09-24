import { apiRequest } from './apiClient';
import { cached, invalidate, TTL } from '../utils/cache';

const KEY = 'resume';

export const resumeService = {
  getResume() {
    return cached(KEY, TTL.RESUME, () => apiRequest('/resume'));
  },
  async saveResume(data) {
    try {
      const saved = await apiRequest('/resume', {
        method: 'PUT',
        body: JSON.stringify({ data }),
      });
      invalidate(KEY);
      return saved;
    } catch {
      window.localStorage.setItem('placepro.resume.local', JSON.stringify(data));
      return { data, offline: true };
    }
  },
  getLocalResume() {
    try {
      const raw = window.localStorage.getItem('placepro.resume.local');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
};

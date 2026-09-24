import { apiRequest } from './apiClient';
import { cached, TTL } from '../utils/cache';

const KEY = 'interview-questions';

export const interviewService = {
  async getQuestions(category) {
    const qs = category ? `?category=${encodeURIComponent(category)}` : '';
    return cached(`${KEY}-${category || 'all'}`, TTL.INTERVIEWS, () =>
      apiRequest(`/interviews/questions${qs}`)
    );
  },
  async getStats() {
    try {
      return await apiRequest('/interviews/stats');
    } catch {
      return [];
    }
  },
  async saveAttempt({ questionId, answer, feedback }) {
    try {
      return await apiRequest('/interviews/attempts', {
        method: 'POST',
        body: JSON.stringify({ questionId, answer, feedback }),
      });
    } catch {
      // Offline-tolerant: practice UI keeps working, syncs later.
      return { saved: false, offline: true };
    }
  },
};

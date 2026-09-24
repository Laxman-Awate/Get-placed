import { apiRequest } from './apiClient';
import { cachedStale, invalidate, peek, TTL } from '../utils/cache';

const KEY = 'coding-problems';
const HOME_KEY = 'coding-home';

export const codingService = {
  peekProblems: () => peek(KEY),
  getCodingHome: async () => apiRequest('/coding/home'),
  getCodingProblems: async () => cachedStale(KEY, TTL.CODING, () => apiRequest('/coding/problems')),
  getCodingProblem: async (id) => apiRequest(`/coding/problems/${id}`),
  updateSolved: async (id, value) => {
    const res = await apiRequest(`/coding/problems/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ solved: value }),
    });
    invalidate(KEY, HOME_KEY);
    return res;
  },
  updateBookmark: async (id, value) => {
    const res = await apiRequest(`/coding/problems/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ bookmarked: value }),
    });
    invalidate(KEY, HOME_KEY);
    return res;
  },
  getCodingTopics: async () => apiRequest('/coding/topics'),
  getRecommendedProblems: async () => apiRequest('/coding/home').then((data) => data.recommended),
  getRecentProblems: async () => apiRequest('/coding/home').then((data) => data.recommended.slice(1, 3)),
  getSavedProblems: async () =>
    cachedStale(KEY, TTL.CODING, () => apiRequest('/coding/problems')).then((items) =>
      items.filter((problem) => problem.bookmarked)
    ),
};

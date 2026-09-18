import { apiRequest } from './apiClient';
export const codingService = {
  getCodingHome: async () => apiRequest('/coding/home'),
  getCodingProblems: async () => apiRequest('/coding/problems'),
  getCodingProblem: async id => apiRequest(`/coding/problems/${id}`),
  updateSolved: async (id, value) => apiRequest(`/coding/problems/${id}/progress`, { method: 'PATCH', body: JSON.stringify({ solved: value }) }),
  updateBookmark: async (id, value) => apiRequest(`/coding/problems/${id}/progress`, { method: 'PATCH', body: JSON.stringify({ bookmarked: value }) }),
  getCodingTopics: async () => apiRequest('/coding/topics'),
  getRecommendedProblems: async () => apiRequest('/coding/home').then(data => data.recommended),
  getRecentProblems: async () => apiRequest('/coding/home').then(data => data.recommended.slice(1, 3)),
  getSavedProblems: async () => apiRequest('/coding/problems').then(items => items.filter(problem => problem.bookmarked)),
};

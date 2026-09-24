import { apiRequest } from './apiClient';
import { cachedStale, invalidate, peek, TTL } from '../utils/cache';

const SHEET_KEY = 'dsa-sheet';
const PROBLEMS_KEY = 'dsa-problems';

export const dsaService = {
  peekSheet: () => peek(SHEET_KEY),
  getDSASheet: async () => cachedStale(SHEET_KEY, TTL.DSA, () => apiRequest('/dsa/sheet')),
  getDSAProblems: async () => cachedStale(PROBLEMS_KEY, TTL.DSA, () => apiRequest('/dsa/problems')),
  getDSAProblemById: async (id) => apiRequest(`/dsa/problems/${id}`),
  getTestCases: async (id) => apiRequest(`/dsa/problems/${id}/testcases`),
  updateProblemStatus: async (id, solved) => {
    const res = await apiRequest(`/dsa/problems/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ solved }),
    });
    invalidate(SHEET_KEY, PROBLEMS_KEY);
    return res;
  },
  toggleBookmark: async (id) => {
    const problem = await apiRequest(`/dsa/problems/${id}`);
    const res = await apiRequest(`/dsa/problems/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ bookmarked: !problem.bookmarked }),
    });
    invalidate(SHEET_KEY, PROBLEMS_KEY);
    return res;
  },
};

import { apiRequest } from './apiClient';
import { cachedStale, invalidate, peek, TTL } from '../utils/cache';

function getLocalPublishedTests() {
  try {
    const raw = window.localStorage.getItem('placepro.published_mock_tests');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const TESTS_KEY = 'mock-tests';
const HISTORY_KEY = 'mock-history';
const SUMMARY_KEY = 'mock-summary';

export const mockTestService = {
  peekMockTests: () => peek(TESTS_KEY),
  peekMockHistory: () => peek(HISTORY_KEY),
  peekMockSummary: () => peek(SUMMARY_KEY),

  getMockTests: async () =>
    cachedStale(TESTS_KEY, TTL.MOCK, async () => {
      const data = await apiRequest('/mock-tests');
      const local = getLocalPublishedTests();
      return [...local, ...(data || [])];
    }),

  getMockTestById: async (id) => {
    const local = getLocalPublishedTests();
    const foundLocal = local.find((t) => t.id === id);
    if (foundLocal) return foundLocal;
    return apiRequest(`/mock-tests/${id}`);
  },

  getMockTestHistory: async () => cachedStale(HISTORY_KEY, TTL.MOCK, () => apiRequest('/mock-tests/history')),

  getMockTestSummary: async () => cachedStale(SUMMARY_KEY, TTL.MOCK, () => apiRequest('/mock-tests/summary')),

  submitAttempt: async (id, answers) => {
    const res = await apiRequest(`/mock-tests/${id}/attempts`, {
      method: 'POST',
      body: JSON.stringify(answers),
    });
    invalidate(HISTORY_KEY, SUMMARY_KEY);
    return res;
  },

  getLatestAttempt: async (id) => apiRequest(`/mock-tests/${id}/attempts/latest`),
};

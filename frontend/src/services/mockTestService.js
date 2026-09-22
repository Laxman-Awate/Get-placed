import { apiRequest } from './apiClient';
import { MOCK_TESTS, MOCK_TEST_HISTORY, MOCK_TEST_SUMMARY } from '../constants/mockTests';

function getLocalPublishedTests() {
  try {
    const raw = window.localStorage.getItem('placepro.published_mock_tests');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const mockTestService = {
  getMockTests: async () => {
    try {
      const data = await apiRequest('/mock-tests');
      const local = getLocalPublishedTests();
      return [...local, ...(data || [])];
    } catch {
      const local = getLocalPublishedTests();
      return [...local, ...MOCK_TESTS];
    }
  },

  getMockTestById: async (id) => {
    try {
      return await apiRequest(`/mock-tests/${id}`);
    } catch {
      const local = getLocalPublishedTests();
      const foundLocal = local.find((t) => t.id === id);
      if (foundLocal) return foundLocal;
      const foundDefault = MOCK_TESTS.find((t) => t.id === id);
      if (foundDefault) return foundDefault;
      throw new Error('Mock test not found');
    }
  },

  getMockTestHistory: async () => {
    try {
      return await apiRequest('/mock-tests/history');
    } catch {
      return MOCK_TEST_HISTORY;
    }
  },

  getMockTestSummary: async () => {
    try {
      return await apiRequest('/mock-tests/summary');
    } catch {
      return MOCK_TEST_SUMMARY;
    }
  },

  submitAttempt: async (id, answers) => {
    try {
      return await apiRequest(`/mock-tests/${id}/attempts`, { method: 'POST', body: JSON.stringify(answers) });
    } catch {
      return { score: 85, totalQuestions: Object.keys(answers || {}).length, percentage: 85, status: 'COMPLETED' };
    }
  },

  getLatestAttempt: async (id) => {
    try {
      return await apiRequest(`/mock-tests/${id}/attempts/latest`);
    } catch {
      return null;
    }
  },
};


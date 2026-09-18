import { apiRequest } from './apiClient';
export const mockTestService = {
  getMockTests: async () => apiRequest('/mock-tests'),
  getMockTestById: async id => apiRequest(`/mock-tests/${id}`),
  getMockTestHistory: async () => apiRequest('/mock-tests/history'),
  getMockTestSummary: async () => apiRequest('/mock-tests/summary'),
  submitAttempt: async (id, answers) => apiRequest(`/mock-tests/${id}/attempts`, { method: 'POST', body: JSON.stringify(answers) }),
  getLatestAttempt: async id => apiRequest(`/mock-tests/${id}/attempts/latest`),
};

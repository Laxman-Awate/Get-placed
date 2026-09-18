import { apiRequest } from './apiClient';
export const dsaService = {
  getDSASheet: async () => apiRequest('/dsa/sheet'),
  getDSAProblems: async () => apiRequest('/dsa/problems'),
  getDSAProblemById: async id => apiRequest(`/dsa/problems/${id}`),
  updateProblemStatus: async (id, solved) => apiRequest(`/dsa/problems/${id}/progress`, { method: 'PATCH', body: JSON.stringify({ solved }) }),
  toggleBookmark: async id => {
    const problem = await apiRequest(`/dsa/problems/${id}`);
    return apiRequest(`/dsa/problems/${id}/progress`, { method: 'PATCH', body: JSON.stringify({ bookmarked: !problem.bookmarked }) });
  },
};

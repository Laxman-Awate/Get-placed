import { apiRequest } from './apiClient';

export const codeExecutionService = {
  async execute({ language, source, problemId }) {
    return apiRequest('/code/execute', {
      method: 'POST',
      body: JSON.stringify({ language, source, problemId }),
    });
  },
};

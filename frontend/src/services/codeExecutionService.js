import { apiRequest } from './apiClient';

export const codeExecutionService = {
  async execute({ language, source, problemId }) {
    return apiRequest('/code/execute', {
      method: 'POST',
      body: JSON.stringify({ language, source, problemId }),
    });
  },
  // Judged run: samplesOnly=true checks the visible samples (Run),
  // otherwise every sample + hidden case is checked (Submit).
  async submit({ problemId, language, source, samplesOnly }) {
    return apiRequest('/code/submit', {
      method: 'POST',
      body: JSON.stringify({ problemId, language, source, samplesOnly: Boolean(samplesOnly) }),
    });
  },
};

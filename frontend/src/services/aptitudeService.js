import { apiRequest } from './apiClient';
export const aptitudeService = {
  getCategories: async () => apiRequest('/aptitude/categories'),
  getTopics: async categoryId => apiRequest(`/aptitude/categories/${categoryId}/topics`),
  getQuestions: async topicId => apiRequest(`/aptitude/topics/${topicId}/questions`),
  getProgress: async () => apiRequest('/aptitude/progress'),
};

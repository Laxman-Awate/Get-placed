import { apiRequest } from './apiClient';
import { cachedStale, invalidate, invalidatePrefix, peek, TTL } from '../utils/cache';

const CATS_KEY = 'aptitude-categories';
const PROGRESS_KEY = 'aptitude-progress';
const topicsKey = (categoryId) => `aptitude-topics-${categoryId}`;
const questionsKey = (topicId) => `aptitude-questions-${topicId}`;

export const aptitudeService = {
  peekCategories: () => peek(CATS_KEY),
  getCategories: async () => cachedStale(CATS_KEY, TTL.APTITUDE, () => apiRequest('/aptitude/categories')),
  getTopics: async (categoryId) =>
    cachedStale(topicsKey(categoryId), TTL.APTITUDE, () => apiRequest(`/aptitude/categories/${categoryId}/topics`)),
  getQuestions: async (topicId) =>
    cachedStale(questionsKey(topicId), TTL.APTITUDE, () => apiRequest(`/aptitude/topics/${topicId}/questions`)),
  getProgress: async () => cachedStale(PROGRESS_KEY, TTL.APTITUDE, () => apiRequest('/aptitude/progress')),
  submitAttempt: async (topicId, { questionId, selectedAnswer }) => {
    const res = await apiRequest(`/aptitude/topics/${topicId}/attempts`, {
      method: 'POST',
      body: JSON.stringify({ questionId, selectedAnswer }),
    });
    // The topics list cache is keyed per category, which this call doesn't
    // know — clear the whole family plus categories/progress that embed it.
    invalidate(PROGRESS_KEY, questionsKey(topicId), CATS_KEY);
    invalidatePrefix('aptitude-topics-');
    return res;
  },
};

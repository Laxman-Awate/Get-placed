import { apiRequest } from './apiClient';
import { cached, peek, TTL } from '../utils/cache';

const KEY = 'learning';

const getLearning = () => cached(KEY, TTL.LEARNING, () => apiRequest('/learning'));

export const learningService = {
  peekLearning: () => peek(KEY),
  getLearning,
  getSemesters: async () => getLearning().then((data) => data.semesters),
  getSubjects: async () => getLearning().then((data) => data.subjects),
  getTopics: async () => getLearning().then((data) => data.topics),
  getDSAModules: async () => getLearning().then((data) => data.dsaModules),
  getDSALessons: async () => getLearning().then((data) => data.dsaLessons),
};

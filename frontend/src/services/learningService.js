import { apiRequest } from './apiClient';
const getLearning = () => apiRequest('/learning');
export const learningService = {
  getLearning,
  getSemesters: async () => getLearning().then(data => data.semesters),
  getSubjects: async () => getLearning().then(data => data.subjects),
  getTopics: async () => getLearning().then(data => data.topics),
  getDSAModules: async () => getLearning().then(data => data.dsaModules),
  getDSALessons: async () => getLearning().then(data => data.dsaLessons),
};

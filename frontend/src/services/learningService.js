import { SEMESTERS, SEMESTER_SUBJECTS, SUBJECT_TOPICS, DSA_MODULES, DSA_LESSONS } from '../constants/learning';
export const learningService = { getSemesters: async () => SEMESTERS, getSubjects: async () => SEMESTER_SUBJECTS, getTopics: async () => SUBJECT_TOPICS, getDSAModules: async () => DSA_MODULES, getDSALessons: async () => DSA_LESSONS };

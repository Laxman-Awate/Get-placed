export const SEMESTERS = Array.from({ length: 8 }, (_, index) => ({ id: `semester-${index + 1}`, name: `Semester ${index + 1}`, subjects: index % 3 + 5, progress: [32, 18, 44, 27, 12, 8, 0, 0][index] }));
export const SEMESTER_SUBJECTS = [
  { id: 'mathematics', name: 'Mathematics', code: 'MATH101', topics: 8, progress: 42 },
  { id: 'programming-fundamentals', name: 'Programming Fundamentals', code: 'CSE101', topics: 8, progress: 64 },
  { id: 'engineering-physics', name: 'Engineering Physics', code: 'PHY101', topics: 6, progress: 24 },
  { id: 'engineering-chemistry', name: 'Engineering Chemistry', code: 'CHEM101', topics: 7, progress: 12 },
  { id: 'communication-skills', name: 'Communication Skills', code: 'HUM101', topics: 5, progress: 38 },
];
export const SUBJECT_TOPICS = ['Introduction to Programming', 'Variables & Data Types', 'Operators', 'Conditional Statements', 'Loops', 'Functions', 'Arrays', 'Basic Problem Solving'].map((name, index) => ({ id: name.toLowerCase().replaceAll(' ', '-').replaceAll('&', 'and'), name, minutes: [12, 18, 14, 22, 20, 16, 25, 28][index], complete: index < 4 }));
export const DSA_MODULES = [
  { id: 'arrays', name: 'Arrays', level: 'Beginner', lessons: 12, progress: 80 }, { id: 'strings', name: 'Strings', level: 'Beginner', lessons: 10, progress: 62 }, { id: 'linked-lists', name: 'Linked Lists', level: 'Beginner', lessons: 9, progress: 40 }, { id: 'stack', name: 'Stack', level: 'Beginner', lessons: 7, progress: 20 }, { id: 'queue', name: 'Queue', level: 'Beginner', lessons: 7, progress: 0 }, { id: 'binary-search', name: 'Binary Search', level: 'Intermediate', lessons: 8, progress: 0 }, { id: 'recursion', name: 'Recursion', level: 'Intermediate', lessons: 10, progress: 0 }, { id: 'trees', name: 'Trees', level: 'Intermediate', lessons: 14, progress: 0 }, { id: 'heaps', name: 'Heaps', level: 'Intermediate', lessons: 8, progress: 0 }, { id: 'hashing', name: 'Hashing', level: 'Intermediate', lessons: 8, progress: 0 }, { id: 'graphs', name: 'Graphs', level: 'Advanced', lessons: 15, progress: 0 }, { id: 'greedy', name: 'Greedy', level: 'Advanced', lessons: 9, progress: 0 }, { id: 'dynamic-programming', name: 'Dynamic Programming', level: 'Advanced', lessons: 18, progress: 0 },
];
export const DSA_LESSONS = ['Introduction', 'Array Traversal', 'Searching', 'Two Pointer', 'Sliding Window', 'Prefix Sum', 'Practice Problems'].map((name, index) => ({ name, complete: index < 5, current: index === 5 }));

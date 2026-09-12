import { useMemo } from 'react';
export function useLearningStreak() { return useMemo(() => Array.from({ length: 196 }, (_, index) => ({ id: index, level: index % 17 === 0 ? 4 : index % 11 === 0 ? 3 : index % 5 === 0 ? 2 : index % 3 === 0 ? 1 : 0, activities: index % 17 === 0 ? 5 : index % 11 === 0 ? 3 : index % 5 === 0 ? 2 : index % 3 === 0 ? 1 : 0 })), []); }

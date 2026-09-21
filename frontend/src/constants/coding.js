const starter = {
  Java: 'class Solution {\n    public int[] solve(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}',
  'C++': 'class Solution {\npublic:\n    vector<int> solve(vector<int>& nums, int target) {\n        // Write your solution here\n    }\n};',
  Python: 'class Solution:\n    def solve(self, nums, target):\n        # Write your solution here\n        pass',
  JavaScript: 'class Solution {\n  solve(nums, target) {\n    // Write your solution here\n  }\n}',
};

const base = {
  'two-sum': { number: 1, title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays', pattern: 'Hashing', solved: true, bookmarked: false, description: 'Given a list of numbers and a target, return the positions of two values that add to the target.', examples: ['Input: [2, 7, 11, 15], target: 9', 'Output: [0, 1]'], constraints: ['The input contains at least two values.', 'Use each position at most once.'], hints: ['Remember values already seen while scanning.', 'A hash lookup can reduce repeated searching.'] },
  'maximum-subarray': { number: 2, title: 'Maximum Subarray', difficulty: 'Medium', topic: 'Arrays', pattern: "Kadane's Algorithm", solved: false, bookmarked: true, description: 'Find the contiguous section of numbers with the largest sum.', examples: ['Input: [-2, 1, -3, 4, -1, 2, 1]', 'Output: 6'], constraints: ['The list contains at least one number.', 'A section must contain consecutive values.'], hints: ['Track the best sum ending at the current position.', 'Decide whether to extend or restart the section.'] },
  'reverse-linked-list': { number: 3, title: 'Reverse Linked List', difficulty: 'Easy', topic: 'Linked List', pattern: 'Two Pointer', solved: false, bookmarked: false, description: 'Reverse the direction of a singly linked list and return its new head.', examples: ['Input: 1 ΓåÆ 2 ΓåÆ 3', 'Output: 3 ΓåÆ 2 ΓåÆ 1'], constraints: ['The list may be empty.', 'Use links rather than creating a second list.'], hints: ['Keep track of the previous and next nodes.'] },
  'binary-search': { number: 4, title: 'Binary Search', difficulty: 'Easy', topic: 'Binary Search', pattern: 'Binary Search', solved: false, bookmarked: false, description: 'Return the index of a target in a sorted list, or -1 when it is absent.', examples: ['Input: [1, 3, 5, 7], target: 5', 'Output: 2'], constraints: ['The list is sorted in ascending order.'], hints: ['Discard half the remaining search space each step.'] },
  'sliding-window-sum': { number: 5, title: 'Sliding Window Sum', difficulty: 'Medium', topic: 'Arrays', pattern: 'Sliding Window', solved: false, bookmarked: false, description: 'Find the largest sum among all consecutive windows of a fixed size.', examples: ['Input: [2, 1, 5, 1, 3], window: 3', 'Output: 9'], constraints: ['Window size is positive and valid.'], hints: ['Remove the value leaving the window before adding the next value.'] },
};

export const CODING_PROBLEMS = Object.entries(base).map(([id, problem]) => ({ id, ...problem, starterCode: starter, isFree: true }));
export const CODING_TOPICS = ['Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Binary Search', 'Trees', 'Graphs', 'Dynamic Programming'];
export const CODING_STATS = { solved: 42, attempted: 58, accuracy: 72, streak: 7 };

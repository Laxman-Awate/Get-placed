import { MOCK_TESTS, MOCK_TEST_HISTORY } from '../constants/mockTests';
export const mockTestService = { getMockTests: async()=>MOCK_TESTS, getMockTestById: async id=>MOCK_TESTS.find(test=>test.id===id)||null, getMockTestHistory: async()=>MOCK_TEST_HISTORY };

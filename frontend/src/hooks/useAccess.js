import { ACCESS_LEVELS } from '../constants/access';
import { canAccessContent, getAccessState, getCurrentPlan } from '../services/accessService';
import { useAuth } from '../context/AuthContext';

export function useAccess() {
  // Subscribe to auth session so plan changes re-render consumers.
  const { user } = useAuth();
  const plan = (user?.plan || getCurrentPlan() || 'free').toLowerCase();
  const isPremium = plan === 'premium';
  return {
    plan,
    isPremium,
    isFree: !isPremium,
    canAccess: (content) => canAccessContent(content, plan),
    getAccessState: (content) => getAccessState(content, plan),
    levels: ACCESS_LEVELS,
  };
}

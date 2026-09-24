import { ACCESS_LEVELS, CURRENT_USER_PLAN } from '../constants/access';
import { authService } from './authService';

// Live plan from the authenticated session (backend users.plan,
// returned by /api/auth/* and stored on login). Falls back to the
// default constant when logged out, preserving previous behavior.
export function getCurrentPlan() {
  const plan = authService.getUser()?.plan;
  return typeof plan === 'string' && plan ? plan.toLowerCase() : CURRENT_USER_PLAN;
}

export function isPremiumFeature(content) {
  return content?.access === ACCESS_LEVELS.PREMIUM || content?.premium === true || content?.isFree === false;
}

export function getAccessState(content, plan = getCurrentPlan()) {
  if (!content) return ACCESS_LEVELS.LOCKED;
  if (content.access === ACCESS_LEVELS.FREE || content.isFree === true || content.free === true) return ACCESS_LEVELS.FREE;
  if (isPremiumFeature(content)) return plan === 'premium' ? ACCESS_LEVELS.FREE : ACCESS_LEVELS.LOCKED;
  return content.access || ACCESS_LEVELS.PREVIEW;
}

export function canAccessContent(content, plan = getCurrentPlan()) {
  return getAccessState(content, plan) !== ACCESS_LEVELS.LOCKED;
}

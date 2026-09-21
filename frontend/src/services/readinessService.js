<<<<<<< Updated upstream
import { apiRequest } from './apiClient'; export const readinessService={getReadiness:async()=>apiRequest('/readiness')};
=======
import { authService } from './authService';
import { cached, peek, TTL } from '../utils/cache';

const KEY = 'readiness';

async function fetchReadiness() {
  const res = await authService.authFetch('/readiness');
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Failed to load readiness (${res.status})`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export const readinessService = {
  peekReadiness: () => peek(KEY),
  getReadiness: () => cached(KEY, TTL.READINESS, fetchReadiness),
};
>>>>>>> Stashed changes

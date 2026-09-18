import { apiRequest } from './apiClient'; export const readinessService={getReadiness:async()=>apiRequest('/readiness')};

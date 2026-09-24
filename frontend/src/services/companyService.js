import { apiRequest } from './apiClient';
import { cachedStale, invalidate, peek, TTL } from '../utils/cache';

const KEY = 'companies';
const FEATURED_KEY = 'companies-featured';

export async function getFeaturedCompanies() {
  return cachedStale(FEATURED_KEY, TTL.COMPANIES, () => apiRequest('/companies/featured'));
}
export async function getCompanies() {
  return cachedStale(KEY, TTL.COMPANIES, () => apiRequest('/companies'));
}
export function peekCompanies() {
  return peek(KEY);
}
export async function getCompanyById(companyId) {
  return apiRequest(`/companies/${companyId}`);
}
export async function getCompanyPreparation(companyId) {
  return apiRequest(`/companies/${companyId}/preparation`);
}
export async function updateCompanyBookmark(companyId, bookmarked) {
  const res = await apiRequest(`/companies/${companyId}/bookmark`, {
    method: 'PATCH',
    body: JSON.stringify({ bookmarked }),
  });
  invalidate(KEY, FEATURED_KEY);
  return res;
}

import { apiRequest } from './apiClient';
export async function getFeaturedCompanies() { return apiRequest('/companies/featured'); }
export async function getCompanies() { return apiRequest('/companies'); }
export async function getCompanyById(companyId) { return apiRequest(`/companies/${companyId}`); }
export async function getCompanyPreparation(companyId) { return apiRequest(`/companies/${companyId}/preparation`); }
export async function updateCompanyBookmark(companyId, bookmarked) { return apiRequest(`/companies/${companyId}/bookmark`, { method: 'PATCH', body: JSON.stringify({ bookmarked }) }); }

import { COMPANIES, COMPANY_MODULES, COMPANY_ROADMAP } from '../constants/companies';

// Replace this adapter with the real company API without changing presentation components.
export async function getFeaturedCompanies() {
  return COMPANIES.slice(0, 6).map(company => ({ name: company.name, category: company.type }));
}
export async function getCompanies() { return COMPANIES; }
export async function getCompanyById(companyId) { return COMPANIES.find(company => company.id === companyId) || null; }
export async function getCompanyPreparation(companyId) { const company = await getCompanyById(companyId); return company ? { company, modules: COMPANY_MODULES, roadmap: COMPANY_ROADMAP, progress: { overall: 0, aptitude: 0, dsa: 0, technical: 0, interview: 0 }, freeModules: 1 } : null; }

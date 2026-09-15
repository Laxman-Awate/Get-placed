import { useEffect, useState } from 'react';
import { getFeaturedCompanies } from '../services/companyService';
import { getCompanies } from '../services/companyService';

export function useCompanies() {
  const [state, setState] = useState({ data: [], loading: true, error: null });
  useEffect(() => { let mounted = true; getFeaturedCompanies().then(data => mounted && setState({ data, loading: false, error: null })).catch(error => mounted && setState({ data: [], loading: false, error })); return () => { mounted = false; }; }, []);
  return state;
}

export function useCompanyDirectory() { const [state, setState] = useState({ data: [], loading: true, error: null }); useEffect(() => { getCompanies().then(data => setState({ data, loading: false, error: null })).catch(error => setState({ data: [], loading: false, error })); }, []); return state; }

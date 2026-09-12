import { useEffect, useState } from 'react';
import { getCompanyPreparation } from '../services/companyService';
export function useCompanyPreparation(companyId) { const [state, setState] = useState({ data: null, loading: true, error: null }); useEffect(() => { setState(current => ({ ...current, loading: true })); getCompanyPreparation(companyId).then(data => setState({ data, loading: false, error: data ? null : new Error('Company not found') })).catch(error => setState({ data: null, loading: false, error })); }, [companyId]); return state; }

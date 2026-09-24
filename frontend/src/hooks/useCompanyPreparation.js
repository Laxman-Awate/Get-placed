import { useEffect, useState } from 'react';
import { getCompanyPreparation } from '../services/companyService';

export function useCompanyPreparation(companyId) {
  const [state, setState] = useState({ data: null, loading: Boolean(companyId), error: null });

  useEffect(() => {
    if (!companyId) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    let active = true;
    setState((current) => ({ ...current, loading: true }));
    getCompanyPreparation(companyId)
      .then((data) => active && setState({ data, loading: false, error: data ? null : new Error('Company not found') }))
      .catch((error) => active && setState({ data: null, loading: false, error }));
    return () => {
      active = false;
    };
  }, [companyId]);

  return state;
}

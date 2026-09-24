import { useEffect, useState } from 'react';
import { getFeaturedCompanies, peekCompanies } from '../services/companyService';
import { getCompanies, updateCompanyBookmark } from '../services/companyService';

export function useCompanies() {
  const [state, setState] = useState({ data: [], loading: true, error: null });
  useEffect(() => { let mounted = true; getFeaturedCompanies().then(data => mounted && setState({ data, loading: false, error: null })).catch(error => mounted && setState({ data: [], loading: false, error })); return () => { mounted = false; }; }, []);
  return state;
}

export function useCompanyDirectory() {
  const [state, setState] = useState(() => {
    const cached = peekCompanies();
    return { data: cached || [], loading: !cached, error: null };
  });
  useEffect(() => {
    let mounted = true;
    getCompanies()
      .then((data) => mounted && setState({ data, loading: false, error: null }))
      .catch((error) => mounted && setState((cur) => (cur.data.length ? { ...cur, loading: false } : { data: [], loading: false, error })));
    return () => {
      mounted = false;
    };
  }, []);

  // Optimistic bookmark toggle with rollback — no page reload.
  // updateCompanyBookmark already invalidates the companies cache keys,
  // so the next background fetch converges on server state.
  const setBookmark = async (id, bookmarked) => {
    let previous;
    setState((cur) => {
      previous = cur.data;
      return { ...cur, data: cur.data.map((c) => (c.id === id ? { ...c, bookmarked } : c)) };
    });
    try {
      await updateCompanyBookmark(id, bookmarked);
    } catch (error) {
      setState((cur) => ({ ...cur, data: previous ?? cur.data }));
      throw error;
    }
  };

  return { ...state, setBookmark };
}

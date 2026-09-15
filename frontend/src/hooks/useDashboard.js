import { useEffect, useState } from 'react';
import { getDashboardData } from '../services/dashboardService';
export function useDashboard() { const [state, setState] = useState({ data: null, loading: true, error: null }); useEffect(() => { let active = true; getDashboardData().then(data => active && setState({ data, loading: false, error: null })).catch(error => active && setState({ data: null, loading: false, error })); return () => { active = false; }; }, []); return state; }

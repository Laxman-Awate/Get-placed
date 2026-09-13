import { useMemo } from 'react';
import { buildContributionCalendar } from '../utils/contributionCalendar';

export function useContributionActivity() { return useMemo(() => buildContributionCalendar(), []); }

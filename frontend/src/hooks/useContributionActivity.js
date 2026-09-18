import { useEffect, useState } from 'react';
import { apiRequest } from '../services/apiClient';
import { buildContributionCalendar } from '../utils/contributionCalendar';

export function useContributionActivity() { const [calendar,setCalendar]=useState(()=>buildContributionCalendar()); useEffect(()=>{apiRequest('/activity/calendar').then(activity=>setCalendar(buildContributionCalendar(new Date(),activity))).catch(()=>setCalendar(buildContributionCalendar(new Date(),{})))},[]); return calendar; }

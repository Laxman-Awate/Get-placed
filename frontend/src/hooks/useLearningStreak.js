import { useEffect, useState } from 'react';
<<<<<<< Updated upstream
import { apiRequest } from '../services/apiClient';

const dateKey = date => date.toISOString().slice(0, 10);
export function useLearningStreak() {
  const [activity,setActivity]=useState({});
  useEffect(()=>{apiRequest('/activity/calendar').then(setActivity).catch(()=>setActivity({}))},[]);
  const end = new Date();
  return (() => {
    const end = new Date();
    end.setHours(12, 0, 0, 0);
    const start = new Date(end);
    start.setMonth(start.getMonth() - 11);
    start.setDate(1);
=======
import { activityService } from '../services/activityService';

const dateKey = (date) => date.toISOString().slice(0, 10);
>>>>>>> Stashed changes

function buildGrid(counts) {
  const end = new Date();
  end.setHours(12, 0, 0, 0);
  const start = new Date(end);
  start.setMonth(start.getMonth() - 11);
  start.setDate(1);

<<<<<<< Updated upstream
    const weeks = [];
    for (let date = new Date(gridStart); date <= gridEnd; date.setDate(date.getDate() + 1)) {
      if (!weeks.length || weeks[weeks.length - 1].length === 7) weeks.push([]);
      const current = new Date(date);
      weeks[weeks.length - 1].push({
        id: dateKey(current),
        date: current,
        activities: Number(activity[dateKey(current)] || 0),
        inRange: current >= start && current <= end,
      });
    }

    const months = [];
    for (let date = new Date(start); date <= end; date.setMonth(date.getMonth() + 1)) {
      const first = new Date(date);
      first.setDate(1);
      const last = new Date(first);
      last.setMonth(last.getMonth() + 1, 0);
      const firstWeekIndex = weekIndex(first);
      const lastWeekIndex = weekIndex(last > end ? end : last);
      months.push({
        label: first.toLocaleString('en', { month: 'short' }),
        firstWeekIndex,
        lastWeekIndex,
        weekCount: lastWeekIndex - firstWeekIndex + 1,
      });
    }

    const counts = Object.values(activity);
    let maxStreak = 0;
    let currentStreak = 0;
    counts.forEach(count => {
      if (count > 0) {
        currentStreak += 1;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else currentStreak = 0;
=======
  const mondayOffset = (date) => (date.getDay() + 6) % 7;
  const gridStart = new Date(start);
  gridStart.setDate(start.getDate() - mondayOffset(start));
  const gridEnd = new Date(end);
  gridEnd.setDate(end.getDate() + (6 - mondayOffset(end)));
  const weekIndex = (date) => Math.floor((date - gridStart) / 86400000 / 7);

  const weeks = [];
  for (let date = new Date(gridStart); date <= gridEnd; date.setDate(date.getDate() + 1)) {
    if (!weeks.length || weeks[weeks.length - 1].length === 7) weeks.push([]);
    const current = new Date(date);
    weeks[weeks.length - 1].push({
      id: dateKey(current),
      date: current,
      activities: Number(counts[dateKey(current)]) || 0,
      inRange: current >= start && current <= end,
>>>>>>> Stashed changes
    });
  }

  const months = [];
  for (let date = new Date(start); date <= end; date.setMonth(date.getMonth() + 1)) {
    const first = new Date(date);
    first.setDate(1);
    const last = new Date(first);
    last.setMonth(last.getMonth() + 1, 0);
    const firstWeekIndex = weekIndex(first);
    const lastWeekIndex = weekIndex(last > end ? end : last);
    months.push({
      label: first.toLocaleString('en', { month: 'short' }),
      firstWeekIndex,
      lastWeekIndex,
      weekCount: lastWeekIndex - firstWeekIndex + 1,
    });
  }

  const values = weeks.flat().filter((c) => c.inRange).map((c) => c.activities);
  let maxStreak = 0;
  let currentStreak = 0;
  values.forEach((count) => {
    if (count > 0) {
      currentStreak += 1;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else currentStreak = 0;
  });

  return {
    weeks,
    months,
    totalActivities: values.reduce((s, n) => s + n, 0),
    activeDays: values.filter(Boolean).length,
    maxStreak,
  };
}

export function useLearningStreak() {
  const [counts, setCounts] = useState(() => activityService.peekCalendar() || {});
  const [loading, setLoading] = useState(() => !activityService.peekCalendar());
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    activityService
      .getCalendar()
      .then((data) => active && setCounts(data || {}))
      .catch((err) => active && setError(err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
<<<<<<< Updated upstream
  })();
=======
  }, []);

  const [grid, setGrid] = useState(() => buildGrid(activityService.peekCalendar() || {}));
  useEffect(() => {
    setGrid(buildGrid(counts));
  }, [counts]);

  return { ...grid, loading, error };
>>>>>>> Stashed changes
}

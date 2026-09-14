import { useMemo } from 'react';

const dateKey = date => date.toISOString().slice(0, 10);
export function useLearningStreak() {
  return useMemo(() => {
    const end = new Date();
    end.setHours(12, 0, 0, 0);
    const start = new Date(end);
    start.setMonth(start.getMonth() - 11);
    start.setDate(1);

    const mondayOffset = date => (date.getDay() + 6) % 7;
    const gridStart = new Date(start);
    gridStart.setDate(start.getDate() - mondayOffset(start));
    const gridEnd = new Date(end);
    gridEnd.setDate(end.getDate() + (6 - mondayOffset(end)));
    const weekIndex = date => Math.floor((date - gridStart) / 86400000 / 7);

    const activity = {};
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      // Seeded mock data: sparse like a real contribution calendar, but stable between renders.
      const base = (date.getFullYear() * 23 + (date.getMonth() + 1) * 47 + date.getDate() * 71 + date.getDay() * 13) % 100;
      const seasonalShift = (date.getMonth() * 3 + date.getFullYear()) % 9;
      const seed = (base + seasonalShift) % 100;
      activity[dateKey(date)] = seed < 72 ? 0 : seed < 91 ? 1 : seed < 97 ? 2 : seed < 99 ? 3 : 5;
    }

    const weeks = [];
    for (let date = new Date(gridStart); date <= gridEnd; date.setDate(date.getDate() + 1)) {
      if (!weeks.length || weeks[weeks.length - 1].length === 7) weeks.push([]);
      const current = new Date(date);
      weeks[weeks.length - 1].push({
        id: dateKey(current),
        date: current,
        activities: activity[dateKey(current)] || 0,
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
    });

    return {
      weeks,
      months,
      totalActivities: counts.reduce((sum, count) => sum + count, 0),
      activeDays: counts.filter(Boolean).length,
      maxStreak,
    };
  }, []);
}

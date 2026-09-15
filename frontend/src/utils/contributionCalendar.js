const DAY_MS = 86400000;
const keyFor = date => date.toISOString().slice(0, 10);

export function buildContributionCalendar(endDate = new Date()) {
  const end = new Date(endDate); end.setHours(12, 0, 0, 0);
  const start = new Date(end); start.setMonth(start.getMonth() - 11); start.setDate(1); start.setHours(12, 0, 0, 0);
  const gridStart = new Date(start); gridStart.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  const gridEnd = new Date(end); gridEnd.setDate(end.getDate() + (7 - ((end.getDay() + 6) % 7) - 1));
  const activity = {};
  for (let cursor = new Date(start); cursor <= end; cursor = new Date(cursor.getTime() + DAY_MS)) {
    const seed = (cursor.getDate() * 17 + (cursor.getMonth() + 3) * 11 + cursor.getDay() * 7) % 19;
    activity[keyFor(cursor)] = seed < 8 ? 0 : seed < 12 ? 1 : seed < 16 ? 2 : seed < 18 ? 4 : 7;
  }
  const weeks = [];
  for (let cursor = new Date(gridStart); cursor <= gridEnd; cursor = new Date(cursor.getTime() + DAY_MS)) {
    const week = weeks[weeks.length - 1]; if (!week || week.length === 7) weeks.push([]);
    const date = new Date(cursor); const key = keyFor(date);
    weeks[weeks.length - 1].push({ date, key, count: activity[key] ?? 0, inRange: date >= start && date <= end });
  }
  const months = []; for (let i = 0; i < 12; i++) { const date = new Date(start); date.setMonth(start.getMonth() + i); months.push({ label: date.toLocaleString('en', { month: 'short' }), key: `${date.getFullYear()}-${date.getMonth()}` }); }
  const totalSubmissions = Object.values(activity).reduce((sum, count) => sum + count, 0);
  return { weeks, months, totalSubmissions, activeDays: Object.values(activity).filter(Boolean).length };
}

export function getActivityLevel(count) { return count === 0 ? 0 : count <= 1 ? 1 : count <= 3 ? 2 : count <= 6 ? 3 : 4; }

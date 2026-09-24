import { useMemo } from 'react';
import { useContributionActivity } from '../../hooks/useContributionActivity';
import { getActivityLevel } from '../../utils/contributionCalendar';

const levelClass: Record<number, string> = {
  0: 'bg-[#1e1e30]',
  1: 'bg-teal-950',
  2: 'bg-teal-800',
  3: 'bg-teal-500',
  4: 'bg-teal-300',
};

const dayLabels = ['Mon', '', 'Wed', '', 'Fri', '', ''];

function formatDate(date: Date) {
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ActivityHeatmap() {
  const { weeks, totalSubmissions, activeDays, loading, error } = useContributionActivity();

  // GitHub-style month labels: label a week column when it holds the 1st of a month.
  const monthLabels = useMemo(() => {
    const seen = new Set<string>();
    return weeks.map((week) => {
      const first = week.find((d: any) => d.inRange && d.date.getDate() <= 7);
      if (!first) return '';
      const key = `${first.date.getFullYear()}-${first.date.getMonth()}`;
      if (seen.has(key)) return '';
      seen.add(key);
      return first.date.toLocaleString('en', { month: 'short' });
    });
  }, [weeks]);

  if (loading) {
    return (
      <div className="card-dark rounded-2xl p-6">
        <div className="h-4 w-40 rounded bg-[#1e1e30] animate-pulse mb-4" />
        <div className="h-28 rounded bg-[#0f0f1a] animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-dark rounded-2xl p-6 text-sm text-[#64748b]">
        Activity is unavailable right now.
      </div>
    );
  }

  return (
    <div className="card-dark rounded-2xl p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-bold text-white">Activity</h2>
        <div className="text-xs text-[#64748b]">
          <span className="text-white font-semibold">{totalSubmissions}</span> actions ·{' '}
          <span className="text-white font-semibold">{activeDays}</span> active days · last 12 months
        </div>
      </div>

      <div className="overflow-x-auto hide-scrollbar pb-1">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex gap-[3px] mb-1 ml-8">
            {monthLabels.map((label, i) => (
              <span key={i} className="w-[11px] shrink-0 text-[9px] text-[#475569] overflow-visible whitespace-nowrap">
                {label}
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            {/* Day-of-week labels */}
            <div className="grid grid-rows-7 gap-[3px] shrink-0">
              {dayLabels.map((label, i) => (
                <span key={i} className="h-[11px] leading-[11px] text-[9px] text-[#475569] pr-1">
                  {label}
                </span>
              ))}
            </div>

            {/* Weeks */}
            <div className="flex gap-[3px]">
              {weeks.map((week: any[], wi: number) => (
                <div key={wi} className="grid grid-rows-7 gap-[3px]">
                  {week.map((day: any) => (
                    <div
                      key={day.key}
                      title={`${formatDate(day.date)} — ${day.count} ${day.count === 1 ? 'activity' : 'activities'}`}
                      className={`group relative w-[11px] h-[11px] rounded-[3px] ${day.inRange ? levelClass[getActivityLevel(day.count)] : 'bg-transparent'}`}
                    >
                      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block whitespace-nowrap rounded-md bg-[#1e1e30] border border-[#2e2e45] px-2 py-1 text-[10px] text-white shadow-xl z-10">
                        {formatDate(day.date)} · {day.count} {day.count === 1 ? 'activity' : 'activities'}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1.5 mt-3">
            <span className="text-[10px] text-[#64748b]">Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <span key={level} className={`w-[11px] h-[11px] rounded-[3px] ${levelClass[level]}`} />
            ))}
            <span className="text-[10px] text-[#64748b]">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

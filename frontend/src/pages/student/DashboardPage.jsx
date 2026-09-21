import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { Link } from '../../context/RouteContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { StatCard } from '../../components/dashboard/StatCard';
import { LearningStreak } from '../../components/dashboard/LearningStreak';
import { ContinueLearning } from '../../components/dashboard/ContinueLearning';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { usePlacementReadiness } from '../../hooks/usePlacementReadiness';
import { useAuth } from '../../context/AuthContext';

export function DashboardPage() {
  const { data, loading, error } = useDashboard();
  const readiness = usePlacementReadiness();
  const { user } = useAuth();
  const firstName = (user?.name || 'there').split(' ')[0];

  if (loading) return <div className="dashboard-page"><div className="dashboard-panel loading-panel">Loading your dashboardΓÇª</div></div>;
  if (error) return <div className="dashboard-page"><div className="dashboard-panel loading-panel">Failed to load dashboard: {error.message || error}. Please refresh.</div></div>;
  if (!data) return <div className="dashboard-page"><div className="dashboard-panel loading-panel">No dashboard data yet.</div></div>;

  return (
    <div className="dashboard-page">
      <DashboardHeader name={firstName} />
      <div className="stats-grid">{data.stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}</div>
      <Link className="dashboard-readiness-link" href="/placement-readiness">
        <div>
          <span className="section-kicker">PLACEMENT READINESS</span>
          <strong>{readiness.score}%</strong>
          <span>{readiness.level}</span>
        </div>
        <b>View readiness Γåù</b>
      </Link>
      <LearningStreak />
      <div className="dashboard-bottom">
        <ContinueLearning course={data.course} />
        <RecentActivity activities={data.recentActivity} />
      </div>
    </div>
  );
}

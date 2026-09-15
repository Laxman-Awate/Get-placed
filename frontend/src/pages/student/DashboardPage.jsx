import React from 'react';
import { DASHBOARD_STATS } from '../../constants/dashboard';
import { useDashboard } from '../../hooks/useDashboard';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { StatCard } from '../../components/dashboard/StatCard';
import { LearningStreak } from '../../components/dashboard/LearningStreak';
import { ContinueLearning } from '../../components/dashboard/ContinueLearning';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { usePlacementReadiness } from '../../hooks/usePlacementReadiness';
export function DashboardPage() { const { data, loading } = useDashboard(); const readiness = usePlacementReadiness(); return <div className="dashboard-page"><DashboardHeader /><div className="stats-grid">{DASHBOARD_STATS.map(stat => <StatCard key={stat.label} stat={stat} />)}</div><a className="dashboard-readiness-link" href="/placement-readiness"><div><span className="section-kicker">PLACEMENT READINESS</span><strong>{readiness.score}%</strong><span>{readiness.level}</span></div><b>View readiness ↗</b></a>{loading ? <div className="dashboard-panel loading-panel">Loading your activity…</div> : <><LearningStreak /><div className="dashboard-bottom"><ContinueLearning course={data.course} /><RecentActivity activities={data.recentActivity} /></div></>}</div>; }

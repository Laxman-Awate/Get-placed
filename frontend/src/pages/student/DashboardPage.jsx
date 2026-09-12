import React from 'react';
import { DASHBOARD_STATS } from '../../constants/dashboard';
import { useDashboard } from '../../hooks/useDashboard';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { StatCard } from '../../components/dashboard/StatCard';
import { LearningStreak } from '../../components/dashboard/LearningStreak';
import { ContinueLearning } from '../../components/dashboard/ContinueLearning';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
export function DashboardPage() { const { data, loading } = useDashboard(); return <div className="dashboard-page"><DashboardHeader /><div className="stats-grid">{DASHBOARD_STATS.map(stat => <StatCard key={stat.label} stat={stat} />)}</div>{loading ? <div className="dashboard-panel loading-panel">Loading your activity…</div> : <><LearningStreak /><div className="dashboard-bottom"><ContinueLearning course={data.course} /><RecentActivity activities={data.recentActivity} /></div></>}</div>; }

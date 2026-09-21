import React from 'react';
import { Link } from '../../context/RouteContext';

export function DashboardHeader({ name = 'there' }) {
  return (
    <div className="dashboard-header">
      <div>
        <span className="section-kicker">STUDENT DASHBOARD</span>
        <h1>Welcome back, {name} <span>👋</span></h1>
        <p>Keep building your skills. You&apos;re getting closer to your goal.</p>
      </div>
      <Link className="button" href="/mock-tests">Take assessment <span>↗</span></Link>
    </div>
  );
}

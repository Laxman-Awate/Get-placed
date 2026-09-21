import React from 'react';
export function RecentActivity({ activities }) {
  const list = Array.isArray(activities) ? activities : [];
  return (
    <section className="recent-card dashboard-panel">
      <div className="panel-heading"><div><h2>Recent activity</h2><p>Small steps add up.</p></div></div>
      <div className="activity-list">
        {list.length === 0 && <p className="activity-empty">No activity yet — solve a DSA problem or take a mock test.</p>}
        {list.map((activity) => (
          <div className="activity-row" key={activity.title}>
            <span className={`activity-icon ${activity.tone || 'blue'}`}>{activity.icon || '•'}</span>
            <div><strong>{activity.title}</strong><small>{activity.meta}</small></div>
            <span className="activity-arrow">›</span>
          </div>
        ))}
      </div>
    </section>
  );
}

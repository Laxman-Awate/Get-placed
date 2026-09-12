import React from 'react';
export function StatCard({ stat }) { return <article className="stat-card"><span className={`stat-icon ${stat.tone}`}>{stat.icon}</span><small>{stat.label}</small><strong>{stat.value}</strong><b>{stat.change}</b></article>; }

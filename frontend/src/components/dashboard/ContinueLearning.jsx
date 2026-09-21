import React from 'react';
import { Link } from '../../context/RouteContext';

export function ContinueLearning({ course }) {
  if (!course) return null;
  const progress = Number(course.progress) || 0;
  return (
    <section className="continue-card dashboard-panel">
      <div className="course-top"><span className="course-icon">⌘</span><span className="premium-mini">FREE PATH</span></div>
      <small>CONTINUE LEARNING</small>
      <h2>{course.title}</h2>
      <div className="progress-line"><span><i style={{ width: `${progress}%` }} /></span><b>{progress}%</b></div>
      <p>Next up: <strong>{course.next}</strong></p>
      <Link className="text-button" href="/learning/dsa">Continue learning <span>↗</span></Link>
    </section>
  );
}

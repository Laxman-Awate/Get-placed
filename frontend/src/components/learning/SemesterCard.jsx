import React from 'react';
import { Link } from '../../context/RouteContext';

export function SemesterCard({ semester, resource }) {
  const hasResource = Boolean(resource?.driveUrl);
  return <article className="learning-card semester-card academic-resource-card"><div className="semester-number">{semester.id.replace('semester-', '0')}</div><div><h3>{semester.name}</h3><p>Academic notes &amp; resources</p></div>{hasResource ? <Link className="card-link" href={resource.driveUrl} target="_blank" rel="noopener noreferrer">Access Notes <span>↗</span></Link> : <span className="card-link card-link-disabled">Notes coming soon</span>}</article>;
}

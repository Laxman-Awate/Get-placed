import React from 'react';

export function SemesterCard({ semester, resource }) {
  const hasResource = Boolean(resource?.driveUrl);
  return <article className="learning-card semester-card academic-resource-card"><div className="semester-number">{semester.id.replace('semester-', '0')}</div><div><h3>{semester.name}</h3><p>Academic notes &amp; resources</p></div>{hasResource ? <a className="card-link" href={resource.driveUrl} target="_blank" rel="noopener noreferrer">Access Notes <span>↗</span></a> : <span className="card-link card-link-disabled">Notes coming soon</span>}</article>;
}

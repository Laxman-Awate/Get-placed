import React, { useState } from 'react';
import { DSAProblemRow } from './DSAProblemRow';

export function DSATopicSection({ topic, problems, onStatus, onBookmark }) {
  const [open, setOpen] = useState(true);
  const solved = problems.filter(problem => problem.solved).length;
  return <section className="dsa-topic-section"><button className="topic-section-head" aria-expanded={open} onClick={() => setOpen(!open)}><span className="topic-chevron" aria-hidden="true">{open ? '⌄' : '›'}</span><div><h2>{String(topic.order).padStart(2, '0')}. {topic.name}</h2><p>{topic.description}</p></div><strong>{solved} / {problems.length}</strong></button>{open && <div className="dsa-problem-list">{problems.length ? problems.map(problem => <DSAProblemRow key={problem.id} problem={problem} topic={topic} onStatus={onStatus} onBookmark={onBookmark} />) : <p className="empty-problems">No problems in this topic yet.</p>}</div>}</section>;
}

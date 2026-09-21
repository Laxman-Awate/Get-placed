import React from 'react';
import { BookmarkButton } from './BookmarkButton';
import { ProblemStatus } from './ProblemStatus';
import { Link } from '../../context/RouteContext';
export function DSAProblemRow({ problem, topic, onStatus, onBookmark }) { const href = `/coding/problems/${problem.id}`; return <article className="dsa-problem-row"><span className="problem-number">{String(problem.number).padStart(2, '0')}</span><div className="problem-title"><Link href={href}>{problem.title}</Link><small>{topic?.name || problem.topicId} · {problem.pattern}</small></div><span className={`difficulty ${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span><ProblemStatus solved={problem.solved} onClick={() => onStatus(problem.id, !problem.solved)} /><BookmarkButton active={problem.bookmarked} onClick={() => onBookmark(problem.id)} /><Link className="open-problem" href={href}>Open <span>↗</span></Link></article>; }

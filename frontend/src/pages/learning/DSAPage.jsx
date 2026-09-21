import React, { useEffect, useState } from 'react';
import { learningService } from '../../services/learningService';
import { TopicCard } from '../../components/learning/TopicCard';
import { LearningBreadcrumbs } from '../../components/learning/LearningBreadcrumbs';

export function DSAPage() {
  const [modules, setModules] = useState(() => learningService.peekLearning()?.dsaModules || []);
  useEffect(() => { learningService.getDSAModules().then(setModules); }, []);
  return <div className="learning-page"><LearningBreadcrumbs items={[{ label: 'Learning', href: '/learning' }, { label: 'DSA' }]} /><div className="page-title"><span className="section-kicker">DSA FUNDAMENTALS · FREE</span><h1>Data Structures & Algorithms</h1><p>A structured roadmap from first principles to confident problem solving.</p></div>{['Beginner', 'Intermediate', 'Advanced'].map((level) => <section className="dsa-level" key={level}><div className="learning-section-head"><div><span className="level-label">{level}</span><h2>{level} foundations</h2></div></div><div className="topic-grid">{modules.filter((module) => module.level === level).map((module) => <TopicCard topic={module} href={`/learning/dsa/${module.id}`} key={module.id} />)}</div></section>)}</div>;
}

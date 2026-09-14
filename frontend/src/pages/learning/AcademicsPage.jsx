import React from 'react';
import { SEMESTERS } from '../../constants/learning';
import { ACADEMIC_RESOURCES } from '../../constants/academics';
import { SemesterCard } from '../../components/learning/SemesterCard';
import { LearningBreadcrumbs } from '../../components/learning/LearningBreadcrumbs';

export function AcademicsPage() { return <div className="learning-page"><LearningBreadcrumbs items={[{ label: 'Learning', href: '/learning' }, { label: 'Academics' }]} /><div className="page-title"><span className="section-kicker">ACADEMIC RESOURCES · FREE</span><h1>Academics</h1><p>Access semester-wise academic notes and study resources whenever you need them.</p><small className="academics-note">A helpful student resource, kept separate from your main placement preparation.</small></div><div className="learning-section-head"><div><h2>Choose your semester</h2><p>Open the notes and resources for your current semester.</p></div></div><div className="semester-grid full-semesters">{SEMESTERS.map(semester => <SemesterCard semester={semester} resource={ACADEMIC_RESOURCES[semester.id]} key={semester.id} />)}</div></div>; }

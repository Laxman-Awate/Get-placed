import React from 'react';
import { SEMESTERS } from '../../constants/learning';
import { SemesterCard } from '../../components/learning/SemesterCard';
import { LearningBreadcrumbs } from '../../components/learning/LearningBreadcrumbs';
export function AcademicsPage() { return <div className="learning-page"><LearningBreadcrumbs items={[{ label: 'Learning', href: '/learning' }, { label: 'Academics' }]} /><div className="page-title"><span className="section-kicker">ACADEMIC RESOURCES · FREE</span><h1>Academics</h1><p>Choose your semester and keep your coursework moving forward.</p></div><div className="learning-section-head"><div><h2>Choose your semester</h2><p>Academic content is organized around your college journey.</p></div></div><div className="semester-grid full-semesters">{SEMESTERS.map(semester => <SemesterCard semester={semester} key={semester.id} />)}</div></div>; }

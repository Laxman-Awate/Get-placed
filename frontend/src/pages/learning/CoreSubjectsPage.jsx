import React, { useEffect, useState } from 'react';
import { learningService } from '../../services/learningService';

export function CoreSubjectsPage() {
  const [subjects,setSubjects]=useState([]);
  useEffect(()=>{learningService.getSubjects().then(setSubjects)},[]);
  return <div className="learning-page core-subjects-page">
    <div className="page-title"><span className="section-kicker">CORE COMPUTER SCIENCE</span><h1>Core subjects</h1><p>Build the fundamentals interviewers expect from every placement-ready student.</p></div>
    <div className="core-subject-grid">
      {subjects.map(subject => <article className="core-subject-card" key={subject.id}><span className="subject-icon">◆</span><h2>{subject.name}</h2><p>{subject.code} · {subject.topics} topics</p><button className="text-button" type="button">Start learning <span>↗</span></button></article>)}
    </div>
  </div>;
}

import React from 'react';

const subjects = [
  ['OOP', 'Build strong object-oriented design fundamentals.'],
  ['DBMS', 'Understand data modelling, queries and transactions.'],
  ['Operating Systems', 'Prepare processes, memory and concurrency concepts.'],
  ['Computer Networks', 'Learn the protocols behind modern applications.'],
  ['Software Engineering', 'Revise development lifecycles and best practices.'],
  ['SQL', 'Practice the queries asked in placement interviews.'],
];

export function CoreSubjectsPage() {
  return <div className="learning-page core-subjects-page">
    <div className="page-title"><span className="section-kicker">CORE COMPUTER SCIENCE</span><h1>Core subjects</h1><p>Build the fundamentals interviewers expect from every placement-ready student.</p></div>
    <div className="core-subject-grid">
      {subjects.map(([title, description]) => <article className="core-subject-card" key={title}><span className="subject-icon">◆</span><h2>{title}</h2><p>{description}</p><button className="text-button" type="button">Start learning <span>↗</span></button></article>)}
    </div>
  </div>;
}

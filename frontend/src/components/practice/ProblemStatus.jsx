import React from 'react';
export function ProblemStatus({ solved, onClick }) { return <button className={solved ? 'problem-status solved' : 'problem-status'} onClick={onClick} aria-label={solved ? 'Mark problem unsolved' : 'Mark problem solved'}><span>{solved ? '✓' : '○'}</span>{solved ? 'Solved' : 'Unsolved'}</button>; }

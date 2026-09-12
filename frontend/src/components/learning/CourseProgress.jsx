import React from 'react';
export function CourseProgress({ progress }) { return <div className="course-progress"><span><i style={{ width: `${progress}%` }} /></span><b>{progress}% complete</b></div>; }

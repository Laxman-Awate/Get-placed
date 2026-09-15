import React from 'react';
export function LearningBreadcrumbs({ items }) { return <nav className="learning-breadcrumbs" aria-label="Breadcrumbs">{items.map((item, index) => <React.Fragment key={item.label}><a href={item.href || '#'}>{item.label}</a>{index < items.length - 1 && <span>/</span>}</React.Fragment>)}</nav>; }

import React from 'react';
import { Link } from '../../context/RouteContext';
export function LearningBreadcrumbs({ items }) { return <nav className="learning-breadcrumbs" aria-label="Breadcrumbs">{items.map((item, index) => <React.Fragment key={item.label}><Link href={item.href || '#'}>{item.label}</Link>{index < items.length - 1 && <span>/</span>}</React.Fragment>)}</nav>; }

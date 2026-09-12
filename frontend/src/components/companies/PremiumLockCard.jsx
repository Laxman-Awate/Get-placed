import React from 'react';
export function PremiumLockCard({ title, description, href = '/pricing', action = 'Unlock premium' }) { return <article className="premium-lock-card"><span className="lock-icon">⌕</span><div><span className="premium-label">PREMIUM MODULE</span><h3>{title}</h3><p>{description}</p></div><a className="button" href={href}>{action} <span>↗</span></a></article>; }

import React from 'react';
import { Arrow } from '../common/Logo';

export function PricingCard({ plan }) {
  return <article className={plan.featured ? 'price-card featured' : 'price-card'}>{plan.featured && <span className="popular-badge">GOOD PLACE TO START</span>}<span className="plan-label">{plan.eyebrow}</span><h3>{plan.name}</h3><div className="price-value">{plan.price}<small>{plan.period}</small></div><p>{plan.description}</p><ul>{plan.features.map(feature => <li key={feature}>{feature}</li>)}</ul><button className={plan.featured ? 'button full' : 'outline-button'}>{plan.action} <Arrow /></button></article>;
}

import React from 'react';
import { PRICING_PLANS } from '../../constants/pricing';
import { PricingCard } from '../../components/pricing/PricingCard';

export function PricingPage() { return <section className="pricing-page page-width"><div className="section-heading centered"><span className="section-kicker">SIMPLE, HONEST PREPARATION</span><h1>Choose how you want<br /><em>to get started.</em></h1><p>Start free, try a focused starter pack, or unlock complete placement preparation when you're ready.</p></div><div className="pricing-grid">{PRICING_PLANS.map(plan => <PricingCard key={plan.name} plan={plan} />)}</div><p className="pricing-note">Starter packs are one-time entry products. Premium monthly and yearly options will be available when payments are connected.</p></section>; }

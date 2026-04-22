'use client'

import { useState } from 'react'
import { PlatformWaitlist } from './PlatformWaitlist'
import { Button } from './Button'


const pricingTiers = [
  {
    id: 'ignition',
    name: 'Catalyst Ignition',
    priceUSD: '$49',
    priceINR: '₹2,499',
    period: '/month',
    target: 'For professionals who need to pass the machine filter instantly.',
    outcome: 'Bypass ATS algorithms and stop getting auto-rejected.',
    features: [
      'ATS Stress Testing (See what the algorithm sees)',
      'Live Market Value Benchmark',
      'Baseline Resume Scoring',
    ],
    waitlist: true,
  },
  {
    id: 'pro',
    name: 'Catalyst Pro',
    priceUSD: '$249',
    priceINR: '₹14,999',
    period: '/month',
    target: 'For ambitious managers positioning for executive transition.',
    outcome: 'Total narrative control and data-driven career trajectory.',
    features: [
      'Everything in Ignition, plus:',
      'Narrative Discretion Engine (Hide your red flags)',
      'Network Gravity Tracker (Find internal champions)',
      'Career Pathing Canvas (Map next 3 years)',
    ],
    featured: true,
    waitlist: true,
  },
  {
    id: 'elite',
    name: 'Market Value Audit',
    priceUSD: '$199',
    priceINR: '₹5,999',
    period: '/session',
    target: 'For executives who need a clear, data-backed answer to "what am I actually worth?"',
    outcome: '45-minute 1:1 call that gives you your exact market position and a concrete action plan.',
    features: [
      'Talent Positioning Index (TPI) score diagnostic',
      'ATS gap analysis — see what recruiters see',
      'Salary benchmark vs. live market data',
      'Specific 3-step action plan to close the gap',
    ],
    waitlist: false,
    href: '/book/audit',
  },
]

export function PricingSection() {
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD')

  return (
    <div className="mb-20 pt-16" id="pricing">
      {/* Header & Toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="font-serif text-bone text-4xl font-light mb-4">
            Don&apos;t guess what your career is worth.<br />
            <span className="text-signal-gold">Engineer it.</span>
          </h2>
          <p className="font-sans text-muted text-base max-w-xl">
            Choose the intelligence tier that matches your career velocity. 
            The <strong className="text-bone">Market Value Audit</strong> is available for booking right now. 
            SaaS subscriptions (Ignition &amp; Pro) launch July 2026 — join the waitlist to lock in early pricing.
          </p>
        </div>
        
        {/* Currency Toggle */}
        <div className="flex items-center bg-obsidian border border-graphite p-1 rounded-sm shrink-0">
          <button 
            onClick={() => setCurrency('USD')}
            className={`px-6 py-2 text-sm font-mono tracking-widest transition-colors ${currency === 'USD' ? 'bg-graphite text-signal-gold' : 'text-muted hover:text-bone'}`}
          >
            GLOBAL (USD)
          </button>
          <button 
            onClick={() => setCurrency('INR')}
            className={`px-6 py-2 text-sm font-mono tracking-widest transition-colors ${currency === 'INR' ? 'bg-graphite text-signal-gold' : 'text-muted hover:text-bone'}`}
          >
            INDIA (INR)
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {pricingTiers.map((tier) => (
          <div
            key={tier.id}
            className={`flex flex-col relative transition-all duration-300 ${
              tier.featured 
                ? 'bg-obsidian border border-signal-gold/50 shadow-2xl shadow-signal-gold/5 lg:scale-105 z-10 p-10' 
                : 'bg-obsidian/40 border border-graphite/40 opacity-90 hover:opacity-100 p-8'
            }`}
          >
            {tier.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-signal-gold text-obsidian font-mono text-[0.65rem] tracking-widest font-bold uppercase">
                The Core Target
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="font-serif text-bone text-2xl font-light mb-4">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-serif text-bone text-4xl">
                  {currency === 'USD' ? tier.priceUSD : tier.priceINR}
                </span>
                <span className="font-serif text-muted text-lg">{tier.period}</span>
              </div>
              <p className="font-sans text-muted text-sm leading-relaxed min-h-[40px]">
                {tier.target}
              </p>
            </div>

            <div className="bg-graphite/30 p-4 border-l-2 border-signal-gold mb-6">
              <p className="font-mono text-signal-gold text-[0.6rem] tracking-widest mb-1 uppercase">Outcome</p>
              <p className="font-sans text-bone text-sm">{tier.outcome}</p>
            </div>

            <ul className="flex flex-col gap-3 flex-1 mb-8">
              {tier.features.map((m, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-signal-gold text-xs mt-1 shrink-0">◈</span>
                  <span className="font-sans text-muted text-sm">{m}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              {tier.waitlist ? (
                <PlatformWaitlist plan={tier.name} />
              ) : (
                <Button href={tier.href || '/'} variant="primary" className="w-full text-center">
                  Book {tier.name} →
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Trust & FAQ */}
      <div className="mt-32 border-t border-graphite pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <p className="label-inst mb-6">FAQ & Execution Logic</p>
            <h3 className="font-serif text-bone text-2xl font-light mb-8">Why should I choose Pro over Ignition?</h3>
            <p className="font-sans text-muted text-sm leading-relaxed mb-6">
              Ignition simply tells you where you are and scores your baseline resume. It shows you if the ATS is rejecting you. 
            </p>
            <p className="font-sans text-muted text-sm leading-relaxed">
              <strong>Catalyst Pro</strong> is the actual intelligence engine. It tells you exactly how to get to the next level, maps your specific network gaps, and hides the career &quot;red flags&quot; preventing your promotion. It is active acceleration versus passive observation.
            </p>
          </div>
          <div className="bg-obsidian border border-graphite p-8">
            <h3 className="font-serif text-bone text-xl font-light mb-6">Will this work for my industry?</h3>
            <p className="font-sans text-muted text-sm leading-relaxed mb-6">
              The engine is calibrated against real-time global labor market data pulling directly from live ATS systems. If your industry hires through digital tracking systems, the Catalyst engine maps the ontology.
            </p>
            <h3 className="font-serif text-bone text-xl font-light mb-6">What exactly do I get from the Market Value Audit?</h3>
            <p className="font-sans text-muted text-sm leading-relaxed mb-6">
              A focused 45-minute 1:1 video call with a Catalyst expert. You&apos;ll walk away with your TPI score, a full ATS gap analysis, your salary benchmark vs. live market data, and a 3-step action plan. Booked immediately — no waitlist.
            </p>
            <h3 className="font-serif text-bone text-xl font-light mb-6 mt-8">When do I get access to the SaaS platform?</h3>
            <p className="font-sans text-muted text-sm leading-relaxed">
              The SaaS platform (Ignition &amp; Pro) launches globally in July 2026. Joining the waitlist locks in the early-access pricing shown above forever. If you need immediate positioning help, book the <strong>Market Value Audit</strong> — available now.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

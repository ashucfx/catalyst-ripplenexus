'use client'

import { useState } from 'react'
import { PlatformWaitlist } from './PlatformWaitlist'
import { Button } from './Button'

const subscriptionPlans = [
  {
    id: 'ignition',
    name: 'Catalyst Ignition',
    priceUSD: '$49',
    priceINR: '₹2,499',
    period: '/month',
    target: 'For professionals who need to pass the machine filter instantly.',
    outcome: 'Bypass ATS algorithms and stop getting auto-rejected.',
    features: [
      'ATS Stress Testing (Simulator Mode)',
      'Live Market Value Benchmark',
      'Baseline Resume Scoring (Technical)',
    ],
    waitlist: true,
  },
  {
    id: 'pro',
    name: 'Catalyst Pro',
    priceUSD: '$199',
    priceINR: '₹5,999',
    period: '/month',
    target: 'For ambitious leaders positioning for executive transition.',
    outcome: 'Total narrative control and data-driven trajectory.',
    features: [
      'Everything in Ignition, plus:',
      'Narrative Discretion Engine (Signal Masking)',
      'Network Gravity Tracker (Gap Mapping)',
      'Career Pathing Canvas (3-Year Modeling)',
    ],
    featured: true,
    waitlist: true,
  },
]

export function PricingSection() {
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD')

  return (
    <div className="mb-32 pt-24" id="pricing">
      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-12">
        <div className="max-w-2xl">
          <p className="label-inst mb-6">Subscription Intelligence</p>
          <h2 className="display-card text-4xl lg:text-5xl leading-tight mb-6">
            Don&apos;t guess what your career is worth.<br />
            <em className="text-signal-gold not-italic">Engineer it.</em>
          </h2>
          <p className="font-serif text-muted text-lg leading-relaxed">
            The SaaS platform (Ignition & Pro) launches globally in July 2026.
            Join the waitlist to secure early-access pricing and primary positioning data.
          </p>
        </div>
        
        {/* Currency Toggle */}
        <div className="flex items-center glass p-1 rounded-sm self-start">
          <button 
            onClick={() => setCurrency('USD')}
            className={`px-8 py-3 text-[0.6rem] font-mono tracking-widest transition-all duration-300 ${currency === 'USD' ? 'bg-signal-gold text-obsidian font-bold' : 'text-muted hover:text-bone'}`}
          >
            GLOBAL (USD)
          </button>
          <button 
            onClick={() => setCurrency('INR')}
            className={`px-8 py-3 text-[0.6rem] font-mono tracking-widest transition-all duration-300 ${currency === 'INR' ? 'bg-signal-gold text-obsidian font-bold' : 'text-muted hover:text-bone'}`}
          >
            INDIA (INR)
          </button>
        </div>
      </div>

      {/* ── SUBSCRIPTION GRID ────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-graphite/40 border border-graphite/40 mb-20">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            className={`flex flex-col bg-obsidian p-12 transition-all duration-500 ${
              plan.featured ? 'ring-1 ring-signal-gold/50 z-10' : 'opacity-90'
            }`}
          >
            {plan.featured && (
              <p className="label-inst mb-6">Institutional Intelligence</p>
            )}
            
            <div className="mb-10">
              <h3 className="display-card text-3xl mb-4">{plan.name}</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="display-card text-4xl">
                  {currency === 'USD' ? plan.priceUSD : plan.priceINR}
                </span>
                <span className="font-serif text-muted text-lg">{plan.period}</span>
              </div>
              <p className="font-sans text-muted text-sm leading-relaxed italic">
                {plan.target}
              </p>
            </div>

            <div className="bg-graphite/20 p-5 border-l-2 border-signal-gold mb-10">
              <p className="font-mono text-signal-gold text-[0.55rem] tracking-widest mb-1 uppercase">Strategic Outcome</p>
              <p className="font-serif text-bone text-sm">{plan.outcome}</p>
            </div>

            <ul className="flex flex-col gap-4 mb-12 flex-1">
              {plan.features.map((m, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="text-signal-gold text-[10px] mt-1 shrink-0">◈</span>
                  <span className="font-sans text-muted text-sm leading-snug">{m}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <PlatformWaitlist plan={plan.name} />
            </div>
          </div>
        ))}
      </div>

      {/* ── ONE-TIME ENGAGEMENTS ─────────────────────────────────── */}
      <div className="border border-graphite/40 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-12 border-b lg:border-b-0 lg:border-r border-graphite/40 bg-graphite/5">
            <p className="label-inst mb-4 opacity-70">Single Diagnostic</p>
            <h3 className="display-card text-2xl mb-6">Market Value Audit</h3>
            <p className="font-serif text-muted text-base leading-relaxed mb-10">
              A 45-minute intelligence brief surfacing your TPI score and direct salary
              benchmarking. Available for immediate booking.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="display-card text-3xl">$99</span>
                <span className="font-serif text-muted text-sm italic">/ ₹2,999</span>
              </div>
              <Button href="/audit" variant="ghost" className="px-6 py-3">
                Book Audit →
              </Button>
            </div>
          </div>
          
          <div className="p-12 bg-signal-gold/5 relative">
            <div className="absolute top-0 right-0 bg-signal-gold text-obsidian px-4 py-1 font-mono text-[0.5rem] tracking-widest font-bold uppercase">
              Limited Availability
            </div>
            <p className="label-inst mb-4">Hybrid Engagement</p>
            <h3 className="display-card text-2xl mb-6">Momentum Sprint</h3>
            <p className="font-serif text-muted text-base leading-relaxed mb-10">
              Everything in the Audit, plus a custom implementation roadmap and a
              structured 14-day execution plan for first-mile repositioning.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="display-card text-3xl">$199</span>
                <span className="font-serif text-muted text-sm italic">/ ₹5,999</span>
              </div>
              <Button href="/request?service=sprint" variant="primary" className="px-6 py-3">
                Start Sprint →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

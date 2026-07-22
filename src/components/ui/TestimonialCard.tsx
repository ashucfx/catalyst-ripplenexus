'use client'

import React, { useState } from 'react'
import { Testimonial } from '@/data/testimonialsData'

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const [showTransformation, setShowTransformation] = useState(false)

  return (
    <div
      className="card-glow relative p-8 lg:p-10 flex flex-col justify-between rounded-xl transition-all duration-300 hover:border-signal-gold/40 group"
      style={{
        background: 'rgba(12, 13, 16, 0.75)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Top Gold hairline highlight on hover */}
      <div
        className="absolute top-0 inset-x-0 h-px transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(184,147,91,0.8), transparent)',
        }}
      />

      <div>
        {/* Header row: Avatar, Name, Flag & Verified Tag */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Avatar Badge */}
            <div
              className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.avatarColor} flex items-center justify-center font-bold text-white text-sm shadow-lg shrink-0 border border-white/20`}
            >
              {testimonial.initials}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-bone text-lg font-semibold tracking-tight">
                  {testimonial.name}
                </h3>
                <span className="text-base" title={testimonial.location}>
                  {testimonial.countryFlag}
                </span>
                {testimonial.verified && (
                  <span className="inline-flex items-center gap-1 text-[0.6rem] font-mono tracking-wider uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                    </svg>
                    Verified Client
                  </span>
                )}
              </div>
              <p className="font-sans text-xs text-muted mt-0.5">
                {testimonial.role} • <span className="text-bone/80">{testimonial.location}</span>
              </p>
            </div>
          </div>

          {/* Salary Hike / Outcome Pill */}
          <div className="shrink-0 text-right">
            <span
              className="inline-block font-mono text-[0.65rem] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border text-signal-gold border-signal-gold/30"
              style={{ background: 'rgba(184,147,91,0.08)' }}
            >
              {testimonial.salaryIncrease}
            </span>
          </div>
        </div>

        {/* Rating Stars & Service Package Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-5 border-b border-white/[0.07]">
          <div className="flex items-center gap-1 text-signal-gold text-sm">
            {'★'.repeat(testimonial.rating)}
            <span className="font-mono text-xs text-bone ml-1 font-bold">5.0</span>
          </div>
          <span className="font-mono text-[0.58rem] tracking-wider uppercase text-muted/70 bg-white/[0.03] px-2.5 py-1 rounded border border-white/[0.05]">
            {testimonial.servicePackage}
          </span>
        </div>

        {/* Company Outcome */}
        <div className="mb-4">
          <p className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-signal-gold/80 mb-1">
            Career Milestone
          </p>
          <p className="font-sans text-sm font-medium text-bone">
            {testimonial.companyOutcome}
          </p>
        </div>

        {/* Quote Content */}
        <p className="font-serif text-muted text-sm leading-relaxed mb-6 italic">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        {/* Expandable Before / After Transformation Drawer */}
        {showTransformation ? (
          <div className="p-4 rounded-lg bg-obsidian/80 border border-white/10 space-y-3 mb-6 transition-all duration-300">
            <div>
              <span className="font-mono text-[0.52rem] text-red-400 tracking-wider uppercase font-bold block mb-1">
                Before Catalyst:
              </span>
              <p className="font-sans text-xs text-muted/90 leading-snug">
                {testimonial.beforeState}
              </p>
            </div>
            <div className="pt-2 border-t border-white/[0.06]">
              <span className="font-mono text-[0.52rem] text-emerald-400 tracking-wider uppercase font-bold block mb-1">
                After Catalyst:
              </span>
              <p className="font-sans text-xs text-bone leading-snug">
                {testimonial.afterState}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer Row: Toggle Transformation & Date */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.07]">
        <button
          onClick={() => setShowTransformation(!showTransformation)}
          className="font-mono text-[0.58rem] tracking-widest uppercase text-signal-gold hover:text-bone transition-colors flex items-center gap-1.5"
        >
          {showTransformation ? 'Hide Details ▲' : 'View Before / After ▼'}
        </button>
        <span className="font-mono text-[0.52rem] tracking-widest uppercase text-muted/50">
          {testimonial.date}
        </span>
      </div>
    </div>
  )
}

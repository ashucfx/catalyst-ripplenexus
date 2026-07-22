/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { Testimonial } from '@/data/testimonialsData'

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const [showTransformation, setShowTransformation] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <div
      className="card-glow relative p-6 sm:p-8 flex flex-col justify-between rounded-2xl transition-all duration-300 hover:border-signal-gold/40 group overflow-hidden"
      style={{
        background: 'rgba(12, 13, 16, 0.88)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Top Gold hairline highlight on hover */}
      <div
        className="absolute top-0 inset-x-0 h-px transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(184,147,91,0.8), transparent)',
        }}
      />

      <div>
        {/* Profile Row: Avatar, Name, Flag & Verified Pill */}
        <div className="flex items-start gap-4 mb-5">
          {/* Avatar Headshot Photo with Initials Fallback */}
          {testimonial.avatarUrl && !imgError ? (
            <img
              src={testimonial.avatarUrl}
              alt={testimonial.name}
              onError={() => setImgError(true)}
              className="w-14 h-14 rounded-full object-cover shadow-lg border-2 border-signal-gold/40 shrink-0"
            />
          ) : (
            <div
              className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.avatarColor} flex items-center justify-center font-bold text-white text-base shadow-lg shrink-0 border-2 border-white/20`}
            >
              {testimonial.initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-serif text-bone text-lg font-bold tracking-tight">
                {testimonial.name}
              </h3>
              <span className="text-base shrink-0" title={testimonial.location}>
                {testimonial.countryFlag}
              </span>
              {testimonial.verified && (
                <span className="inline-flex items-center gap-1 text-[0.55rem] font-mono tracking-wider uppercase text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded shrink-0">
                  <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  Verified Client
                </span>
              )}
            </div>

            <p className="font-sans text-xs text-muted/90 leading-snug">
              {testimonial.role} • <span className="text-bone/80 font-medium">{testimonial.location}</span>
            </p>
          </div>
        </div>

        {/* Outcome & Package Pills Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pb-4 border-b border-white/[0.07]">
          <span className="font-mono text-[0.62rem] font-bold tracking-wider uppercase px-3 py-1 rounded-full border text-signal-gold border-signal-gold/40 bg-signal-gold/10">
            {testimonial.salaryIncrease}
          </span>
          <span className="font-mono text-[0.58rem] tracking-wider uppercase text-muted/80 bg-white/[0.03] px-2.5 py-1 rounded border border-white/[0.06]">
            {testimonial.servicePackage}
          </span>
        </div>

        {/* Rating Stars & Career Milestone */}
        <div className="mb-4">
          <div className="flex items-center gap-1 text-signal-gold text-xs mb-2">
            {'★'.repeat(testimonial.rating)}
            <span className="font-mono text-xs text-bone ml-1 font-bold">5.0 Rating</span>
          </div>

          <p className="font-mono text-[0.52rem] tracking-[0.2em] uppercase text-signal-gold/90 mb-1 font-bold">
            Career Milestone
          </p>
          <p className="font-sans text-sm font-semibold text-bone leading-snug">
            {testimonial.companyOutcome}
          </p>
        </div>

        {/* Quote Content */}
        <p className="font-serif text-muted/90 text-sm leading-relaxed mb-6 italic">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        {/* Expandable Before / After Transformation Drawer */}
        {showTransformation ? (
          <div className="p-4 rounded-xl bg-black/70 border border-white/10 space-y-3 mb-6 transition-all duration-300">
            <div>
              <span className="font-mono text-[0.55rem] text-red-400 tracking-wider uppercase font-bold block mb-1">
                Before Catalyst:
              </span>
              <p className="font-sans text-xs text-muted/90 leading-relaxed">
                {testimonial.beforeState}
              </p>
            </div>
            <div className="pt-2 border-t border-white/[0.06]">
              <span className="font-mono text-[0.55rem] text-emerald-400 tracking-wider uppercase font-bold block mb-1">
                After Catalyst:
              </span>
              <p className="font-sans text-xs text-bone leading-relaxed">
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
          className="font-mono text-[0.58rem] tracking-widest uppercase text-signal-gold hover:text-bone transition-colors flex items-center gap-1.5 cursor-pointer"
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

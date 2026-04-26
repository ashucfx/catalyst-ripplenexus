'use client'

import type { IntakeData, ReportData } from '@/lib/db/portals'

interface Props {
  token:  string
  intake: IntakeData
  report: ReportData
}

const TIER_COLOR: Record<string, string> = {
  'Optimal':            'text-emerald-400',
  'Underperforming':    'text-signal-gold',
  'Critical Gap':       'text-amber-500',
  'Institutional Risk': 'text-red-400',
}

const DIM_LABEL: Record<string, string> = {
  narrative:    'Narrative',
  signal:       'Signal',
  sector:       'Sector',
  ats:          'ATS',
  compensation: 'Compensation',
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 65 ? 'bg-emerald-500' : score >= 45 ? 'bg-signal-gold' : 'bg-amber-600'
  return (
    <div className="h-0.5 w-full bg-graphite mt-2">
      <div className={`h-0.5 ${color} transition-all duration-700`} style={{ width: `${score}%` }} />
    </div>
  )
}

export function ReportView({ token, intake, report }: Props) {
  const tierColor = TIER_COLOR[report.tpi_tier] ?? 'text-signal-gold'
  const dateStr   = new Date(report.generated_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="space-y-24">

      {/* ── Header ── */}
      <div className="border-b border-graphite/40 pb-16">
        <p className="label-inst mb-6">Confidential · Market Value Audit</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
          <div>
            <h1 className="display-page mb-4">
              Talent Positioning<br />Intelligence Report
            </h1>
            <p className="font-serif text-muted text-lg">{intake.name}</p>
            <p className="font-mono text-muted/50 text-[0.6rem] tracking-widest mt-2">
              {dateStr.toUpperCase()}
            </p>
          </div>
          <div className="lg:text-right">
            <div className="flex items-end lg:justify-end gap-4 mb-3">
              <span className={`font-serif text-8xl leading-none ${tierColor}`}>
                {report.tpi_score}
              </span>
              <span className="font-serif text-muted text-3xl pb-2">/100</span>
            </div>
            <div className="inline-block border border-graphite/60 px-4 py-1">
              <span className={`font-mono text-[0.65rem] tracking-[0.25em] uppercase ${tierColor}`}>
                {report.tpi_tier}
              </span>
            </div>
            <p className="font-mono text-muted text-[0.55rem] tracking-widest mt-3">
              TALENT POSITIONING INDEX
            </p>
          </div>
        </div>
      </div>

      {/* ── Executive Summary ── */}
      <div>
        <p className="label-inst mb-8">01 · Executive Summary</p>
        <div className="prose-catalyst max-w-3xl">
          <p className="font-serif text-bone text-xl leading-relaxed">{report.executive_summary}</p>
          <p className="font-serif text-muted leading-relaxed mt-6">{report.market_position}</p>
        </div>
      </div>

      {/* ── Dimensions ── */}
      <div>
        <p className="label-inst mb-10">02 · Dimension Breakdown</p>
        <div className="flex flex-col divide-y divide-graphite/40">
          {Object.entries(report.dimensions).map(([key, dim]) => (
            <div key={key} className="py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div>
                <p className="font-mono text-muted text-[0.6rem] tracking-widest uppercase mb-3">
                  {DIM_LABEL[key] ?? key}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className={`font-serif text-5xl ${dim.score >= 65 ? 'text-signal-gold' : dim.score >= 45 ? 'text-amber-500' : 'text-red-400'}`}>
                    {dim.score}
                  </span>
                  <span className="font-serif text-muted text-xl">/100</span>
                </div>
                <ScoreBar score={dim.score} />
              </div>
              <div className="lg:col-span-3">
                <p className="font-serif text-muted leading-relaxed mb-5">{dim.analysis}</p>
                <div className="flex flex-col gap-2">
                  {dim.gaps.map((g, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="font-mono text-signal-gold text-[0.65rem] mt-1 shrink-0">—</span>
                      <p className="font-sans text-muted text-sm leading-relaxed">{g}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Salary Benchmark ── */}
      <div>
        <p className="label-inst mb-10">03 · Salary Benchmark</p>
        <div className="grid grid-cols-3 gap-px bg-graphite/40 border border-graphite/40 mb-8">
          {[
            { label: 'Your Current',  value: report.salary_benchmark.current,          highlight: false },
            { label: 'Market Rate',   value: report.salary_benchmark.market,            highlight: false },
            { label: 'Gap',           value: `–${report.salary_benchmark.gap_percentage}%`, highlight: true },
          ].map(c => (
            <div key={c.label} className={`${c.highlight ? 'bg-signal-gold/10' : 'bg-obsidian'} p-8`}>
              <p className="font-mono text-muted text-[0.55rem] tracking-widest mb-3">{c.label}</p>
              <p className={`font-serif text-2xl ${c.highlight ? 'text-signal-gold' : 'text-bone'}`}>
                {c.value}
              </p>
            </div>
          ))}
        </div>
        <p className="font-serif text-muted leading-relaxed max-w-2xl">
          {report.salary_benchmark.gap_narrative}
        </p>
      </div>

      {/* ── Critical Gaps ── */}
      <div>
        <p className="label-inst mb-10">04 · Critical Gaps</p>
        <div className="flex flex-col gap-px border border-graphite/40">
          {report.critical_gaps.map((gap, i) => (
            <div key={i} className="bg-obsidian p-8 flex gap-6 items-start border-b border-graphite/40 last:border-0">
              <span className="font-mono text-signal-gold text-[0.6rem] tracking-widest shrink-0 mt-1">
                0{i + 1}
              </span>
              <p className="font-serif text-bone leading-relaxed">{gap}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Roadmap ── */}
      <div>
        <p className="label-inst mb-10">05 · 90-Day Repositioning Roadmap</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-graphite/40 border border-graphite/40">
          {[
            { label: 'Week 1–2',    items: report.repositioning_roadmap.immediate   },
            { label: 'Week 3–4',    items: report.repositioning_roadmap.short_term  },
            { label: 'Month 2–3',   items: report.repositioning_roadmap.medium_term },
          ].map(col => (
            <div key={col.label} className="bg-obsidian p-8">
              <p className="font-mono text-signal-gold text-[0.6rem] tracking-widest mb-8 pb-4 border-b border-graphite/40">
                {col.label}
              </p>
              <div className="flex flex-col gap-4">
                {col.items.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="font-mono text-signal-gold/60 text-[0.65rem] mt-0.5 shrink-0">◈</span>
                    <p className="font-sans text-muted text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Trajectory ── */}
      <div>
        <p className="label-inst mb-8">06 · 12-Month Trajectory</p>
        <p className="font-serif text-muted leading-relaxed max-w-3xl text-lg">
          {report.trajectory_analysis}
        </p>
      </div>

      {/* ── PDF Download ── */}
      <div className="border-t border-graphite/40 pt-12">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div>
            <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-2">EXPORT</p>
            <p className="font-serif text-bone text-lg">Download your full report as a PDF.</p>
          </div>
          <a
            href={`/api/audit/report/${token}`}
            download
            className="inline-block bg-signal-gold text-obsidian px-8 py-4 font-sans text-[0.7rem]
                       tracking-[0.2em] uppercase hover:bg-bone transition-colors duration-200
                       shrink-0"
          >
            Download PDF →
          </a>
        </div>
      </div>

      {/* ── Subscription Hook ── */}
      <div className="border border-graphite/40 bg-obsidian/60 p-12">
        <p className="label-inst mb-6">Your Next Step</p>
        <h2 className="display-card text-2xl leading-tight mb-6 max-w-2xl">
          {report.subscription_hook.headline}
        </h2>
        <p className="font-serif text-muted leading-relaxed mb-4 max-w-2xl">
          {report.subscription_hook.why_now}
        </p>
        <p className="font-serif text-muted leading-relaxed mb-10 max-w-2xl">
          {report.subscription_hook.specific_value}
        </p>
        <div className="border border-graphite/60 p-8 max-w-lg">
          <p className="font-mono text-signal-gold text-[0.6rem] tracking-widest mb-2">
            RECOMMENDED · {report.subscription_hook.recommended_tier === 'pro' ? 'CATALYST PRO' : 'CATALYST IGNITION'}
          </p>
          <p className="font-serif text-bone text-xl mb-3">
            {report.subscription_hook.recommended_tier === 'pro'
              ? 'Continuous executive-level positioning intelligence'
              : 'Monthly market intelligence and ATS tracking'}
          </p>
          <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-8">
            {report.subscription_hook.recommended_tier === 'pro'
              ? '$199/month · ₹5,999/month'
              : '$49/month · ₹2,499/month'}
          </p>
          <a
            href="/platform"
            className="inline-block bg-signal-gold text-obsidian px-8 py-3 font-sans text-[0.65rem]
                       tracking-[0.2em] uppercase hover:bg-bone transition-colors duration-200"
          >
            View Platform →
          </a>
        </div>
      </div>

    </div>
  )
}

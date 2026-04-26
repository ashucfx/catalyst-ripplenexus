import {
  Document, Page, View, Text, StyleSheet,
} from '@react-pdf/renderer'
import type { IntakeData, ReportData } from '@/lib/db/portals'

const gold    = '#B8935B'
const bone    = '#F4F1EB'
const ink     = '#0E0F11'
const mid     = '#4A4A52'
const silver  = '#9A9A9F'
const border  = '#E2DDD6'
const softGold = '#F2E8D8'

const s = StyleSheet.create({
  page: {
    backgroundColor: '#FAFAF8',
    fontFamily: 'Times-Roman',
    paddingHorizontal: 52,
    paddingVertical: 52,
    color: ink,
  },

  /* ── Cover ── */
  coverPage: {
    backgroundColor: '#0A0B0D',
    paddingHorizontal: 52,
    paddingVertical: 64,
  },
  coverLabel: {
    fontFamily: 'Helvetica',
    fontSize: 7,
    color: gold,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 48,
  },
  coverWordmark: {
    fontFamily: 'Times-Roman',
    fontSize: 36,
    color: bone,
    letterSpacing: -1,
    marginBottom: 4,
  },
  coverSub: {
    fontFamily: 'Helvetica',
    fontSize: 7,
    color: gold,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 72,
    opacity: 0.7,
  },
  coverRule: { height: 1, backgroundColor: '#2A2B2D', marginBottom: 48 },
  coverTitle: {
    fontFamily: 'Times-Roman',
    fontSize: 28,
    color: bone,
    letterSpacing: -0.5,
    marginBottom: 16,
    lineHeight: 1.2,
  },
  coverName: { fontFamily: 'Times-Roman', fontSize: 18, color: '#9A9A9F', marginBottom: 8 },
  coverDate: { fontFamily: 'Helvetica', fontSize: 8, color: '#5A5A62', letterSpacing: 1.5 },

  /* Score block on cover */
  scoreRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 64, gap: 24 },
  scoreNum: {
    fontFamily: 'Times-Roman',
    fontSize: 96,
    color: gold,
    lineHeight: 1,
    letterSpacing: -3,
  },
  scoreDenom: { fontFamily: 'Times-Roman', fontSize: 24, color: '#5A5A62', paddingBottom: 8 },
  scoreTierBox: {
    borderWidth: 1,
    borderColor: '#2A2B2D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  scoreTier: {
    fontFamily: 'Helvetica',
    fontSize: 8,
    color: gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  /* ── Section heading ── */
  sectionLabel: {
    fontFamily: 'Helvetica',
    fontSize: 7,
    color: gold,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 16,
    marginTop: 36,
  },
  sectionRule: { height: 1, backgroundColor: border, marginBottom: 20 },

  /* ── Body text ── */
  body: {
    fontFamily: 'Times-Roman',
    fontSize: 11,
    color: mid,
    lineHeight: 1.7,
    marginBottom: 12,
  },
  bodyBold: {
    fontFamily: 'Times-Bold',
    fontSize: 11,
    color: ink,
    lineHeight: 1.7,
  },

  /* ── Dimension rows ── */
  dimRow: {
    flexDirection: 'row',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: border,
    gap: 24,
  },
  dimLeft: { width: 120, flexShrink: 0 },
  dimName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    color: ink,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  dimScoreNum: { fontFamily: 'Times-Roman', fontSize: 32, color: gold, lineHeight: 1 },
  dimScoreDen: { fontFamily: 'Helvetica', fontSize: 10, color: silver },
  barTrack: {
    height: 3,
    backgroundColor: border,
    marginTop: 8,
    borderRadius: 2,
  },
  dimRight: { flex: 1 },
  dimAnalysis: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    color: mid,
    lineHeight: 1.65,
    marginBottom: 8,
  },
  gapRow: { flexDirection: 'row', gap: 6, marginBottom: 3 },
  gapDash: { fontFamily: 'Helvetica', fontSize: 9, color: gold },
  gapText: { fontFamily: 'Helvetica', fontSize: 9, color: silver, flex: 1 },

  /* ── Benchmark ── */
  benchRow: {
    flexDirection: 'row',
    gap: 1,
    marginBottom: 20,
  },
  benchCell: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F2EC',
  },
  benchCellHighlight: {
    flex: 1,
    padding: 16,
    backgroundColor: softGold,
  },
  benchLabel: {
    fontFamily: 'Helvetica',
    fontSize: 7,
    color: silver,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  benchValue: {
    fontFamily: 'Times-Roman',
    fontSize: 18,
    color: ink,
    letterSpacing: -0.5,
  },
  benchGapValue: {
    fontFamily: 'Times-Roman',
    fontSize: 18,
    color: gold,
    letterSpacing: -0.5,
  },

  /* ── Gaps list ── */
  gapItem: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: border,
  },
  gapNum: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: gold,
    letterSpacing: 1.5,
    width: 24,
  },
  gapItemText: {
    fontFamily: 'Times-Roman',
    fontSize: 11,
    color: ink,
    flex: 1,
    lineHeight: 1.6,
  },

  /* ── Roadmap ── */
  roadmapGrid: { flexDirection: 'row', gap: 12 },
  roadmapCol: { flex: 1 },
  roadmapHeader: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    color: gold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: border,
  },
  roadmapItem: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  roadmapDot: { fontFamily: 'Helvetica', fontSize: 9, color: gold, marginTop: 1 },
  roadmapText: {
    fontFamily: 'Times-Roman',
    fontSize: 9,
    color: mid,
    flex: 1,
    lineHeight: 1.5,
  },

  /* ── CTA page ── */
  ctaPage: {
    backgroundColor: '#0A0B0D',
    paddingHorizontal: 52,
    paddingVertical: 64,
  },
  ctaHeadline: {
    fontFamily: 'Times-Roman',
    fontSize: 28,
    color: bone,
    lineHeight: 1.2,
    letterSpacing: -0.5,
    marginBottom: 24,
  },
  ctaBody: {
    fontFamily: 'Times-Roman',
    fontSize: 13,
    color: '#9A9A9F',
    lineHeight: 1.7,
    marginBottom: 36,
    maxWidth: 420,
  },
  ctaTierBox: {
    borderWidth: 1,
    borderColor: '#2A2B2D',
    padding: 24,
    marginBottom: 16,
  },
  ctaTierName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    color: gold,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  ctaTierTitle: {
    fontFamily: 'Times-Roman',
    fontSize: 20,
    color: bone,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  ctaTierBody: {
    fontFamily: 'Times-Roman',
    fontSize: 11,
    color: '#7A7A82',
    lineHeight: 1.6,
  },
  ctaUrl: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: gold,
    letterSpacing: 1.5,
    marginTop: 36,
    textTransform: 'uppercase',
  },

  /* ── Footer ── */
  pageFooter: {
    position: 'absolute',
    bottom: 28,
    left: 52,
    right: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Helvetica',
    fontSize: 7,
    color: silver,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
})

function DimensionBar({ score }: { score: number }) {
  return (
    <View style={s.barTrack}>
      <View
        style={{
          height: 3,
          width: `${score}%`,
          backgroundColor: score >= 65 ? gold : score >= 45 ? '#C4A882' : '#9A8070',
          borderRadius: 2,
        }}
      />
    </View>
  )
}

function PageFooter({ name }: { name: string }) {
  return (
    <View style={s.pageFooter} fixed>
      <Text style={s.footerText}>CATALYST · MARKET VALUE AUDIT · {name.toUpperCase()}</Text>
      <Text style={s.footerText} render={({ pageNumber, totalPages }) =>
        `${pageNumber} / ${totalPages}`
      } />
    </View>
  )
}

interface Props {
  intake: IntakeData
  report: ReportData
}

export function ReportDocument({ intake, report }: Props) {
  const dateStr = new Date(report.generated_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const dimNames: Record<string, string> = {
    narrative:    'Narrative',
    signal:       'Signal',
    sector:       'Sector',
    ats:          'ATS',
    compensation: 'Compensation',
  }

  const tierColor = {
    'Optimal': '#4A7C59',
    'Underperforming': gold,
    'Critical Gap': '#C17A3A',
    'Institutional Risk': '#B05050',
  }[report.tpi_tier] ?? gold

  return (
    <Document title={`Catalyst Market Value Audit — ${intake.name}`} author="Catalyst by Ripple Nexus">

      {/* ── COVER ── */}
      <Page size="A4" style={s.coverPage}>
        <Text style={s.coverLabel}>Confidential · Market Value Audit</Text>
        <Text style={s.coverWordmark}>CATALYST</Text>
        <Text style={s.coverSub}>BY RIPPLE NEXUS</Text>
        <View style={s.coverRule} />
        <Text style={s.coverTitle}>Talent Positioning{'\n'}Intelligence Report</Text>
        <Text style={s.coverName}>{intake.name}</Text>
        <Text style={s.coverDate}>{dateStr.toUpperCase()}</Text>

        <View style={s.scoreRow}>
          <View>
            <Text style={s.coverLabel} fixed={false}>TPI SCORE</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Text style={{ ...s.scoreNum, color: tierColor }}>{report.tpi_score}</Text>
              <Text style={s.scoreDenom}> / 100</Text>
            </View>
          </View>
          <View style={{ justifyContent: 'flex-end', paddingBottom: 8 }}>
            <View style={s.scoreTierBox}>
              <Text style={{ ...s.scoreTier, color: tierColor }}>{report.tpi_tier}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* ── EXECUTIVE SUMMARY + DIMENSIONS ── */}
      <Page size="A4" style={s.page}>
        <Text style={s.sectionLabel}>01 · Executive Summary</Text>
        <View style={s.sectionRule} />
        <Text style={s.body}>{report.executive_summary}</Text>
        <Text style={[s.body, { marginTop: 8 }]}>{report.market_position}</Text>

        <Text style={[s.sectionLabel, { marginTop: 40 }]}>02 · Dimension Breakdown</Text>
        <View style={s.sectionRule} />

        {Object.entries(report.dimensions).map(([key, dim]) => (
          <View key={key} style={s.dimRow} wrap={false}>
            <View style={s.dimLeft}>
              <Text style={s.dimName}>{dimNames[key]}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
                <Text style={s.dimScoreNum}>{dim.score}</Text>
                <Text style={s.dimScoreDen}>/100</Text>
              </View>
              <DimensionBar score={dim.score} />
            </View>
            <View style={s.dimRight}>
              <Text style={s.dimAnalysis}>{dim.analysis}</Text>
              {dim.gaps.map((g, i) => (
                <View key={i} style={s.gapRow}>
                  <Text style={s.gapDash}>—</Text>
                  <Text style={s.gapText}>{g}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <PageFooter name={intake.name} />
      </Page>

      {/* ── SALARY BENCHMARK + CRITICAL GAPS ── */}
      <Page size="A4" style={s.page}>
        <Text style={s.sectionLabel}>03 · Salary Benchmark</Text>
        <View style={s.sectionRule} />

        <View style={s.benchRow}>
          <View style={s.benchCell}>
            <Text style={s.benchLabel}>Your Current</Text>
            <Text style={s.benchValue}>{report.salary_benchmark.current}</Text>
          </View>
          <View style={s.benchCell}>
            <Text style={s.benchLabel}>Market Rate</Text>
            <Text style={s.benchValue}>{report.salary_benchmark.market}</Text>
          </View>
          <View style={s.benchCellHighlight}>
            <Text style={s.benchLabel}>Gap</Text>
            <Text style={s.benchGapValue}>–{report.salary_benchmark.gap_percentage}%</Text>
          </View>
        </View>

        <Text style={s.body}>{report.salary_benchmark.gap_narrative}</Text>

        <Text style={[s.sectionLabel, { marginTop: 40 }]}>04 · Critical Gaps</Text>
        <View style={s.sectionRule} />

        {report.critical_gaps.map((gap, i) => (
          <View key={i} style={s.gapItem} wrap={false}>
            <Text style={s.gapNum}>0{i + 1}</Text>
            <Text style={s.gapItemText}>{gap}</Text>
          </View>
        ))}

        <Text style={[s.sectionLabel, { marginTop: 40 }]}>05 · 90-Day Repositioning Roadmap</Text>
        <View style={s.sectionRule} />

        <View style={s.roadmapGrid}>
          <View style={s.roadmapCol}>
            <Text style={s.roadmapHeader}>Week 1 – 2</Text>
            {report.repositioning_roadmap.immediate.map((a, i) => (
              <View key={i} style={s.roadmapItem}>
                <Text style={s.roadmapDot}>◈</Text>
                <Text style={s.roadmapText}>{a}</Text>
              </View>
            ))}
          </View>
          <View style={s.roadmapCol}>
            <Text style={s.roadmapHeader}>Week 3 – 4</Text>
            {report.repositioning_roadmap.short_term.map((a, i) => (
              <View key={i} style={s.roadmapItem}>
                <Text style={s.roadmapDot}>◈</Text>
                <Text style={s.roadmapText}>{a}</Text>
              </View>
            ))}
          </View>
          <View style={s.roadmapCol}>
            <Text style={s.roadmapHeader}>Month 2 – 3</Text>
            {report.repositioning_roadmap.medium_term.map((a, i) => (
              <View key={i} style={s.roadmapItem}>
                <Text style={s.roadmapDot}>◈</Text>
                <Text style={s.roadmapText}>{a}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={[s.sectionLabel, { marginTop: 40 }]}>06 · 12-Month Trajectory</Text>
        <View style={s.sectionRule} />
        <Text style={s.body}>{report.trajectory_analysis}</Text>

        <PageFooter name={intake.name} />
      </Page>

      {/* ── CTA / NEXT STEP ── */}
      <Page size="A4" style={s.ctaPage}>
        <Text style={{ ...s.coverLabel, marginBottom: 36 }}>Your Next Step</Text>

        <Text style={s.ctaHeadline}>
          {report.subscription_hook.headline}
        </Text>

        <Text style={s.ctaBody}>
          {report.subscription_hook.why_now}
          {'\n\n'}
          {report.subscription_hook.specific_value}
        </Text>

        <View style={s.ctaTierBox}>
          <Text style={s.ctaTierName}>
            Recommended · {report.subscription_hook.recommended_tier === 'pro' ? 'Catalyst Pro' : 'Catalyst Ignition'}
          </Text>
          <Text style={s.ctaTierTitle}>
            {report.subscription_hook.recommended_tier === 'pro'
              ? 'Continuous executive-level positioning intelligence'
              : 'Monthly market intelligence and ATS tracking'}
          </Text>
          <Text style={s.ctaTierBody}>
            {report.subscription_hook.recommended_tier === 'pro'
              ? '$199/month · ₹5,999/month — Narrative Discretion Engine, Network Gravity Tracker, Career Pathing Canvas'
              : '$49/month · ₹2,499/month — ATS Stress Testing, Live Market Value Benchmark, Monthly Skills Heat Map'}
          </Text>
        </View>

        <Text style={s.ctaUrl}>catalyst.theripplenexus.com/platform</Text>
      </Page>

    </Document>
  )
}

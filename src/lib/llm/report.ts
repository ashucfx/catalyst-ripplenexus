import Anthropic from '@anthropic-ai/sdk'
import type { IntakeData, ReportData } from '@/lib/db/portals'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function generateAuditReport(intake: IntakeData): Promise<ReportData> {
  const prompt = `You are the Catalyst positioning engine — an institutional-grade AI that produces precise, data-driven Market Value Audit reports for senior professionals. Be direct, specific, and ruthlessly honest. Never use platitudes or generic career advice.

PROFESSIONAL INTAKE DATA:
Name: ${intake.name}
Current Title: ${intake.title}
Seniority Level: ${intake.seniority}
Total Experience: ${intake.yearsExperience}
Annual Compensation: ${intake.compensation} ${intake.currency}
Industry/Sector: ${intake.sector}
Geographic Market: ${intake.geography}
Target Role (Next 12-18 months): ${intake.targetRole}
Biggest Career Challenge: ${intake.biggestChallenge}
LinkedIn: ${intake.linkedinUrl || 'Not provided'}
Key Achievements: ${intake.achievements}

TALENT POSITIONING INDEX (TPI) SCALE:
75-100 = Optimal (fewer than 8% of professionals)
60-74  = Underperforming (meaningful market gap exists)
45-59  = Critical Gap (compounding annual salary loss)
0-44   = Institutional Risk (urgent repositioning required)

Score conservatively and accurately. Most mid-career professionals score 44-62. The score should reflect their actual positioning gap, not their career quality.

Return ONLY a raw JSON object — no markdown, no code fences, no explanation. Exactly this structure:

{
  "tpi_score": <integer 34-74 based on their data>,
  "tpi_tier": <"Optimal" or "Underperforming" or "Critical Gap" or "Institutional Risk">,
  "executive_summary": "<2-3 sharp sentences identifying the specific positioning problem. Name the gap. Do not comfort.>",
  "dimensions": {
    "narrative": {
      "score": <integer 0-100>,
      "analysis": "<2-3 sentences on how their professional narrative positions them in the market today>",
      "gaps": ["<specific gap>", "<specific gap>"]
    },
    "signal": {
      "score": <integer 0-100>,
      "analysis": "<2-3 sentences on their visibility, digital presence, and authority signals>",
      "gaps": ["<specific gap>", "<specific gap>"]
    },
    "sector": {
      "score": <integer 0-100>,
      "analysis": "<2-3 sentences on sector positioning, market heat, and demand for their profile>",
      "gaps": ["<specific gap>", "<specific gap>"]
    },
    "ats": {
      "score": <integer 0-100>,
      "analysis": "<2-3 sentences on algorithmic compatibility and recruiter-system filtering>",
      "gaps": ["<specific gap>", "<specific gap>"]
    },
    "compensation": {
      "score": <integer 0-100>,
      "analysis": "<2-3 sentences on compensation vs real market rate for their seniority/sector/geography>",
      "gaps": ["<specific gap>", "<specific gap>"]
    }
  },
  "market_position": "<1 paragraph specifically about their current market position and the annual financial cost of staying there>",
  "salary_benchmark": {
    "current": "<their stated compensation>",
    "market": "<realistic market range for their seniority/sector/geography — be specific with numbers>",
    "gap_percentage": <integer 0-45 — how far below market they are>,
    "gap_narrative": "<1-2 sentences on what this gap compounds to over 3 years>"
  },
  "critical_gaps": [
    "<specific, actionable gap 1 — name the problem precisely>",
    "<specific, actionable gap 2>",
    "<specific, actionable gap 3>"
  ],
  "repositioning_roadmap": {
    "immediate": [
      "<specific Week 1-2 action>",
      "<specific Week 1-2 action>",
      "<specific Week 1-2 action>"
    ],
    "short_term": [
      "<specific Week 3-4 action>",
      "<specific Week 3-4 action>",
      "<specific Week 3-4 action>"
    ],
    "medium_term": [
      "<specific Month 2-3 action>",
      "<specific Month 2-3 action>",
      "<specific Month 2-3 action>"
    ]
  },
  "trajectory_analysis": "<1 paragraph contrasting where they will be in 12 months if they act vs. if they stay still — use concrete numbers from their data>",
  "subscription_hook": {
    "headline": "<compelling reason their positioning needs continuous tracking, not a one-time snapshot>",
    "why_now": "<1-2 sentences on why their specific situation requires ongoing intelligence>",
    "recommended_tier": "<'ignition' for most professionals, 'pro' for Director+ targeting executive roles>",
    "specific_value": "<what exactly the recommended tier gives them that directly applies to their situation>"
  }
}`

  const message = await client.messages.create({
    model:      'claude-sonnet-4-6',
    max_tokens: 4096,
    messages:   [{ role: 'user', content: prompt }],
  })

  const text = (message.content[0] as { type: 'text'; text: string }).text.trim()
  const parsed = JSON.parse(text) as Omit<ReportData, 'generated_at'>
  return { ...parsed, generated_at: new Date().toISOString() }
}

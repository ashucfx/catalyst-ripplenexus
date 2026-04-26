import { randomBytes } from 'crypto'
import { getDb } from './supabase'

export type PortalStatus = 'pending' | 'ready'

export interface IntakeData {
  name:             string
  title:            string
  seniority:        string
  yearsExperience:  string
  compensation:     string
  currency:         string
  sector:           string
  geography:        string
  targetRole:       string
  biggestChallenge: string
  linkedinUrl:      string
  achievements:     string
}

export interface DimensionResult {
  score:    number
  analysis: string
  gaps:     string[]
}

export interface ReportData {
  tpi_score: number
  tpi_tier:  'Optimal' | 'Underperforming' | 'Critical Gap' | 'Institutional Risk'
  executive_summary: string
  dimensions: {
    narrative:    DimensionResult
    signal:       DimensionResult
    sector:       DimensionResult
    ats:          DimensionResult
    compensation: DimensionResult
  }
  market_position: string
  salary_benchmark: {
    current:        string
    market:         string
    gap_percentage: number
    gap_narrative:  string
  }
  critical_gaps: string[]
  repositioning_roadmap: {
    immediate:   string[]
    short_term:  string[]
    medium_term: string[]
  }
  trajectory_analysis: string
  subscription_hook: {
    headline:         string
    why_now:          string
    recommended_tier: 'ignition' | 'pro'
    specific_value:   string
  }
  generated_at: string
}

export interface AuditPortal {
  id:                  string
  token:               string
  email:               string
  payment_id:          string | null
  status:              PortalStatus
  intake_data:         IntakeData | null
  report_data:         ReportData | null
  created_at:          string
  report_generated_at: string | null
}

export function generateToken(): string {
  return randomBytes(32).toString('hex')
}

export async function createPortal(email: string, paymentId: string): Promise<string> {
  const db = getDb()
  if (!db) throw new Error('Database not configured')
  const token = generateToken()
  const { error } = await db
    .from('audit_portals')
    .insert({ token, email, payment_id: paymentId, status: 'pending' })
  if (error) throw new Error(`createPortal failed: ${error.message}`)
  return token
}

export async function getPortal(token: string): Promise<AuditPortal | null> {
  const db = getDb()
  if (!db) return null
  const { data, error } = await db
    .from('audit_portals')
    .select('*')
    .eq('token', token)
    .single()
  if (error || !data) return null
  return data as AuditPortal
}

export async function saveReport(
  token: string,
  intake: IntakeData,
  report: ReportData,
): Promise<void> {
  const db = getDb()
  if (!db) throw new Error('Database not configured')
  const { error } = await db
    .from('audit_portals')
    .update({
      intake_data:          intake,
      report_data:          report,
      status:               'ready',
      report_generated_at:  new Date().toISOString(),
    })
    .eq('token', token)
  if (error) throw new Error(`saveReport failed: ${error.message}`)
}

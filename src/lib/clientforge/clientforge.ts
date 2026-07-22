/**
 * ClientForge CRM & Leads Flywheel Sync Service
 * Formats website consultation requests and dispatches them directly to ClientForge portal API.
 */

export interface LeadSyncPayload {
  name: string
  email: string
  phone: string
  countryCode: string
  countryName: string
  experienceLevel: 'JUNIOR' | 'MID' | 'SENIOR' | 'EXECUTIVE' | string
  services: string[]
  packageSlug: 'CAREER_BOOSTER' | 'PREMIUM_PLUS' | 'CUSTOM' | 'AUDIT' | string
  preferredGateway?: 'RAZORPAY' | 'PAYPAL'
  requirementNotes?: string
  targetRole?: string
  sourceUrl?: string
}

export async function syncLeadToClientForge(payload: LeadSyncPayload): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const clientForgeBaseUrl = process.env.CLIENTFORGE_URL || process.env.NEXT_PUBLIC_CLIENTFORGE_URL || 'https://clientforge.theripplenexus.com'
    const endpoint = `${clientForgeBaseUrl.replace(/\/$/, '')}/api/public/inquire/submit`

    // Normalize experience level for ClientForge schema (JUNIOR, MID, SENIOR, EXECUTIVE)
    let normExpLevel = 'SENIOR'
    if (typeof payload.experienceLevel === 'string') {
      const exp = payload.experienceLevel.toLowerCase()
      if (exp.includes('0-2') || exp.includes('junior') || exp.includes('entry')) normExpLevel = 'JUNIOR'
      else if (exp.includes('3-8') || exp.includes('mid')) normExpLevel = 'MID'
      else if (exp.includes('15+') || exp.includes('exec') || exp.includes('c-suite') || exp.includes('vp') || exp.includes('director')) normExpLevel = 'EXECUTIVE'
      else normExpLevel = 'SENIOR'
    }

    // Normalize package slug
    let normPackage: 'CAREER_BOOSTER' | 'PREMIUM_PLUS' | 'CUSTOM' = 'CAREER_BOOSTER'
    if (payload.packageSlug?.toUpperCase().includes('PREMIUM')) normPackage = 'PREMIUM_PLUS'
    else if (payload.packageSlug?.toUpperCase().includes('AUDIT')) normPackage = 'CUSTOM'

    const bodyData = {
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone.trim() || '+10000000000',
      countryCode: (payload.countryCode || 'IN').toUpperCase(),
      countryName: payload.countryName || 'India',
      experienceLevel: normExpLevel,
      services: payload.services?.length ? payload.services : ['Resume Rewrite', 'LinkedIn Optimization'],
      packageSlug: normPackage,
      preferredGateway: payload.countryCode?.toUpperCase() === 'IN' ? 'RAZORPAY' : 'PAYPAL',
      requirementNotes: `[Target Role: ${payload.targetRole || 'N/A'}] ${payload.requirementNotes || ''}`.trim(),
      sourceUrl: payload.sourceUrl || 'https://www.catalyst.theripplenexus.com',
    }

    console.log('[ClientForge Sync] Sending lead payload to:', endpoint, bodyData.email)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4000) // 4 second fallback timeout

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Catalyst-Website-LeadSync/1.0',
      },
      body: JSON.stringify(bodyData),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.warn('[ClientForge Sync] Response non-OK:', res.status, errText)
      return { success: false, error: `ClientForge API responded with ${res.status}` }
    }

    const json = await res.json().catch(() => ({ success: true }))
    console.log('[ClientForge Sync] Successfully registered lead in ClientForge CRM & Flywheel:', json)
    return { success: true, data: json }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.warn('[ClientForge Sync] Non-blocking sync notice (ClientForge offline or timeout):', message)
    // Non-blocking catch so website lead processing always succeeds even if ClientForge dev server is temporarily offline
    return { success: false, error: message }
  }
}

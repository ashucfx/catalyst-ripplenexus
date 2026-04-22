import { Resend } from 'resend'

export const FROM_EMAIL  = process.env.RESEND_FROM_EMAIL  ?? 'onboarding@resend.dev'
export const FROM_NAME   = process.env.RESEND_FROM_NAME   ?? 'Catalyst'
export const FROM        = `${FROM_NAME} <${FROM_EMAIL}>`
export const ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL ?? 'catalyst@theripplenexus.com'

// Lazy singleton — instantiated on first request, not at module load.
// Avoids Next.js build-time crash when RESEND_API_KEY is not set.
let _instance: Resend | null = null

function getInstance(): Resend | null {
  if (_instance) return _instance
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY missing — skipping email dispatch.')
    return null
  }
  _instance = new Resend(process.env.RESEND_API_KEY)
  return _instance
}

export const resend = {
  emails: {
    send: async (...args: Parameters<Resend['emails']['send']>) => {
      const instance = getInstance()
      if (!instance) {
        return { data: null, error: { name: 'internal_server_error', message: 'Email skipped (Missing API Key)', statusCode: 500 } } as Extract<Awaited<ReturnType<Resend['emails']['send']>>, { error: unknown }>
      }
      return instance.emails.send(...args)
    },
  },
}

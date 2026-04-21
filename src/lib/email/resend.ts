import { Resend } from 'resend'

export const FROM_EMAIL  = process.env.RESEND_FROM_EMAIL  ?? 'onboarding@resend.dev'
export const FROM_NAME   = process.env.RESEND_FROM_NAME   ?? 'Catalyst'
export const FROM        = `${FROM_NAME} <${FROM_EMAIL}>`
export const ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL ?? 'catalyst@theripplenexus.com'

// Lazy singleton — instantiated on first request, not at module load.
// Avoids Next.js build-time crash when RESEND_API_KEY is not set.
let _instance: Resend | null = null

function getInstance(): Resend {
  if (!_instance) _instance = new Resend(process.env.RESEND_API_KEY)
  return _instance
}

export const resend = {
  emails: {
    send: (...args: Parameters<Resend['emails']['send']>) =>
      getInstance().emails.send(...args),
  },
}

import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

// Sender — must match a verified domain in your Resend account.
// During development use: onboarding@resend.dev (only sends to your own email)
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
export const FROM_NAME  = process.env.RESEND_FROM_NAME  ?? 'Catalyst'
export const FROM       = `${FROM_NAME} <${FROM_EMAIL}>`

// Where admin notifications land
export const ADMIN_EMAIL = process.env.RESEND_ADMIN_EMAIL ?? 'ashutosh6471@gmail.com'

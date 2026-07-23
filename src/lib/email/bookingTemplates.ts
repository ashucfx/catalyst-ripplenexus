import { formatDisplay, formatTimeDisplay } from '../schedule/timezone'
import { generateGoogleCalendarUrl, generateGoogleMeetLink } from '../schedule/ics'

interface BookingEmailData {
  name:          string
  email:         string
  meetingName:   string
  durationMin:   number
  startsAt:      Date
  timezone:      string
  cancelToken:   string
  meetingTypeId: string
  meetingLink?:  string
}

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.catalyst.theripplenexus.com'

function cancelLink(token: string): string {
  return `${BASE}/book/cancel?token=${token}`
}

const OFFICIAL_LOGO_SVG = `
<svg width="22" height="28" viewBox="0 0 96 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle;margin-right:8px;">
  <polygon points="0,120 22,120 96,0 74,0" fill="#F4F1EB"/>
  <polygon points="96,0 74,0 50,38 72,38" fill="#C5A059"/>
  <circle cx="85" cy="12" r="2.5" fill="#050505"/>
</svg>
`

export function bookingConfirmationClient(data: BookingEmailData & { bookingId?: string }): { subject: string; html: string } {
  const dateStr = formatDisplay(data.startsAt, data.timezone)
  const timeStr = formatTimeDisplay(data.startsAt, data.timezone)
  const meetUrl = data.meetingLink || generateGoogleMeetLink(data.bookingId || data.meetingTypeId)
  
  const gcalUrl = generateGoogleCalendarUrl({
    id: data.bookingId || 'booking',
    title: `${data.meetingName} — Catalyst Strategy Session`,
    startsAt: data.startsAt,
    durationMin: data.durationMin,
    clientName: data.name,
    clientEmail: data.email,
    meetingLink: meetUrl,
  })

  return {
    subject: `Your ${data.meetingName} is Confirmed — Catalyst by Ripple Nexus`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed — Catalyst</title>
  <style>
    @media only screen and (max-width: 600px) {
      .email-wrapper { padding: 16px 8px !important; }
      .email-card { padding: 20px 16px !important; border-radius: 8px !important; }
      .email-btn { display: block !important; width: 100% !important; margin: 8px 0 !important; text-align: center !important; box-sizing: border-box !important; }
    }
  </style>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0A0B0D; color: #F4F1EB; margin: 0; padding: 40px 16px;" class="email-wrapper">
  <div style="max-width: 580px; margin: 0 auto; background-color: #111317; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 36px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);" class="email-card">
    
    <!-- Header with Official Repo Logo -->
    <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="vertical-align: middle;">
            ${OFFICIAL_LOGO_SVG}
            <span style="font-family: Georgia, serif; font-size: 22px; font-weight: bold; color: #F4F1EB; letter-spacing: 0.05em; vertical-align: middle;">CATALYST</span>
            <span style="display: block; font-family: Arial, sans-serif; font-size: 8px; color: #8C8C96; letter-spacing: 0.35em; text-transform: uppercase; margin-top: 3px;">BY RIPPLE NEXUS</span>
          </td>
          <td align="right" style="vertical-align: middle;">
            <span style="font-family: Arial, sans-serif; font-size: 9px; color: #C5A059; letter-spacing: 0.15em; text-transform: uppercase; border: 1px solid rgba(197,160,89,0.3); background-color: rgba(197,160,89,0.1); padding: 4px 10px; border-radius: 20px; font-weight: bold;">
              CONFIRMED
            </span>
          </td>
        </tr>
      </table>
    </div>

    <h1 style="font-family: Georgia, serif; font-size: 24px; font-weight: normal; margin: 0 0 12px 0; color: #F4F1EB; line-height: 1.3;">
      Your strategy session is locked in, ${data.name.split(' ')[0]}.
    </h1>
    <p style="font-size: 14px; color: #9CA3AF; margin: 0 0 24px 0; line-height: 1.6;">
      An interactive <strong>.ics calendar invite</strong> is attached to this email. You can also use the buttons below to join your video room or add it directly to Google Calendar.
    </p>

    <!-- Session Details Box -->
    <div style="background-color: #0A0B0D; border: 1px solid rgba(197,160,89,0.3); border-radius: 12px; padding: 24px; margin-bottom: 28px;">
      <p style="font-family: Georgia, serif; font-size: 18px; color: #C5A059; font-weight: bold; margin: 0 0 16px 0;">
        ${data.meetingName}
      </p>
      
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; color: #9CA3AF; line-height: 1.8;">
        <tr>
          <td style="padding: 4px 0; width: 110px; color: #8C8C96; font-family: Arial, sans-serif; font-size: 11px; text-transform: uppercase;">Date & Time:</td>
          <td style="padding: 4px 0; color: #F4F1EB; font-weight: bold;">${dateStr}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #8C8C96; font-family: Arial, sans-serif; font-size: 11px; text-transform: uppercase;">Session Time:</td>
          <td style="padding: 4px 0; color: #C5A059; font-weight: bold;">${timeStr} (${data.durationMin} Minutes)</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #8C8C96; font-family: Arial, sans-serif; font-size: 11px; text-transform: uppercase;">Timezone:</td>
          <td style="padding: 4px 0; color: #F4F1EB;">${data.timezone}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0 4px 0; color: #8C8C96; font-family: Arial, sans-serif; font-size: 11px; text-transform: uppercase; vertical-align: top;">Video Link:</td>
          <td style="padding: 12px 0 4px 0; vertical-align: top;">
            <a href="${meetUrl}" style="color: #C5A059; font-weight: bold; text-decoration: underline; word-break: break-all;">${meetUrl}</a>
          </td>
        </tr>
      </table>
    </div>

    <!-- Action Buttons: Google Meet + Add to Google Calendar -->
    <div style="margin-bottom: 32px; text-align: center;">
      <a href="${meetUrl}" class="email-btn" style="display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #C5A059 100%); color: #0A0B0D; padding: 14px 24px; text-decoration: none; font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: bold; border-radius: 30px; margin: 6px; box-shadow: 0 4px 12px rgba(197,160,89,0.3);">
        🎥 Join Google Meet Video Call →
      </a>
      <a href="${gcalUrl}" target="_blank" class="email-btn" style="display: inline-block; background-color: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.2); color: #F4F1EB; padding: 14px 24px; text-decoration: none; font-family: Arial, sans-serif; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: bold; border-radius: 30px; margin: 6px;">
        📅 Add to Google Calendar ↗
      </a>
    </div>

    <!-- Prep Instructions -->
    <div style="background-color: rgba(255,255,255,0.02); border-left: 2px solid #C5A059; padding: 16px; margin-bottom: 28px;">
      <p style="font-family: Arial, sans-serif; font-size: 10px; color: #C5A059; text-transform: uppercase; letter-spacing: 0.15em; font-weight: bold; margin: 0 0 6px 0;">
        EXECUTIVE CONSULTATION BRIEF
      </p>
      <p style="font-size: 13px; color: #9CA3AF; margin: 0; line-height: 1.6;">
        Our senior team will review your target position and compensation history prior to the call. Please join promptly at your scheduled time.
      </p>
    </div>

    <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 28px 0;">

    <div style="font-size: 12px; color: #6B7280; text-align: center;">
      <p style="margin: 0 0 8px 0;">
        Need to reschedule or adjust your time?
        <a href="${cancelLink(data.cancelToken)}" style="color: #9CA3AF; text-decoration: underline;">Manage Booking</a>
      </p>
      <p style="margin: 0; font-size: 11px; color: #4B5563;">
        © Catalyst by Ripple Nexus. All rights reserved. Executive confidentiality guaranteed.
      </p>
    </div>

  </div>
</body>
</html>`,
  }
}

export function bookingConfirmationAdmin(data: BookingEmailData & { company?: string; message?: string }): { subject: string; html: string } {
  const dateStr = formatDisplay(data.startsAt, 'Asia/Kolkata')
  const timeStr = formatTimeDisplay(data.startsAt, 'Asia/Kolkata')
  const meetUrl = data.meetingLink || generateGoogleMeetLink(data.bookingId || data.meetingTypeId)
  
  const gcalUrl = generateGoogleCalendarUrl({
    id: data.bookingId || 'booking',
    title: `[Strategy Call] ${data.name} — Catalyst`,
    startsAt: data.startsAt,
    durationMin: data.durationMin,
    clientName: data.name,
    clientEmail: data.email,
    meetingLink: meetUrl,
  })

  return {
    subject: `[New Strategy Call] ${data.meetingName} — ${data.name}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #0A0B0D; color: #F4F1EB; padding: 40px 16px;">
  <div style="max-width: 520px; margin: 0 auto; background-color: #111317; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px;">
    
    <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 24px;">
      ${OFFICIAL_LOGO_SVG}
      <span style="font-family: Georgia, serif; font-size: 18px; font-weight: bold; color: #F4F1EB; vertical-align: middle;">CATALYST ADMIN CONTROL</span>
    </div>

    <h2 style="font-family: Georgia, serif; font-size: 20px; color: #C5A059; margin: 0 0 16px 0;">
      New Strategy Booking: ${data.meetingName}
    </h2>

    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; color: #9CA3AF; line-height: 1.8; margin-bottom: 24px;">
      <tr><td style="color: #8C8C96; width: 120px;">Candidate Name:</td><td style="color: #F4F1EB; font-weight: bold;">${data.name}</td></tr>
      <tr><td style="color: #8C8C96;">Candidate Email:</td><td style="color: #C5A059;">${data.email}</td></tr>
      ${data.company ? `<tr><td style="color: #8C8C96;">Company:</td><td style="color: #F4F1EB;">${data.company}</td></tr>` : ''}
      ${data.message ? `<tr><td style="color: #8C8C96;">Notes / Target:</td><td style="color: #F4F1EB;">${data.message}</td></tr>` : ''}
      <tr><td style="color: #8C8C96;">Date (IST):</td><td style="color: #F4F1EB; font-weight: bold;">${dateStr}</td></tr>
      <tr><td style="color: #8C8C96;">Time (IST):</td><td style="color: #C5A059; font-weight: bold;">${timeStr} (${data.durationMin} Min)</td></tr>
      <tr><td style="color: #8C8C96;">Client Timezone:</td><td style="color: #F4F1EB;">${data.timezone}</td></tr>
      <tr><td style="color: #8C8C96; vertical-align: top; padding-top: 8px;">Google Meet:</td><td style="padding-top: 8px;"><a href="${meetUrl}" style="color: #C5A059; font-weight: bold;">${meetUrl}</a></td></tr>
    </table>

    <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
      <a href="${gcalUrl}" target="_blank" style="display: inline-block; background-color: #C5A059; color: #0A0B0D; padding: 12px 20px; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; text-transform: uppercase; border-radius: 20px; text-decoration: none;">
        📅 Add to Admin Google Calendar ↗
      </a>
    </div>

  </div>
</body>
</html>`,
  }
}

export function bookingReminder(data: BookingEmailData, leadTimeLabel: string): { subject: string; html: string } {
  const dateStr = formatDisplay(data.startsAt, data.timezone)
  const timeStr = formatTimeDisplay(data.startsAt, data.timezone)
  const meetUrl = data.meetingLink || generateGoogleMeetLink(data.bookingId || data.meetingTypeId)

  return {
    subject: `Reminder: Your ${data.meetingName} is in ${leadTimeLabel} — Catalyst`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #0A0B0D; color: #F4F1EB; margin: 0; padding: 40px 16px;">
  <div style="max-width: 540px; margin: 0 auto; background-color: #111317; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 36px;">
    
    <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 24px;">
      ${OFFICIAL_LOGO_SVG}
      <span style="font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #F4F1EB; vertical-align: middle;">CATALYST</span>
    </div>

    <p style="font-family: Arial, sans-serif; font-size: 10px; color: #C5A059; letter-spacing: 0.2em; text-transform: uppercase; font-weight: bold; margin: 0 0 8px 0;">
      SESSION REMINDER · IN ${leadTimeLabel.toUpperCase()}
    </p>

    <h1 style="font-family: Georgia, serif; font-size: 22px; color: #F4F1EB; margin: 0 0 16px 0;">
      Your strategy call is starting soon.
    </h1>

    <div style="background-color: #0A0B0D; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
      <p style="font-family: Georgia, serif; font-size: 16px; color: #C5A059; font-weight: bold; margin: 0 0 8px 0;">${data.meetingName}</p>
      <p style="font-size: 13px; color: #9CA3AF; margin: 4px 0;">📅 ${dateStr}</p>
      <p style="font-size: 13px; color: #F4F1EB; font-weight: bold; margin: 4px 0;">⏰ ${timeStr} (${data.durationMin} Minutes)</p>
      <p style="font-size: 13px; color: #8C8C96; margin: 4px 0;">Timezone: ${data.timezone}</p>
    </div>

    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${meetUrl}" style="display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #C5A059 100%); color: #0A0B0D; padding: 14px 28px; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; border-radius: 30px; text-decoration: none;">
        🎥 Join Google Meet Call Now →
      </a>
    </div>

    <p style="font-size: 12px; color: #6B7280; text-align: center; margin: 0;">
      <a href="${cancelLink(data.cancelToken)}" style="color: #8C8C96;">Need to cancel or reschedule?</a>
    </p>

  </div>
</body>
</html>`,
  }
}

export function bookingCancelledClient(name: string, meetingName: string): { subject: string; html: string } {
  return {
    subject: `Booking Cancelled — ${meetingName}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #0A0B0D; color: #F4F1EB; margin: 0; padding: 40px 16px;">
  <div style="max-width: 500px; margin: 0 auto; background-color: #111317; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 36px; text-align: center;">
    ${OFFICIAL_LOGO_SVG}
    <h1 style="font-family: Georgia, serif; font-size: 22px; color: #F4F1EB; margin: 16px 0 12px 0;">Booking Cancelled</h1>
    <p style="font-size: 14px; color: #9CA3AF; margin-bottom: 24px;">Hi ${name} — your reservation for <strong>${meetingName}</strong> has been cancelled.</p>
    <a href="${BASE}/book" style="display: inline-block; background-color: #C5A059; color: #0A0B0D; padding: 12px 24px; font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; border-radius: 24px; text-decoration: none;">
      Schedule a New Session →
    </a>
  </div>
</body>
</html>`,
  }
}

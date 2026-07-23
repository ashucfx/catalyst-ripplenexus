import { formatDisplay, formatTimeDisplay } from '../schedule/timezone'

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

export function bookingConfirmationClient(data: BookingEmailData & { bookingId?: string }): { subject: string; html: string } {
  const dateStr = formatDisplay(data.startsAt, data.timezone)
  const timeStr = formatTimeDisplay(data.startsAt, data.timezone)
  const meetUrl = data.meetingLink || 'https://meet.google.com/catalyst-strategy'

  return {
    subject: `Your ${data.meetingName} is confirmed — Catalyst`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><style>
  body { font-family: -apple-system, sans-serif; background:#0A0B0D; color:#F4F1EB; margin:0; padding:40px 20px; }
  .card { max-width:560px; margin:0 auto; background:#13161A; border:1px solid #1F2226; padding:40px; border-radius:12px; }
  h1 { font-size:24px; font-weight:300; margin:0 0 8px; color:#F4F1EB; }
  .label { font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:#C5A059; margin-bottom:24px; font-weight:bold; }
  .detail { background:#0A0B0D; border:1px solid #1F2226; padding:24px; margin:24px 0; border-radius:8px; }
  .detail p { margin:6px 0; font-size:14px; color:#9CA3AF; }
  .detail strong { color:#F4F1EB; }
  .btn-meet { display:inline-block; background:linear-gradient(135deg, #D4AF37 0%, #C5A059 100%); color:#0A0B0D; padding:14px 28px; text-decoration:none; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; font-weight:bold; border-radius:24px; margin:12px 6px 12px 0; }
  .cancel { font-size:12px; color:#4B5563; margin-top:32px; }
  .cancel a { color:#6B7280; }
  hr { border:none; border-top:1px solid #1F2226; margin:32px 0; }
</style></head>
<body>
<div class="card">
  <div style="margin-bottom:20px;">
    <span style="display:inline-block;width:12px;height:12px;background:#C5A059;transform:rotate(45deg);margin-right:8px;"></span>
    <span style="font-size:16px;font-weight:bold;color:#F4F1EB;letter-spacing:0.1em;">CATALYST</span>
  </div>
  <p class="label">Booking Confirmed · Calendar Invitation Attached</p>
  <h1>Your executive strategy session is set.</h1>
  <div class="detail">
    <p style="font-size:16px;color:#C5A059;font-weight:bold;margin-bottom:12px;">${data.meetingName}</p>
    <p>📅 <strong>Date:</strong> ${dateStr}</p>
    <p>⏰ <strong>Time:</strong> ${timeStr} (${data.durationMin} minutes)</p>
    <p>🌐 <strong>Timezone:</strong> ${data.timezone}</p>
    <p style="margin-top:16px;padding-top:16px;border-top:1px solid #1F2226;">
      🎥 <strong>Google Meet Room:</strong><br/>
      <a href="${meetUrl}" style="color:#D4AF37;word-break:break-all;font-size:15px;font-weight:bold;text-decoration:underline;">${meetUrl}</a>
    </p>
  </div>

  <div style="margin:24px 0;">
    <a href="${meetUrl}" class="btn-meet">🎥 Join Google Meet →</a>
  </div>

  <p style="font-size:13px;color:#9CA3AF;line-height:1.6;">
    An interactive <strong>.ics Calendar Invite</strong> is attached to this email. You can open it to automatically sync this call into Google Calendar, Apple Calendar, or Outlook.
  </p>
  <hr>
  <p class="cancel">
    Need to reschedule or cancel?
    <a href="${cancelLink(data.cancelToken)}">Click here to manage your booking</a>
  </p>
</div>
</body>
</html>`,
  }
}

export function bookingConfirmationAdmin(data: BookingEmailData & { company?: string; message?: string }): { subject: string; html: string } {
  const dateStr = formatDisplay(data.startsAt, 'Asia/Kolkata')
  const timeStr = formatTimeDisplay(data.startsAt, 'Asia/Kolkata')

  return {
    subject: `[New Booking] ${data.meetingName} — ${data.name}`,
    html: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  body{font-family:monospace;background:#0A0B0D;color:#F4F1EB;padding:40px 20px;}
  .card{max-width:480px;margin:0 auto;background:#13161A;border:1px solid #1F2226;padding:32px;}
  h2{font-size:18px;margin:0 0 24px;color:#B8935B;}
  p{margin:6px 0;font-size:13px;color:#9CA3AF;}
  strong{color:#F4F1EB;}
</style></head>
<body><div class="card">
  <h2>New Booking — ${data.meetingName}</h2>
  <p><strong>Name:</strong> ${data.name}</p>
  <p><strong>Email:</strong> ${data.email}</p>
  ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
  ${data.message ? `<p><strong>Note:</strong> ${data.message}</p>` : ''}
  <p style="margin-top:16px"><strong>Date (IST):</strong> ${dateStr}</p>
  <p><strong>Time (IST):</strong> ${timeStr}</p>
  <p><strong>Client TZ:</strong> ${data.timezone}</p>
  <p><strong>Duration:</strong> ${data.durationMin} min</p>
  <p><strong>Meeting Link:</strong> <a href="${data.meetingLink || 'https://meet.google.com/catalyst-strategy'}" style="color:#B8935B;">${data.meetingLink || 'https://meet.google.com/catalyst-strategy'}</a></p>
</div></body></html>`,
  }
}

export function bookingReminder(data: BookingEmailData, leadTimeLabel: string): { subject: string; html: string } {
  const dateStr = formatDisplay(data.startsAt, data.timezone)
  const timeStr = formatTimeDisplay(data.startsAt, data.timezone)

  return {
    subject: `Reminder: Your ${data.meetingName} is in ${leadTimeLabel} — Catalyst`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><style>
  body{font-family:-apple-system,sans-serif;background:#0A0B0D;color:#F4F1EB;margin:0;padding:40px 20px;}
  .card{max-width:520px;margin:0 auto;background:#13161A;border:1px solid #1F2226;padding:40px;}
  h1{font-size:22px;font-weight:300;margin:0 0 8px;}
  .label{font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#6B7280;margin-bottom:24px;}
  .detail{background:#0A0B0D;border:1px solid #1F2226;padding:20px;margin:24px 0;}
  .detail p{margin:6px 0;font-size:14px;color:#9CA3AF;}
  .detail strong{color:#F4F1EB;}
  .cancel{font-size:12px;color:#4B5563;margin-top:32px;}
  .cancel a{color:#6B7280;}
</style></head>
<body>
<div class="card">
  <p class="label">Catalyst — Session Reminder</p>
  <h1>Your session is in ${leadTimeLabel}.</h1>
  <div class="detail">
    <p><strong>${data.meetingName}</strong></p>
    <p>${dateStr}</p>
    <p><strong>${timeStr}</strong> · ${data.durationMin} minutes</p>
    <p>Timezone: ${data.timezone}</p>
    <p style="margin-top:16px;"><strong>Meeting Link:</strong> <a href="${data.meetingLink || 'https://meet.google.com/catalyst-strategy'}" style="color:#B8935B;text-decoration:none;">${data.meetingLink || 'https://meet.google.com/catalyst-strategy'}</a></p>
  </div>
  <p style="font-size:14px;color:#9CA3AF;line-height:1.6;">
    Have your compensation data and career history ready. We will begin reviewing your profile before we meet.
  </p>
  <p class="cancel"><a href="${cancelLink(data.cancelToken)}">Need to cancel?</a></p>
</div>
</body>
</html>`,
  }
}

export function bookingCancelledClient(name: string, meetingName: string): { subject: string; html: string } {
  return {
    subject: `Booking cancelled — ${meetingName}`,
    html: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  body{font-family:-apple-system,sans-serif;background:#0A0B0D;color:#F4F1EB;margin:0;padding:40px 20px;}
  .card{max-width:520px;margin:0 auto;background:#13161A;border:1px solid #1F2226;padding:40px;}
  h1{font-size:22px;font-weight:300;margin:0 0 24px;}
  p{font-size:14px;color:#9CA3AF;line-height:1.6;}
  a{color:#B8935B;}
</style></head>
<body><div class="card">
  <h1>Booking cancelled.</h1>
  <p>Hi ${name} — your ${meetingName} has been cancelled.</p>
  <p>Ready to rebook? <a href="${BASE}/book">Choose a new time →</a></p>
</div></body></html>`,
  }
}

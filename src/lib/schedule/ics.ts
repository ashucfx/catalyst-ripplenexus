/**
 * iCalendar (.ics) and Google Calendar Link Generator
 * Compliant with RFC 5545 for calendar invites (Google Calendar, Outlook, Apple Calendar)
 */

export interface CalendarEventParams {
  id: string
  title: string
  description?: string
  startsAt: Date
  durationMin: number
  clientName: string
  clientEmail: string
  organizerEmail?: string
  meetingLink?: string
}

function formatDateToIcs(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

export function generateGoogleMeetLink(bookingId: string): string {
  const cleanId = bookingId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  const p1 = cleanId.slice(0, 3) || 'cat'
  const p2 = cleanId.slice(3, 7) || 'tpa1'
  const p3 = cleanId.slice(7, 10) || 'exec'
  return `https://meet.google.com/${p1}-${p2}-${p3}`
}

export function generateGoogleCalendarUrl(params: CalendarEventParams): string {
  const end = new Date(params.startsAt.getTime() + params.durationMin * 60 * 1000)
  const dates = `${formatDateToIcs(params.startsAt)}/${formatDateToIcs(end)}`
  const title = encodeURIComponent(params.title)
  const meetUrl = params.meetingLink || generateGoogleMeetLink(params.id)
  const details = encodeURIComponent(
    `${params.description || 'Catalyst Executive Strategy Session'}\n\n🎥 Join Google Meet: ${meetUrl}\n\nClient: ${params.clientName} (${params.clientEmail})`
  )
  const location = encodeURIComponent(meetUrl)

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`
}

export function generateIcsEvent(params: CalendarEventParams): string {
  const end = new Date(params.startsAt.getTime() + params.durationMin * 60 * 1000)
  const startStr = formatDateToIcs(params.startsAt)
  const endStr = formatDateToIcs(end)
  const nowStr = formatDateToIcs(new Date())
  const meetUrl = params.meetingLink || generateGoogleMeetLink(params.id)
  const organizer = params.organizerEmail || 'catalyst@theripplenexus.com'

  const descriptionText = [
    params.description || 'Catalyst Executive Strategy Session',
    `Meeting Link: ${meetUrl}`,
    `Client: ${params.clientName} (${params.clientEmail})`,
    'Confidential Executive Consultation by Catalyst TPA.'
  ].join('\\n')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Catalyst TPA//Executive Strategy Session//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:catalyst-booking-${params.id}@catalyst.theripplenexus.com`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${params.title}`,
    `DESCRIPTION:${descriptionText}`,
    `LOCATION:${meetUrl}`,
    `ORGANIZER;CN="Catalyst Executive Team":mailto:${organizer}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=TRUE;CN="${params.clientName}":mailto:${params.clientEmail}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getMeetingType } from '@/lib/db/bookings'
import { BookingFlow } from '@/components/booking/BookingFlow'
import { Disclaimer } from '@/components/ui/Disclaimer'

interface Props {
  params: Promise<{ type: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params
  const mt = await getMeetingType(type)
  if (!mt) return { title: 'Not Found' }
  return {
    title: `Book: ${mt.name} — Catalyst by Ripple Nexus`,
    description: mt.description,
  }
}

export default async function BookTypePage({ params }: Props) {
  const { type } = await params
  const meetingType = await getMeetingType(type)
  if (!meetingType) notFound()

  return (
    <>
      <Header />
      <main className="pt-36 sm:pt-40 pb-28 grain min-h-screen">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">
          <div className="mb-10 flex items-center justify-between">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 font-mono text-xs text-signal-gold uppercase tracking-wider hover:text-bone transition-colors"
            >
              <span>← Back to session options</span>
            </Link>
            <span className="font-mono text-[0.65rem] text-muted uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full">
              CONFIDENTIAL EXECUTIVE SCHEDULER
            </span>
          </div>

          <BookingFlow meetingType={meetingType} />

          <Disclaimer variant="compact" className="mt-16 pt-8 border-t border-white/[0.05]" />
        </div>
      </main>
      <Footer />
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getMeetingType } from '@/lib/db/bookings'
import { BookingFlow } from '@/components/booking/BookingFlow'

interface Props {
  params: Promise<{ type: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params
  const mt = await getMeetingType(type)
  if (!mt) return { title: 'Not Found' }
  return {
    title: `Book: ${mt.name} — Catalyst`,
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
      <main className="pt-32 pb-24">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <Link href="/book" className="font-mono text-muted text-[0.6rem] tracking-widest hover:text-bone transition-colors">
              ← Back to sessions
            </Link>
          </div>
          <BookingFlow meetingType={meetingType} />
        </div>
      </main>
      <Footer />
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getMeetingTypes } from '@/lib/db/bookings'

export const metadata: Metadata = {
  title: 'Book a Session — Catalyst',
  description: 'Schedule a Market Value Audit, Strategy Call, or Blueprint Session with Catalyst.',
}

const icons: Record<string, string> = {
  audit:     '◈',
  strategy:  '◎',
  blueprint: '◲',
}

export default async function BookPage() {
  const meetingTypes = await getMeetingTypes()

  return (
    <>
      <Header />
      <main className="pt-32 pb-24">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          <div className="mb-16">
            <p className="label-inst mb-6">Scheduling</p>
            <hr className="rule mb-10 w-16 border-signal-gold" style={{ borderColor: '#B8935B' }} />
            <h1 className="font-serif text-bone font-light leading-tight mb-6"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.025em' }}>
              Choose your session type
            </h1>
            <p className="font-serif text-muted text-lg leading-relaxed max-w-xl">
              All sessions are conducted over video call. You will receive a calendar invite and
              pre-session briefing within minutes of booking.
            </p>
          </div>

          {meetingTypes.length === 0 && (
            <div className="border border-graphite p-10 text-center">
              <p className="font-sans text-muted text-sm">
                Scheduling is not yet configured. Please check back shortly.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-graphite">
            {meetingTypes.map((mt) => {
              const isPaid = mt.price_usd > 0
              return (
                <Link
                  key={mt.id}
                  href={`/book/${mt.id}`}
                  className="group bg-obsidian p-8 flex flex-col gap-5 hover:bg-graphite transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-signal-gold text-2xl">{icons[mt.id] ?? '◆'}</span>
                    <div>
                      {isPaid && (
                        <p className="font-mono text-muted text-[0.55rem] tracking-widest">PAID</p>
                      )}
                      {!isPaid && (
                        <p className="font-mono text-signal-gold text-[0.55rem] tracking-widest">FREE</p>
                      )}
                      <h3 className="font-serif text-bone text-xl font-light">{mt.name}</h3>
                    </div>
                  </div>

                  <p className="font-sans text-muted text-sm leading-relaxed flex-1">{mt.description}</p>

                  <div className="border-t border-graphite pt-4 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-1">DURATION</p>
                      <p className="font-sans text-bone text-sm">{mt.duration_min} minutes</p>
                    </div>
                    <div className="text-right">
                      {isPaid ? (
                        <>
                          <p className="font-serif text-signal-gold text-lg">${(mt.price_usd / 100).toFixed(0)}</p>
                          <p className="font-mono text-muted text-[0.6rem]">₹{(mt.price_inr / 100).toFixed(0)}</p>
                        </>
                      ) : (
                        <p className="font-serif text-bone text-lg">Free</p>
                      )}
                    </div>
                  </div>

                  <div className="font-mono text-[0.6rem] tracking-widest text-signal-gold group-hover:text-bone transition-colors">
                    Book this session →
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-16 border border-graphite/30 p-8 bg-graphite/5">
            <p className="font-mono text-muted text-[0.6rem] tracking-widest mb-3">HOW IT WORKS</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { n: '01', title: 'Choose a time', desc: 'Select a session type, pick a date and time that works for your timezone.' },
                { n: '02', title: 'Complete booking', desc: 'Fill in your details. Paid sessions require payment to confirm your slot.' },
                { n: '03', title: 'Receive confirmation', desc: 'Calendar invite and pre-session brief arrive in your inbox within minutes.' },
              ].map(step => (
                <div key={step.n}>
                  <p className="font-mono text-signal-gold text-[0.6rem] tracking-widest mb-2">{step.n}</p>
                  <p className="font-serif text-bone text-base font-light mb-2">{step.title}</p>
                  <p className="font-sans text-muted text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}

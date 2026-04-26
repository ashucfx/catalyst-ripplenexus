import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Intelligence — Research & Thought Leadership',
  description:
    'Original research, white papers, and strategic analysis on Talent Positioning Architecture, the AI visibility crisis, and the future of professional capital.',
}

const articles = [
  {
    cluster: 'Market Mechanics',
    slug: 'resume-worthless-2026',
    title: 'Your Resume Is Worthless in 2026',
    excerpt:
      'AI has democratised the production of syntactically perfect documents. The result is a "market for lemons" in which recruiters can no longer trust the artifact. The resume is dead. The signal is everything.',
    readTime: '9 min read',
    date: 'April 2026',
    featured: true,
  },
  {
    cluster: 'Psychology of Power',
    slug: 'cost-of-career-inaction',
    title: 'The Hidden Cost of Career Inaction',
    excerpt:
      'Every year a professional remains underposititioned, the salary ceiling established in the next negotiation is lower. The compounding loss is not visible in any single year. That is precisely what makes it lethal.',
    readTime: '7 min read',
    date: 'March 2026',
    featured: true,
  },
  {
    cluster: 'Future of Work',
    slug: 'surviving-ai-layoff-surge-2026',
    title: 'Surviving the AI Layoff Surge of 2026',
    excerpt:
      'The displacement curve has reached the white-collar professional. The professionals who survive and thrive will not be those with the most credentials — they will be those whose signal is hardest to fake.',
    readTime: '11 min read',
    date: 'March 2026',
    featured: true,
  },
  {
    cluster: 'Psychology of Power',
    slug: 'escaping-silk-lined-comfort-zone',
    title: 'Escaping the Silk-Lined Comfort Zone',
    excerpt:
      'Golden handcuffs are career ceilings wearing a tuxedo. The highest-performing professionals are also the ones most susceptible to the comfort zone trap — because the compensation for staying is so high.',
    readTime: '8 min read',
    date: 'February 2026',
  },
  {
    cluster: 'Market Mechanics',
    slug: 'decoding-gcc-compensation',
    title: 'Decoding GCC Compensation Packages in 2026',
    excerpt:
      'The UAE and GCC boards are pressing for Chief AI Officers. C-suite tenure is falling to 6.8 years. The positioning opportunity for India-origin talent in GCC leadership roles is the largest it has been in a decade.',
    readTime: '12 min read',
    date: 'February 2026',
  },
  {
    cluster: 'Future of Work',
    slug: 'rise-of-liquid-executive',
    title: 'The Rise of the Liquid Executive',
    excerpt:
      'Fractional C-suite and gig executive models are no longer fringe. They are the fastest-growing segment in the leadership talent market. How to position for this new paradigm — and what it means for compensation.',
    readTime: '9 min read',
    date: 'January 2026',
  },
  {
    cluster: 'Psychology of Power',
    slug: 'narrative-discretion-boardrooms',
    title: 'Narrative Discretion in Private-Equity Boardrooms',
    excerpt:
      'PE firms value one thing above all others: the ability to recognise and manage risk. Your professional narrative must signal this — without revealing the anxieties that make you appear high-risk yourself.',
    readTime: '10 min read',
    date: 'January 2026',
  },
  {
    cluster: 'Market Mechanics',
    slug: 'why-headhunters-arent-helping',
    title: 'Why Headhunters Aren\'t Helping You',
    excerpt:
      'Executive search firms work for the company, not the candidate. Understanding the incentive structure of "Headhunter Politics" is the prerequisite for navigating it — and for making them work for you instead.',
    readTime: '8 min read',
    date: 'December 2025',
  },
  {
    cluster: 'Future of Work',
    slug: 'skills-of-2027-predictive-planning',
    title: 'Skills of 2027: A Predictive Planning Framework',
    excerpt:
      'The Skills Ontology Mapper forecasts three-year demand curves for professional skills. This analysis reveals the five skill clusters that will command the highest market heat in 2027 — and how to signal them now.',
    readTime: '14 min read',
    date: 'December 2025',
  },
]

const clusters = ['All', 'Psychology of Power', 'Market Mechanics', 'Future of Work']

export default function IntelligencePage() {
  const featured = articles.filter((a) => a.featured)
  const rest = articles.filter((a) => !a.featured)

  return (
    <>
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          {/* Header */}
          <div className="mb-20">
            <p className="label-inst mb-6">Catalyst Intelligence</p>
            <hr className="rule mb-10 w-16" />
            <h1 className="display-section mb-6">
              Research. Analysis.<br />
              <em className="text-signal-gold not-italic">Institutional thinking.</em>
            </h1>
            <p className="font-serif text-muted text-xl leading-relaxed max-w-2xl">
              The content strategy moves beyond vanilla job-search articles toward strategic,
              exponential depth. This is not career advice. It is intelligence on the structure
              of the professional market itself.
            </p>
          </div>

          {/* Cluster filters — static display (no JS needed for static labels) */}
          <div className="flex gap-4 mb-12 flex-wrap">
            {clusters.map((c, i) => (
              <span
                key={c}
                className={`font-mono text-[0.65rem] tracking-[0.15em] uppercase px-4 py-2 border ${
                  i === 0
                    ? 'border-signal-gold text-signal-gold'
                    : 'border-graphite text-muted hover:border-bone hover:text-bone cursor-pointer'
                }`}
              >
                {c}
              </span>
            ))}
          </div>

          {/* Featured articles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-graphite mb-1">
            {featured.map((article) => (
              <article key={article.slug} className="bg-obsidian p-8 flex flex-col gap-5">
                <div>
                  <p className="label-inst mb-3">{article.cluster}</p>
                  <h2 className="display-card text-2xl leading-snug mb-4">
                    {article.title}
                  </h2>
                  <p className="font-serif text-muted text-base leading-relaxed">{article.excerpt}</p>
                </div>
                <div className="mt-auto pt-5 border-t border-graphite flex items-center justify-between">
                  <div>
                    <p className="font-mono text-muted text-[0.6rem] tracking-widest">{article.date}</p>
                    <p className="font-mono text-muted text-[0.6rem] tracking-widest">{article.readTime}</p>
                  </div>
                  <Button href={`/intelligence/${article.slug}`} variant="text">
                    Read
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {/* Rest of articles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-graphite mb-20">
            {rest.map((article) => (
              <article key={article.slug} className="bg-obsidian p-8 flex flex-col gap-5">
                <div>
                  <p className="label-inst mb-3">{article.cluster}</p>
                  <h2 className="display-card text-xl leading-snug mb-4">
                    {article.title}
                  </h2>
                  <p className="font-serif text-muted text-sm leading-relaxed">{article.excerpt}</p>
                </div>
                <div className="mt-auto pt-5 border-t border-graphite flex items-center justify-between">
                  <div>
                    <p className="font-mono text-muted text-[0.6rem] tracking-widest">{article.date}</p>
                    <p className="font-mono text-muted text-[0.6rem] tracking-widest">{article.readTime}</p>
                  </div>
                  <Button href={`/intelligence/${article.slug}`} variant="text">
                    Read
                  </Button>
                </div>
              </article>
            ))}
          </div>

          {/* India Talent Competitiveness Report callout */}
          <div className="border border-signal-gold/30 p-10 bg-graphite/10 mb-20" id="case-studies">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <p className="label-inst mb-4">White Paper — Forthcoming Q2 2026</p>
                <h2 className="display-card text-3xl mb-4">
                  India Talent Competitiveness Report 2026
                </h2>
                <p className="font-serif text-muted text-lg leading-relaxed">
                  India salary increments are projected at 9.6% for 2026 — the highest in the
                  Asia-Pacific region. This report maps the positioning opportunities for Indian
                  professionals in GCC leadership roles, US/UK technology markets, and domestic
                  PE funds. Establishes Catalyst as the category authority.
                </p>
              </div>
              <div className="shrink-0">
                <Button href="/request" variant="ghost">
                  Register for early access →
                </Button>
              </div>
            </div>
          </div>

          {/* SEO keyword clusters callout */}
          <div className="border-t border-graphite pt-16">
            <p className="label-inst mb-6">50+ Topics — The Full Research Agenda</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  cluster: 'The Psychology of Power',
                  topics: [
                    'Why High Performers Fail Transitions',
                    'Engineering Social Gravity',
                    'The ROI of Professional Identity',
                    'The Psychology of the $500K Offer',
                    'Escaping the Silk-Lined Comfort Zone',
                  ],
                },
                {
                  cluster: 'Market Mechanics',
                  topics: [
                    'Bypassing the ATS Black Hole',
                    'Private Equity Career Playbooks',
                    'The S-Curve of Career Leaps',
                    'Decoding GCC Compensation',
                    'The Death of the Professional Generalist',
                  ],
                },
                {
                  cluster: 'Future of Work',
                  topics: [
                    'Surviving the AI Layoff Surge',
                    'Negotiating with an AI Boss',
                    'Board Readiness for Digital Leaders',
                    'Sovereign Identity in a Gig Economy',
                    'The Reputational Risk of a Bad Hire',
                  ],
                },
              ].map((col) => (
                <div key={col.cluster}>
                  <p className="label-inst mb-4">{col.cluster}</p>
                  <ul className="flex flex-col gap-2">
                    {col.topics.map((t) => (
                      <li key={t} className="flex items-start gap-2">
                        <span className="text-signal-gold text-xs mt-1 shrink-0">—</span>
                        <span className="font-serif text-muted text-sm">{t}</span>
                      </li>
                    ))}
                  </ul>
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

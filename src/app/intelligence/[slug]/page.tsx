import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

const articles: Record<string, {
  cluster: string
  title: string
  subtitle: string
  date: string
  readTime: string
  body: { type: 'p' | 'h2' | 'blockquote' | 'list'; content: string | string[] }[]
}> = {
  'resume-worthless-2026': {
    cluster: 'Market Mechanics',
    title: 'Your Resume Is Worthless in 2026',
    subtitle: 'AI has democratised the production of syntactically perfect documents. The result is a market for lemons.',
    date: 'April 2026',
    readTime: '9 min read',
    body: [
      { type: 'p', content: 'In 2018, a well-formatted resume with strong action verbs and quantified achievements could move a mid-career professional meaningfully forward in a selection process. The document functioned as a signal — imperfect, but interpretable. That era is over.' },
      { type: 'h2', content: 'The Lemons Problem' },
      { type: 'p', content: 'George Akerlof\'s 1970 paper on information asymmetry in used car markets introduced the concept of the "market for lemons." When buyers cannot distinguish quality from low quality, they offer only average prices. Sellers of high-quality goods exit the market. Quality collapses to the mean. The market destroys itself.' },
      { type: 'p', content: 'The professional labour market has just entered its own lemons crisis. AI writing tools have made the production of syntactically perfect, quantified, achievement-oriented resumes trivially cheap. Every candidate now presents as a high performer. Every document reads like it was written by the same entity — because it was.' },
      { type: 'blockquote', content: 'When every candidate looks like a top performer, the document ceases to function as a differentiator. The resume has become noise.' },
      { type: 'h2', content: 'What Recruiters Now Trust' },
      { type: 'p', content: 'The senior recruiters and executive search partners I have spoken to in the last twelve months are uniform in their diagnosis. They no longer read resumes the way they once did. They read for inconsistency. They look for the gaps that betray a document that was architected rather than lived. They use the document as a prompt — a starting point for the adversarial questions they will ask.' },
      { type: 'p', content: 'What they trust instead: the Narrative. The professional\'s ability to walk a room through the logic of their career. The coherence of their digital estate — what LinkedIn, Google, and their professional network say when no one is controlling the message. And increasingly, what other credible people say about them.' },
      { type: 'list', content: [
        'Recommendation coherence — do references reinforce or contradict the narrative?',
        'Digital estate consistency — LinkedIn, board profiles, published work, speaking history',
        'Network adjacency — who vouches for you without being asked?',
        'Domain authority signals — publications, panels, advisory roles in target sector',
      ]},
      { type: 'h2', content: 'The Signal Is Everything' },
      { type: 'p', content: 'This is not an argument against preparing professional documents. ATS systems still require them. Compliance demands them. But the professional who invests their strategic energy in CV optimization is misallocating their most finite resource: positioning attention.' },
      { type: 'p', content: 'The Talent Positioning Architecture framework treats the resume as a compliance document and nothing more. The real architecture happens at the level of signal construction — the deliberate engineering of what the market perceives when it looks at you, with or without a document in front of it.' },
      { type: 'blockquote', content: 'The resume tells the recruiter what you have done. The signal tells them who you are. Only one of these is hard to fake.' },
      { type: 'p', content: 'In 2026, the professionals commanding the largest compensation premiums are not those with the best documents. They are those whose narrative is legible, coherent, and reinforced by every touchpoint the market encounters. The resume is dead. The signal is everything.' },
    ],
  },
  'cost-of-career-inaction': {
    cluster: 'Psychology of Power',
    title: 'The Hidden Cost of Career Inaction',
    subtitle: 'Every year a professional remains underpositioned, the compounding loss is invisible — and lethal.',
    date: 'March 2026',
    readTime: '7 min read',
    body: [
      { type: 'p', content: 'There is a cognitive bias that every underpositioned professional shares: the belief that staying still is neutral. That not acting is not a choice. That the cost of inaction is zero. This belief is the single most expensive error a professional can make.' },
      { type: 'h2', content: 'The Invisible Compounding Loss' },
      { type: 'p', content: 'Consider two professionals starting identical roles at the same compensation level. Professional A negotiates aggressively at every transition, understands their market rate in real time, and moves with precision. Professional B stays, accepts standard increments, avoids the friction of transition. After ten years, the salary gap between the two is not 10% — it is often 60–80%, compounding in perpetuity.' },
      { type: 'p', content: 'The mechanism is straightforward: each negotiation is anchored to the previous one. A professional who has been underpriced for three years walks into a new role negotiation underpriced. The market does not correct for historical undervaluation. It prices off the last data point.' },
      { type: 'blockquote', content: 'The cost of inaction is not visible in any single year. That is precisely what makes it lethal.' },
      { type: 'h2', content: 'The Anchoring Trap' },
      { type: 'p', content: 'Behavioural economics identifies anchoring as one of the most persistent cognitive biases in negotiation. The first number in a conversation exerts disproportionate influence on the outcome. For professionals, the anchor is their current salary — a figure that often reflects a negotiation made years ago under different market conditions, with different leverage, and different information.' },
      { type: 'p', content: 'Breaking the anchor requires two things: accurate market intelligence and the psychological positioning to deploy it. The Market Value Audit exists precisely to provide the first. The Positioning Blueprint provides the second.' },
      { type: 'list', content: [
        'The average professional is 23% below market rate at the time of their next negotiation',
        'That gap compounds at 5–8% annually through future anchoring',
        'The 10-year cumulative loss for a professional earning ₹20L is often ₹80–120L in foregone compensation',
        'The psychological cost — confidence erosion, resentment, disengagement — is not quantifiable but is real',
      ]},
      { type: 'h2', content: 'The Decision to Act' },
      { type: 'p', content: 'The professionals who engage with positioning work are rarely those in crisis. They are those who have internalized what the data shows: that the best time to optimize positioning is when you do not need to. The professional who repositions from a position of strength commands the negotiation. The professional who repositions from desperation accepts whatever the market offers.' },
      { type: 'p', content: 'Inaction is a choice. It just does not feel like one until the data is in front of you.' },
    ],
  },
  'surviving-ai-layoff-surge-2026': {
    cluster: 'Future of Work',
    title: 'Surviving the AI Layoff Surge of 2026',
    subtitle: 'The displacement curve has reached white-collar professionals. The survivors will not be those with the most credentials.',
    date: 'March 2026',
    readTime: '11 min read',
    body: [
      { type: 'p', content: 'The AI displacement curve followed a predictable path. First, repetitive manual work. Then structured knowledge work — data entry, basic analysis, templated writing. By 2025, the curve had reached the professional class. By 2026, it is moving through the managerial layer with the precision of something that does not pause for organizational politics.' },
      { type: 'h2', content: 'What Is Actually Being Displaced' },
      { type: 'p', content: 'The common framing — "AI will take jobs" — is both true and misleading. What AI displaces is not roles but task clusters. The manager whose role was 70% information synthesis, meeting preparation, and report generation faces a different threat than the manager whose role is 70% stakeholder navigation, conflict resolution, and judgment calls with incomplete data.' },
      { type: 'p', content: 'The professionals who are most vulnerable are those whose positioning — in their own minds and in the market\'s perception — is built around task execution rather than judgment. The executive who is known for producing great board packs is more exposed than the executive who is known for having built a particular capability inside an organization.' },
      { type: 'blockquote', content: 'The professionals who survive will not be those with the most credentials. They will be those whose signal is hardest to fake.' },
      { type: 'h2', content: 'The Three Survival Archetypes' },
      { type: 'list', content: [
        'The Domain Authority — positioned as the recognized expert in a specific, defensible niche where AI augments but cannot replace human judgment',
        'The Institutional Navigator — whose value is embedded in relationships, organizational knowledge, and the ability to move things through complex human systems',
        'The AI-Native Leader — who has repositioned early as someone who wields AI as a force multiplier and can translate between capability and strategy',
      ]},
      { type: 'h2', content: 'The Repositioning Imperative' },
      { type: 'p', content: 'The professionals who are navigating this transition successfully share one characteristic: they started repositioning before the pressure became acute. Repositioning under duress — after a redundancy notice, after a restructure — compresses your options and weakens your negotiating position. Repositioning from a position of current employment and financial stability is qualitatively different.' },
      { type: 'p', content: 'The Skills Ontology Mapper identifies which skill clusters in your sector are gaining market heat and which are being commoditized. The data for 2026 is unambiguous: human judgment, relationship capital, and domain authority are appreciating. Task execution skills that can be described in a prompt are depreciating.' },
      { type: 'h2', content: 'The Signal That Survives' },
      { type: 'p', content: 'In a market where AI can produce the artifacts of professional competence — the reports, the analyses, the strategic documents — the differentiator is the signal that exists independent of artifacts. Who do people call when something important is broken? Who gets the brief before the brief is written? Whose absence would create a specific, hard-to-fill gap?' },
      { type: 'p', content: 'These are not questions about skills. They are questions about positioning. And positioning is not determined by what you do. It is determined by what the market believes you are.' },
    ],
  },
  'escaping-silk-lined-comfort-zone': {
    cluster: 'Psychology of Power',
    title: 'Escaping the Silk-Lined Comfort Zone',
    subtitle: 'Golden handcuffs are career ceilings wearing a tuxedo. The highest performers are most susceptible.',
    date: 'February 2026',
    readTime: '8 min read',
    body: [
      { type: 'p', content: 'The most insidious career trap is not unemployment, not underperformance, and not the wrong sector. It is the role that pays well enough to make leaving feel irrational — while quietly closing every door that might have opened from a position of greater ambition.' },
      { type: 'h2', content: 'The Anatomy of the Silk-Lined Comfort Zone' },
      { type: 'p', content: 'High-performing professionals in well-compensated roles experience a specific form of stasis. The compensation is above-market for their current positioning. The work is intellectually stimulating enough to prevent desperation. The status signals — title, employer brand, peer group — are sufficient to satisfy the ego. Every rational metric says: stay.' },
      { type: 'p', content: 'But the market is moving. The sector is evolving. The skills that made this professional exceptional five years ago are being commoditized. And because the role is comfortable, there is no urgent signal to respond to. The discomfort that would otherwise trigger action is muffled by the silk lining.' },
      { type: 'blockquote', content: 'The golden handcuffs are not locked from the outside. They are maintained from the inside — by the professional who has confused current compensation with permanent market value.' },
      { type: 'h2', content: 'The Compounding Cost' },
      { type: 'p', content: 'What the comfortable professional does not see is what is not happening. The network connections not being made. The skills not being developed. The market visibility not being built. The positioning work not being done. Each year in the comfort zone is a year in which the gap between current positioning and the next level of ambition quietly widens.' },
      { type: 'h2', content: 'The Exit Architecture' },
      { type: 'list', content: [
        'Clarity on the ceiling — a honest assessment of where this role ends and what it does not offer',
        'Market intelligence — what the professional is actually worth in current conditions, not anchored to current package',
        'Positioning work done in advance — before the exit, not after the resignation',
        'Network activation — relationships built from strength, not desperation',
      ]},
      { type: 'p', content: 'The professionals who exit comfort zones successfully do so with a plan, not with a push. They build the next position while still in the current one. They leave from a position of market knowledge, not uncertainty.' },
    ],
  },
  'decoding-gcc-compensation': {
    cluster: 'Market Mechanics',
    title: 'Decoding GCC Compensation Packages in 2026',
    subtitle: 'The UAE and GCC boards are pressing for Chief AI Officers. The positioning opportunity for India-origin talent has never been larger.',
    date: 'February 2026',
    readTime: '12 min read',
    body: [
      { type: 'p', content: 'The Gulf Cooperation Council labour market for senior professionals is undergoing its fastest structural shift in a decade. The digital transformation mandates issued at sovereign wealth fund level are cascading down into every significant organization in the region. The demand signal for senior technology leadership — and specifically for professionals who can translate AI capability into organizational strategy — is the strongest it has been since the post-2008 Gulf build-out.' },
      { type: 'h2', content: 'The Structural Opportunity' },
      { type: 'p', content: 'Three factors are converging simultaneously. First, the Gulf\'s historical talent pipeline from Western markets has become more expensive and less reliable as local economies compete for the same profiles. Second, the Indian professional diaspora in the GCC has created a validated trust signal for India-origin talent at senior levels — an executive with a proven GCC network faces fewer implicit barriers than a decade ago. Third, C-suite tenure in the region has compressed to 6.8 years on average, creating more frequent transitions and therefore more opportunities.' },
      { type: 'h2', content: 'Compensation Architecture' },
      { type: 'list', content: [
        'Base salary: typically 40–60% higher than equivalent India roles at VP/Director level',
        'Housing allowance: 15–25% of base, often provided in kind for senior hires',
        'Education allowance: AED 60,000–120,000 per annum for school-age children',
        'Annual air tickets: 4–6 business class return tickets to home country',
        'Gratuity: end-of-service benefit equivalent to 21 days per year for first 5 years, 30 days per year thereafter',
        'Tax efficiency: zero personal income tax across all GCC jurisdictions',
      ]},
      { type: 'h2', content: 'Positioning for GCC Leadership' },
      { type: 'p', content: 'The professionals who successfully make the GCC transition at VP level and above share a positioning characteristic: they have domain authority that travels. A CFO known in the India market as an FP&A expert is not a GCC-ready profile. A CFO known for having built the finance function inside a scaling technology company — with measurable outcomes — is. The signal must be exportable.' },
      { type: 'blockquote', content: 'The GCC market does not import professionals. It imports outcomes. Your positioning must speak the language of outcomes before you attempt the transition.' },
    ],
  },
  'rise-of-liquid-executive': {
    cluster: 'Future of Work',
    title: 'The Rise of the Liquid Executive',
    subtitle: 'Fractional C-suite and gig executive models are the fastest-growing segment in the leadership talent market.',
    date: 'January 2026',
    readTime: '9 min read',
    body: [
      { type: 'p', content: 'The permanent C-suite role is no longer the only definition of executive success. A structural shift is underway in how senior leadership capacity is deployed — and the professionals who understand this shift early are building compensation architectures that the traditional career ladder cannot offer.' },
      { type: 'h2', content: 'The Fractional Market' },
      { type: 'p', content: 'Fractional executive roles — CFO, CMO, CHRO, CTO — were, until recently, a polite term for professionals who could not secure permanent roles. That perception has inverted. The fractional executive market is now understood as a deliberate positioning strategy by senior professionals who want portfolio income, intellectual variety, and the ability to operate across multiple high-growth environments simultaneously.' },
      { type: 'p', content: 'The economics are straightforward. A fractional CFO operating across three engagements simultaneously at market rates is not trading down. They are generating 1.5–2× the income of the equivalent permanent role while building a diversified risk profile. A restructure at one client does not end their income. A strategic disagreement does not require a resignation.' },
      { type: 'h2', content: 'Positioning for the Liquid Market' },
      { type: 'list', content: [
        'Domain authority is non-negotiable — fractional clients hire outcome-specific expertise, not general leadership',
        'Digital visibility is the primary discovery mechanism — fractional executives are found before they are retained',
        'Reference architecture matters more than resume — three strong client outcomes outweigh fifteen years of corporate history',
        'Network density in target sectors — fractional roles spread through trusted referral networks, not job boards',
      ]},
      { type: 'blockquote', content: 'The liquid executive does not wait to be found. They architect the conditions under which the right clients find them.' },
      { type: 'h2', content: 'The Transition Architecture' },
      { type: 'p', content: 'Moving from permanent to liquid executive is a positioning project, not a job search. The professional must first establish visible domain authority — through writing, speaking, or advisory work — before the first fractional engagement is secured. The first engagement is the hardest. The network effects that follow make each subsequent engagement easier.' },
    ],
  },
  'narrative-discretion-boardrooms': {
    cluster: 'Psychology of Power',
    title: 'Narrative Discretion in Private-Equity Boardrooms',
    subtitle: 'PE firms value one thing above all others: the ability to recognise and manage risk.',
    date: 'January 2026',
    readTime: '10 min read',
    body: [
      { type: 'p', content: 'The private equity boardroom is the most sophisticated talent assessment environment that exists in the professional market. Partners at established PE firms have pattern-matched thousands of management presentations, hundreds of leadership transitions, and the full spectrum of how professionals behave under capital pressure. They are not moved by the same signals that impress hiring managers in corporate environments.' },
      { type: 'h2', content: 'What PE Firms Are Actually Assessing' },
      { type: 'p', content: 'The explicit question in any PE leadership assessment is competence: can this person drive the performance agenda inside the portfolio company? But the implicit question — the one that actually determines the decision — is risk calibration: is this person someone whose presence creates or destroys optionality?' },
      { type: 'p', content: 'A professional who presents too optimistically raises risk flags. A professional who hedges every answer raises different risk flags. The precise calibration required — confidence without hubris, honesty about challenges without signaling uncertainty about resolution — is a skill that most professionals have never been required to develop in corporate environments.' },
      { type: 'blockquote', content: 'The PE partner does not want a cheerleader and does not want a pessimist. They want someone who has seen the problem clearly and has already begun solving it.' },
      { type: 'h2', content: 'Narrative Discretion — What to Omit' },
      { type: 'list', content: [
        'Specific attribution of failures to external factors — PE partners expect leaders to own outcomes',
        'Signals of discomfort with financial accountability — the language of the boardroom is the P&L',
        'Excessive process focus — PE firms buy outcomes, not methodologies',
        'Personal anxieties about the transition — the boardroom is not a therapeutic space',
      ]},
      { type: 'h2', content: 'Building the PE-Ready Narrative' },
      { type: 'p', content: 'The professional who successfully navigates PE scrutiny has typically done significant preparation work on their narrative architecture. They know which elements of their history to foreground, which to contextualize, and which to strategically omit — not because they are concealing weakness, but because they understand the specific language of value that resonates in PE contexts. This is not deception. It is the highest form of professional communication: giving a sophisticated audience exactly what they need to make a confident decision.' },
    ],
  },
  'why-headhunters-arent-helping': {
    cluster: 'Market Mechanics',
    title: "Why Headhunters Aren't Helping You",
    subtitle: 'Executive search firms work for the company, not the candidate. Understanding the incentive structure is the prerequisite for navigating it.',
    date: 'December 2025',
    readTime: '8 min read',
    body: [
      { type: 'p', content: 'The executive search industry operates on a structural conflict of interest that most candidates never fully internalize. The headhunter who calls you, builds a relationship with you, and seems to advocate for your interests is paid by the company — typically 25–33% of the first year\'s total compensation package. Their incentive is to close the mandate, not to optimize your career outcome.' },
      { type: 'h2', content: 'The Incentive Architecture' },
      { type: 'p', content: 'Search firms are retained by client companies to fill specific positions. Their performance is measured on time-to-fill and client satisfaction. A candidate who negotiates aggressively, who takes time to evaluate the offer, or who declines — regardless of how reasonable their reasons — creates friction in the process. The search firm\'s interest is completion, not candidate outcome optimization.' },
      { type: 'p', content: 'This does not make search firms adversaries. It makes them neutral parties with aligned interests only at the point of placement. The professional who understands this can work with search firms effectively — by making the search firm\'s job easier while protecting their own interests independently.' },
      { type: 'blockquote', content: 'The headhunter is a channel, not an advocate. Use them accordingly.' },
      { type: 'h2', content: 'Navigating Headhunter Politics' },
      { type: 'list', content: [
        'Build relationships with partners, not associates — partners control the mandates and have the client relationships',
        'Be the easiest candidate to present — clear narrative, rehearsed positioning, documented achievements',
        'Never disclose your current compensation first — it anchors the offer and weakens your position',
        'Understand which firms have which client relationships in your sector — mandates flow through reputation networks',
        'Maintain your own market intelligence independently — do not rely on the search firm\'s view of your market value',
      ]},
      { type: 'h2', content: 'Making Them Work for You' },
      { type: 'p', content: 'The professionals who navigate headhunter politics most effectively treat the relationship transactionally from the outset. They are courteous, professional, and easy to work with. They also do their own negotiation research, understand their own market rate independently, and never allow a search firm to be their only source of market intelligence. The headhunter who calls you today is not doing you a favour. They are doing their job. Do yours in parallel.' },
    ],
  },
  'skills-of-2027-predictive-planning': {
    cluster: 'Future of Work',
    title: 'Skills of 2027: A Predictive Planning Framework',
    subtitle: 'The Skills Ontology Mapper forecasts three-year demand curves for professional skills. Five clusters will command the highest market heat.',
    date: 'December 2025',
    readTime: '14 min read',
    body: [
      { type: 'p', content: 'Predicting skill demand three years out is not speculation. It is applied labour market analysis. The signals that predict which skill clusters will be in shortage in 2027 are visible in 2024 data: hiring velocity in adjacent roles, venture capital deployment patterns, regulatory pipeline, technology adoption curves, and the graduate pipeline entering the market two to four years from now.' },
      { type: 'h2', content: 'The Five High-Heat Skill Clusters for 2027' },
      { type: 'list', content: [
        'AI Governance and Risk Management — as organizations embed AI into consequential decision-making, the demand for professionals who can audit, govern, and risk-manage AI systems will exceed supply by 3–4× in most markets',
        'Agentic Systems Orchestration — not AI engineering (a commodity skill by 2027) but the business-side capability to design, deploy, and optimize networks of AI agents inside complex organizational environments',
        'Climate Finance and Transition Economics — regulatory and investor pressure is creating a structural shortage of professionals who can model, price, and report on climate-related financial risk',
        'Healthcare Technology Integration — the convergence of clinical practice and AI-enabled diagnostics creates demand for professionals who can translate between clinical and technical domains',
        'Trust and Digital Safety Architecture — as synthetic media and AI-generated content erodes institutional trust, the demand for professionals who can build and maintain credibility systems will accelerate',
      ]},
      { type: 'h2', content: 'The Planning Framework' },
      { type: 'p', content: 'The three-year planning framework works backward from the target state. If AI Governance is the high-heat cluster in 2027, what are the credentialing events, role transitions, and visibility moves that position a professional as a domain authority in that cluster by then? The answer is not a single leap but a sequenced series of smaller positioning moves — each building market heat in a direction the professional has chosen in advance.' },
      { type: 'blockquote', content: 'The professionals who command the highest premiums in 2027 made the positioning decision in 2024. The window to be early is closing.' },
      { type: 'h2', content: 'Signaling Emerging Skills Before They Are Mainstream' },
      { type: 'p', content: 'The highest-value positioning move is not acquiring a skill after it is hot — it is being visible in a skill cluster before the mass market recognizes its value. The professional who publishes, speaks, or takes advisory roles in a skill cluster twelve months before it becomes the hiring conversation of the year commands a premium that later movers cannot access. This is the compound return on early positioning work.' },
      { type: 'p', content: 'The Skills Ontology Mapper inside the Catalyst Intelligence Engine tracks these forward indicators continuously — giving subscribers the ability to make positioning decisions based on where the market is going, not where it has been.' },
    ],
  },
}

export async function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const article = articles[slug]
  if (!article) return { title: 'Not Found' }
  return {
    title: `${article.title} — Catalyst Intelligence`,
    description: article.subtitle,
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = articles[slug]
  if (!article) notFound()

  const slugList = Object.keys(articles)
  const currentIndex = slugList.indexOf(slug)
  const prevSlug = currentIndex > 0 ? slugList[currentIndex - 1] : null
  const nextSlug = currentIndex < slugList.length - 1 ? slugList[currentIndex + 1] : null

  return (
    <>
      <Header />
      <main className="pt-32 pb-16">
        <div className="max-w-dossier mx-auto px-6 lg:px-12">

          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-12">
            <Link
              href="/intelligence"
              className="font-mono text-muted text-[0.6rem] tracking-widest hover:text-bone transition-colors"
            >
              INTELLIGENCE
            </Link>
            <span className="text-graphite">—</span>
            <span className="font-mono text-signal-gold text-[0.6rem] tracking-widest">{article.cluster.toUpperCase()}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

            {/* Article body */}
            <div className="lg:col-span-2">
              <div className="mb-12">
                <p className="label-inst mb-4">{article.cluster}</p>
                <h1
                  className="font-serif text-bone font-light leading-tight mb-6"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
                >
                  {article.title}
                </h1>
                <p className="font-serif text-muted text-xl leading-relaxed mb-8">{article.subtitle}</p>
                <div className="flex items-center gap-6 pb-8 border-b border-graphite">
                  <span className="font-mono text-muted text-[0.6rem] tracking-widest">{article.date}</span>
                  <span className="font-mono text-muted text-[0.6rem] tracking-widest">{article.readTime}</span>
                </div>
              </div>

              <div className="prose-catalyst">
                {article.body.map((block, i) => {
                  if (block.type === 'h2') {
                    return (
                      <h2 key={i} className="font-serif text-bone text-2xl font-light mt-12 mb-4">
                        {block.content as string}
                      </h2>
                    )
                  }
                  if (block.type === 'blockquote') {
                    return (
                      <blockquote
                        key={i}
                        className="border-l-2 border-signal-gold pl-6 my-8"
                      >
                        <p className="font-serif text-bone text-xl font-light leading-relaxed italic">
                          {block.content as string}
                        </p>
                      </blockquote>
                    )
                  }
                  if (block.type === 'list') {
                    return (
                      <ul key={i} className="flex flex-col gap-3 my-6">
                        {(block.content as string[]).map((item, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <span className="text-signal-gold text-xs mt-1.5 shrink-0">—</span>
                            <span className="font-serif text-muted text-base leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  }
                  return (
                    <p key={i} className="font-serif text-muted text-base leading-relaxed mb-5">
                      {block.content as string}
                    </p>
                  )
                })}
              </div>

              {/* Article navigation */}
              <div className="flex items-center justify-between mt-16 pt-8 border-t border-graphite">
                {prevSlug ? (
                  <Link
                    href={`/intelligence/${prevSlug}`}
                    className="font-mono text-muted text-[0.6rem] tracking-widest hover:text-bone transition-colors"
                  >
                    ← PREVIOUS
                  </Link>
                ) : <div />}
                {nextSlug ? (
                  <Link
                    href={`/intelligence/${nextSlug}`}
                    className="font-mono text-muted text-[0.6rem] tracking-widest hover:text-bone transition-colors"
                  >
                    NEXT →
                  </Link>
                ) : <div />}
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-8">

              {/* CTA */}
              <div className="border border-signal-gold/30 bg-graphite/10 p-6">
                <p className="label-inst mb-3">Apply This Intelligence</p>
                <p className="font-serif text-muted text-sm leading-relaxed mb-6">
                  A Market Value Audit surfaces your actual positioning gap — with live market
                  data and a directional TPI score. 45 minutes. $199.
                </p>
                <Button href="/request" variant="primary">
                  Request the Audit →
                </Button>
              </div>

              {/* Cluster articles */}
              <div className="border border-graphite p-6">
                <p className="label-inst mb-4">More from {article.cluster}</p>
                <div className="flex flex-col gap-4">
                  {Object.entries(articles)
                    .filter(([s, a]) => s !== slug && a.cluster === article.cluster)
                    .slice(0, 3)
                    .map(([s, a]) => (
                      <Link key={s} href={`/intelligence/${s}`} className="group">
                        <p className="font-serif text-muted text-sm leading-snug group-hover:text-bone transition-colors">
                          {a.title}
                        </p>
                        <p className="font-mono text-muted text-[0.55rem] tracking-widest mt-1">{a.readTime}</p>
                      </Link>
                    ))}
                </div>
              </div>

              {/* All intelligence */}
              <div>
                <Link
                  href="/intelligence"
                  className="font-mono text-muted text-[0.6rem] tracking-widest hover:text-bone transition-colors"
                >
                  ← ALL INTELLIGENCE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

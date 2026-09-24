import { MetadataRoute } from 'next'

const BASE = 'https://www.catalyst.theripplenexus.com'

// Each article has a real publication date for accurate freshness signals
const intelligenceArticles: { slug: string; date: string }[] = [
  { slug: 'resume-worthless-2026',           date: '2026-04-01' },
  { slug: 'cost-of-career-inaction',         date: '2026-03-01' },
  { slug: 'surviving-ai-layoff-surge-2026',  date: '2026-02-01' },
  { slug: 'escaping-silk-lined-comfort-zone',date: '2026-01-15' },
  { slug: 'decoding-gcc-compensation',       date: '2026-01-01' },
  { slug: 'rise-of-liquid-executive',        date: '2025-11-01' },
  { slug: 'narrative-discretion-boardrooms', date: '2025-10-01' },
  { slug: 'why-headhunters-arent-helping',   date: '2026-05-01' },
  { slug: 'skills-of-2027-predictive-planning', date: '2025-12-01' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE,                            lastModified: now,                       changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/tpi`,                   lastModified: now,                       changeFrequency: 'monthly', priority: 0.95 },
    { url: `${BASE}/audit`,                 lastModified: now,                       changeFrequency: 'monthly', priority: 0.95 },
    { url: `${BASE}/blueprint`,             lastModified: now,                       changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/executive`,             lastModified: now,                       changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/testimonials`,          lastModified: now,                       changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/intelligence`,          lastModified: now,                       changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/platform`,              lastModified: now,                       changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/book`,                  lastModified: now,                       changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/request`,               lastModified: now,                       changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/book/audit`,            lastModified: now,                       changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/system`,                lastModified: now,                       changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/book/strategy`,         lastModified: now,                       changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/book/blueprint`,        lastModified: now,                       changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacy`,               lastModified: new Date('2025-01-01'),    changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${BASE}/terms`,                 lastModified: new Date('2025-01-01'),    changeFrequency: 'yearly',  priority: 0.2 },
    ...intelligenceArticles.map(({ slug, date }) => ({
      url: `${BASE}/intelligence/${slug}`,
      lastModified: new Date(date),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
  ]
}

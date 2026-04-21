import { MetadataRoute } from 'next'

const BASE = 'https://www.catalystripple.com'

const intelligenceSlugs = [
  'resume-worthless-2026',
  'cost-of-career-inaction',
  'surviving-ai-layoff-surge-2026',
  'escaping-silk-lined-comfort-zone',
  'decoding-gcc-compensation',
  'rise-of-liquid-executive',
  'narrative-discretion-boardrooms',
  'why-headhunters-arent-helping',
  'skills-of-2027-predictive-planning',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE,                          lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/tpi`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${BASE}/audit`,               lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/blueprint`,           lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/executive`,           lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/platform`,            lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/system`,              lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/intelligence`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/request`,             lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/book`,                lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/book/audit`,          lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/book/strategy`,       lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/book/blueprint`,      lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacy`,             lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${BASE}/terms`,               lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    ...intelligenceSlugs.map((slug) => ({
      url: `${BASE}/intelligence/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}

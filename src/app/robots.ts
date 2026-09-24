import { MetadataRoute } from 'next'

const BASE = 'https://www.catalyst.theripplenexus.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/portal/', '/audit/success', '/book/success'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'PerplexityBot',
          'ClaudeBot',
          'anthropic-ai',
          'Google-Extended',
          'Applebot-Extended',
          'cohere-ai',
        ],
        allow: ['/', '/intelligence/', '/tpi', '/audit', '/blueprint', '/executive', '/platform', '/system', '/testimonials', '/llms.txt', '/llms-full.txt'],
        disallow: ['/admin/', '/api/', '/portal/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  }
}


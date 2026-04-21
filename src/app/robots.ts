import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
    ],
    sitemap: 'https://www.catalyst.theripplenexus.com/sitemap.xml',
    host: 'https://www.catalyst.theripplenexus.com',
  }
}

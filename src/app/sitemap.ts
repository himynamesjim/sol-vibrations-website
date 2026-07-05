import type { MetadataRoute } from 'next'

import { getPayloadClient } from '@/utilities/data'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const payload = await getPayloadClient()

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/programs',
    '/community',
    '/healing',
    '/events',
    '/news',
    '/gallery',
    '/enroll',
    '/donate',
    '/contact',
  ].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.7,
  }))

  const [events, posts, pages] = await Promise.all([
    payload.find({
      collection: 'events',
      where: { isPublic: { equals: true } },
      limit: 200,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      limit: 200,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'pages',
      where: { _status: { equals: 'published' } },
      limit: 100,
      select: { slug: true, updatedAt: true },
    }),
  ])

  return [
    ...staticRoutes,
    ...events.docs
      .filter((d) => d.slug)
      .map((d) => ({ url: `${base}/events/${d.slug}`, lastModified: d.updatedAt })),
    ...posts.docs
      .filter((d) => d.slug)
      .map((d) => ({ url: `${base}/news/${d.slug}`, lastModified: d.updatedAt })),
    ...pages.docs
      .filter((d) => d.slug)
      .map((d) => ({ url: `${base}/${d.slug}`, lastModified: d.updatedAt })),
  ]
}

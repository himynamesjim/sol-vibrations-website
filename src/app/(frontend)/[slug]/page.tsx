import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/RenderBlocks'
import { getPayloadClient } from '@/utilities/data'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

// Routes owned by dedicated files must never resolve here.
const reservedSlugs = new Set([
  'about',
  'programs',
  'community',
  'healing',
  'events',
  'news',
  'gallery',
  'enroll',
  'donate',
  'contact',
  'admin',
  'api',
])

async function getPage(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
    limit: 1,
  })
  return docs[0] ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (reservedSlugs.has(slug)) return {}
  const page = await getPage(slug)
  if (!page) return {}
  return {
    title: page.title,
    description: page.metaDescription || undefined,
  }
}

export default async function CMSPage({ params }: Props) {
  const { slug } = await params
  if (reservedSlugs.has(slug)) notFound()

  const page = await getPage(slug)
  if (!page) notFound()

  return <RenderBlocks blocks={page.layout} />
}

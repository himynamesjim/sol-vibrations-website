import type { Metadata } from 'next'

import { PageHero } from '@/components/PageHero'
import { getPayloadClient } from '@/utilities/data'
import { GalleryGrid, type GalleryPhoto } from './GalleryGrid'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Moments from Sol Vibrations lessons, recitals, and outreach performances.',
}

export default async function GalleryPage() {
  const payload = await getPayloadClient()
  const { docs: items } = await payload.find({
    collection: 'gallery-items',
    where: { _status: { equals: 'published' } },
    sort: '-createdAt',
    limit: 60,
  })

  // Serialize to a minimal client-safe shape (original upload, not the
  // fixed-crop card rendition, so the masonry keeps natural aspect ratios).
  const photos: GalleryPhoto[] = items.flatMap((item) => {
    if (!item.image || typeof item.image === 'number') return []
    const { url, width, height, alt } = item.image
    if (!url || !width || !height) return []
    return [{ id: item.id, url, width, height, alt: alt || '', caption: item.caption }]
  })

  return (
    <>
      <PageHero title="Gallery" intro="Lessons, recitals, and the smiles in between." />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {photos.length === 0 ? (
          <p className="text-lg">Photos are coming soon!</p>
        ) : (
          <GalleryGrid photos={photos} />
        )}
      </section>
    </>
  )
}

import type { Metadata } from 'next'

import { MediaImage } from '@/components/MediaImage'
import { PageHero } from '@/components/PageHero'
import { getPayloadClient } from '@/utilities/data'

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

  return (
    <>
      <PageHero
        title="Gallery"
        intro="Lessons, recitals, and the smiles in between."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {items.length === 0 ? (
          <p className="text-lg">Photos are coming soon!</p>
        ) : (
          <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5">
            {items.map((item) => (
              <li key={item.id} className="break-inside-avoid">
                <figure className="card overflow-hidden">
                  {item.image && typeof item.image !== 'number' && (
                    // Original upload (not the fixed-crop card rendition) so the
                    // masonry keeps each photo's natural aspect ratio.
                    <MediaImage
                      media={item.image}
                      className="w-full"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  )}
                  {item.caption && (
                    <figcaption className="px-5 py-4 text-sm text-sol-ink/80">
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

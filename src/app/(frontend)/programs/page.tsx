import type { Metadata } from 'next'

import { ProgramCard } from '@/components/cards'
import { MediaImage } from '@/components/MediaImage'
import { PageHero } from '@/components/PageHero'
import { RichText } from '@/components/RichText'
import { getActivePrograms } from '@/utilities/data'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Programs',
  description:
    'Free guitar lessons, free ukulele lessons, and healing music outreach — Sol Vibrations programs for Tulsa youth and community.',
}

export default async function ProgramsPage() {
  const programs = await getActivePrograms()

  return (
    <>
      <PageHero
        title="Programs"
        intro="Everything we offer is free. Instruments are provided. All that’s missing is you."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        {programs.length === 0 ? (
          <p className="text-lg">Program details are coming soon — check back shortly!</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        )}

        {programs.map(
          (program) =>
            program.body && (
              <article
                key={program.id}
                id={program.slug ?? undefined}
                className="mt-16 grid items-center gap-8 md:grid-cols-[1.3fr_1fr]"
              >
                <div>
                  <h2 className="text-2xl text-sol-deep">{program.title}</h2>
                  <RichText data={program.body} className="prose-sol mt-3" />
                </div>
                {program.image && typeof program.image !== 'number' && (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
                    <MediaImage
                      media={program.image}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 40vw, 100vw"
                    />
                  </div>
                )}
              </article>
            ),
        )}
      </section>
    </>
  )
}

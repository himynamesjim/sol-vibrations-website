import type { Metadata } from 'next'

import { MediaImage } from '@/components/MediaImage'
import { PageHero } from '@/components/PageHero'
import { getPayloadClient, getSiteSettings } from '@/utilities/data'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'About',
  description:
    'Sol Vibrations is a Tulsa 501(c)(3) nonprofit teaching free guitar and ukulele to kids and bringing healing music to nursing homes and veterans hospitals.',
}

export default async function AboutPage() {
  const payload = await getPayloadClient()
  const settings = await getSiteSettings()
  const { docs: team } = await payload.find({
    collection: 'team-members',
    sort: 'order',
    limit: 50,
  })

  return (
    <>
      <PageHero
        title="About Sol Vibrations"
        intro="Our sound is light, our light is sound."
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl text-sol-deep">Our mission</h2>
        <p className="mt-4 leading-relaxed">
          Sol Vibrations exists to put the power of music within reach of every child in Tulsa —
          regardless of their family’s income — and to carry that same music to the people our
          community too often forgets: elders in nursing homes and veterans in hospitals.
        </p>
        <p className="mt-4 leading-relaxed">
          Every week, our volunteer mentors teach free guitar and ukulele lessons to children in
          underserved neighborhoods. Instruments are provided at no cost. And as our students grow,
          they join us in bringing live, healing music to audiences who need it most — learning that
          their new gift is something worth sharing.
        </p>

        <h2 className="mt-12 text-3xl text-sol-deep">Our story</h2>
        <p className="mt-4 leading-relaxed">
          Sol Vibrations began with a simple observation: music changes lives, but access to it
          doesn’t reach everyone. What started as a handful of donated guitars and one weekly class
          has grown into a community of students, families, mentors, and audiences connected by
          sound.
        </p>

        <div className="mt-12 rounded-2xl bg-sol-gold/20 p-6">
          <h2 className="text-xl text-sol-deep">A 501(c)(3) nonprofit</h2>
          <p className="mt-2 text-sm leading-relaxed">
            {settings.nonprofitBlurb ||
              'Sol Vibrations is a 501(c)(3) nonprofit organization. Donations are tax-deductible to the extent allowed by law.'}
            {settings.ein ? ` EIN: ${settings.ein}.` : ''}
          </p>
        </div>
      </section>

      {team.length > 0 && (
        <section className="bg-white" aria-labelledby="team-heading">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="team-heading" className="text-3xl text-sol-deep">
              Our team
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <li key={member.id} className="card overflow-hidden">
                  {member.photo && typeof member.photo !== 'number' && (
                    <div className="relative aspect-square">
                      <MediaImage
                        media={member.photo}
                        size="card"
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg text-sol-deep">{member.name}</h3>
                    <p className="font-display text-sm font-semibold text-sol-violet-strong">
                      {member.title}
                    </p>
                    {member.bio && <p className="mt-3 text-sm leading-relaxed">{member.bio}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  )
}

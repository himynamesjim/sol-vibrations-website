import type { Metadata } from 'next'

import { EventCard } from '@/components/cards'
import { PageHero } from '@/components/PageHero'
import { getPastEvents, getUpcomingEvents } from '@/utilities/data'
import { getPlaylistVideos } from '@/utilities/youtube'

import { VideoGallery } from './VideoGallery'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Upcoming Sol Vibrations concerts, recitals, and community events in Tulsa, OK.',
}

export default async function EventsPage() {
  const [upcoming, past, videos] = await Promise.all([
    getUpcomingEvents(24),
    getPastEvents(12),
    getPlaylistVideos(),
  ])

  return (
    <>
      <PageHero
        title="Events"
        intro="Recitals, community concerts, and outreach performances — come hear what our students can do."
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading" className="text-3xl text-sol-deep">
          Upcoming
        </h2>
        {upcoming.length === 0 ? (
          <p className="mt-6 text-lg">
            Nothing on the calendar right now — follow us on social media or check back soon!
          </p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="bg-white" aria-labelledby="past-heading">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 id="past-heading" className="text-3xl text-sol-deep">
              Past events
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {videos.length > 0 && (
        <section
          className="mx-auto max-w-6xl px-4 py-16 sm:px-6"
          aria-labelledby="videos-heading"
        >
          <h2 id="videos-heading" className="text-3xl text-sol-deep">
            Watch
          </h2>
          <p className="mt-4 max-w-2xl text-lg">
            Performances, lessons, and moments from the Sol Vibrations community — newest first.
          </p>
          <div className="mt-8">
            <VideoGallery videos={videos} />
          </div>
        </section>
      )}
    </>
  )
}

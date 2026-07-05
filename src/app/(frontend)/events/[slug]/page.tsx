import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { formatEventDate } from '@/components/cards'
import { MediaImage } from '@/components/MediaImage'
import { RichText } from '@/components/RichText'
import { getPayloadClient } from '@/utilities/data'

export const revalidate = 600

type Props = { params: Promise<{ slug: string }> }

async function getEvent(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'events',
    where: {
      and: [{ slug: { equals: slug } }, { isPublic: { equals: true } }],
    },
    limit: 1,
  })
  return docs[0] ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) return {}
  return {
    title: event.title,
    description: `${formatEventDate(event.date)} at ${event.location}`,
  }
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) notFound()

  const isPast = new Date(event.date) < new Date()

  return (
    <article>
      <section className="bg-sol-deep text-white">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <Link href="/events" className="font-display text-sm font-bold text-sol-gold hover:underline">
            ← All events
          </Link>
          <h1 className="mt-4 text-4xl">{event.title}</h1>
          <p className="mt-4 font-display text-lg font-semibold text-sol-gold">
            {formatEventDate(event.date)}
            {isPast && <span className="ml-3 rounded-full bg-white/15 px-3 py-1 text-xs text-white">Past event</span>}
          </p>
          <p className="mt-1 text-white/85">{event.location}</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {event.image && typeof event.image !== 'number' && (
          <MediaImage media={event.image} size="hero" className="mb-8 w-full rounded-2xl" sizes="(min-width: 896px) 896px, 100vw" />
        )}
        <RichText data={event.description} />
      </div>
    </article>
  )
}

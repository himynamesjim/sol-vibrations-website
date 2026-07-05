import Link from 'next/link'

import { MediaImage } from '@/components/MediaImage'
import type { Event, Post, Program } from '@/payload-types'

const dateFormat = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'America/Chicago',
})

const timeFormat = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'America/Chicago',
})

export function formatEventDate(iso: string): string {
  const d = new Date(iso)
  return `${dateFormat.format(d)} · ${timeFormat.format(d)}`
}

export function ProgramCard({ program }: { program: Program }) {
  return (
    <article className="card flex flex-col overflow-hidden">
      {program.image && typeof program.image !== 'number' && (
        <div className="relative aspect-[4/3]">
          <MediaImage
            media={program.image}
            size="card"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl text-sol-deep">{program.title}</h3>
        {(program.ageRange || program.schedule) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {program.ageRange && (
              <span className="rounded-full bg-sol-gold px-3 py-1 text-xs font-bold text-sol-deep">
                {program.ageRange}
              </span>
            )}
            {program.schedule && (
              <span className="rounded-full bg-sol-violet/10 px-3 py-1 text-xs font-bold text-sol-violet-strong">
                {program.schedule}
              </span>
            )}
          </div>
        )}
        <p className="mt-3 flex-1 text-sm leading-relaxed">{program.summary}</p>
        <Link
          href={`/enroll?program=${program.slug ?? program.id}`}
          className="btn-primary mt-5 self-start px-5 py-2.5 text-sm"
        >
          Enroll
          <span className="sr-only"> in {program.title}</span>
        </Link>
      </div>
    </article>
  )
}

export function EventCard({ event }: { event: Event }) {
  return (
    <article className="card flex flex-col overflow-hidden">
      {event.image && typeof event.image !== 'number' && (
        <div className="relative aspect-[16/9]">
          <MediaImage
            media={event.image}
            size="card"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <p className="font-display text-sm font-bold text-sol-violet-strong">
          {formatEventDate(event.date)}
        </p>
        <h3 className="mt-1 text-xl text-sol-deep">
          <Link href={`/events/${event.slug}`} className="hover:underline">
            {event.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-sol-ink/70">{event.location}</p>
      </div>
    </article>
  )
}

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="card flex flex-col overflow-hidden">
      {post.coverImage && typeof post.coverImage !== 'number' && (
        <div className="relative aspect-[16/9]">
          <MediaImage
            media={post.coverImage}
            size="card"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm text-sol-ink/60">
          {dateFormat.format(new Date(post.publishedDate))}
        </p>
        <h3 className="mt-1 text-xl text-sol-deep">
          <Link href={`/news/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-2 text-sm leading-relaxed">{post.excerpt}</p>}
      </div>
    </article>
  )
}

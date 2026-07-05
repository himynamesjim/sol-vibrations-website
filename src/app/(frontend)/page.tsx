import Image from 'next/image'
import Link from 'next/link'

import { EventCard, ProgramCard } from '@/components/cards'
import { SunMotif } from '@/components/SunMotif'
import { getActivePrograms, getUpcomingEvents } from '@/utilities/data'

// Revalidated on demand by Payload hooks; the timer keeps the
// upcoming-events split fresh as dates pass.
export const revalidate = 3600

export default async function HomePage() {
  const [programs, events] = await Promise.all([getActivePrograms(), getUpcomingEvents(3)])

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-sol-deep text-white">
        <Image
          src="/hero-studio.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-45"
        />
        {/* Violet wash keeps the photo faded and the headline AA-readable */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-sol-deep via-sol-deep/80 to-sol-deep/35"
          aria-hidden="true"
        />
        <SunMotif className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] opacity-40 sm:-right-16 sm:-top-16 sm:opacity-60" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="font-display text-lg font-semibold text-sol-gold">
            Our sound is light, our light is sound.
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl leading-tight sm:text-5xl">
            Free music lessons for Tulsa kids. Healing music for those who need it most.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            Sol Vibrations is a 501(c)(3) nonprofit putting guitars and ukuleles in the hands of
            children in underserved communities — and bringing live, healing music to nursing homes
            and veterans hospitals across Tulsa.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/enroll" className="btn-secondary">
              Enroll a student
            </Link>
            <Link href="/donate" className="btn-outline-light">
              Support our mission
            </Link>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="what-we-do">
        <h2 id="what-we-do" className="text-3xl text-sol-deep">
          What we do
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="card p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sol-gold" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18V6l10-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm10-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  stroke="#241344"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="mt-5 text-2xl text-sol-deep">Free youth music lessons</h3>
            <p className="mt-3 leading-relaxed">
              Weekly guitar and ukulele lessons — completely free — for children in underserved
              Tulsa communities. Instruments provided. No experience needed, just curiosity.
            </p>
            <Link
              href="/programs"
              className="mt-5 inline-block font-display font-bold text-sol-violet-strong hover:underline"
            >
              Explore our programs →
            </Link>
          </div>
          <div className="card p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sol-violet" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21s-7-4.5-9.5-9C.9 8.6 2.8 5 6.5 5c2 0 3.5 1 4.5 2.5C12 6 13.5 5 15.5 5 19.2 5 21.1 8.6 21.5 12 19 16.5 12 21 12 21Z"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="mt-5 text-2xl text-sol-deep">Healing music outreach</h3>
            <p className="mt-3 leading-relaxed">
              Our musicians and students bring live music to nursing homes and veterans hospitals —
              sharing songs, stories, and the simple healing power of sound.
            </p>
            <Link
              href="/about"
              className="mt-5 inline-block font-display font-bold text-sol-violet-strong hover:underline"
            >
              Learn about our mission →
            </Link>
          </div>
        </div>
      </section>

      {/* Programs */}
      {programs.length > 0 && (
        <section className="bg-white" aria-labelledby="programs-heading">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="programs-heading" className="text-3xl text-sol-deep">
                Programs
              </h2>
              <Link
                href="/programs"
                className="font-display font-bold text-sol-violet-strong hover:underline"
              >
                See all programs →
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {programs.slice(0, 3).map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming events */}
      {events.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20" aria-labelledby="events-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="events-heading" className="text-3xl text-sol-deep">
              Upcoming events
            </h2>
            <Link
              href="/events"
              className="font-display font-bold text-sol-violet-strong hover:underline"
            >
              All events →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Impact */}
      <section className="bg-sol-deep text-white" aria-labelledby="impact-heading">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 id="impact-heading" className="text-3xl">
            Why music?
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <blockquote className="rounded-2xl bg-white/5 p-8">
              <p className="text-lg leading-relaxed">
                “My daughter counts down the days to her Saturday lesson. She’s more confident at
                school, and our whole house is full of music now.”
              </p>
              <footer className="mt-4 font-display font-semibold text-sol-gold">
                — A Sol Vibrations parent
              </footer>
            </blockquote>
            <div className="space-y-4 text-white/85">
              <p className="leading-relaxed">
                Music education builds focus, confidence, and community — but lessons and
                instruments are out of reach for many Tulsa families. We remove every barrier:
                lessons are free, instruments are provided, and every child is welcome.
              </p>
              <p className="leading-relaxed">
                And when our musicians play for elders and veterans, something powerful happens:
                memories return, rooms light up, and for a little while, everyone is young again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enrollment CTA */}
      <section className="bg-gradient-to-r from-sol-violet to-sol-gold" aria-labelledby="enroll-cta">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6">
          <h2 id="enroll-cta" className="text-3xl text-white drop-shadow-sm">
            Ready to make some noise?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-white/95">
            Lessons are free, instruments are provided, and spots open every season.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/enroll" className="btn bg-sol-deep text-white hover:bg-sol-ink">
              Start enrollment
            </Link>
            <Link href="/donate" className="btn bg-white text-sol-deep hover:bg-sol-cream">
              Donate
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

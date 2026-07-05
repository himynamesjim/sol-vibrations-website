import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHero } from '@/components/PageHero'
import { SunMotif } from '@/components/SunMotif'

export const metadata: Metadata = {
  title: 'Healing Branch',
  description:
    'The Sol Vibrations Healing Branch brings intentional healing music — guitar, singing bowls, and voice — to nursing homes, veterans hospitals, and community spaces in Tulsa.',
}

export default function HealingPage() {
  return (
    <>
      <PageHero
        title="Healing Branch"
        intro="Because music doesn’t just entertain — it heals."
      />

      <section className="mx-auto max-w-3xl px-4 pt-16 sm:px-6">
        <p className="text-lg leading-relaxed">
          At Sol Vibrations, we believe music carries the power to restore peace, awaken joy, and
          bring comfort to the soul. Beyond teaching children, we extend our mission into the
          community by offering healing music experiences for those who are often overlooked —
          residents of nursing homes, veterans in hospitals, and individuals in spaces where love
          and connection are deeply needed.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-label="About our healing music">
        <div className="grid gap-6 md:grid-cols-3">
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
            <h2 className="mt-5 text-2xl text-sol-deep">Why healing music?</h2>
            <p className="mt-3 leading-relaxed">
              Music reaches where words cannot. A gentle melody can ease anxiety, spark memory, and
              create connection. These sessions are not traditional performances but intentional
              gatherings where music becomes medicine — soothing the nervous system, uplifting the
              spirit, and reminding each listener that they are seen, valued, and loved.
            </p>
          </div>

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
            <h2 className="mt-5 text-2xl text-sol-deep">What we offer</h2>
            <p className="mt-3 leading-relaxed">
              Through the resonance of guitar, singing bowls, and voice, our Healing Branch creates
              moments of stillness, memory, and presence. Each session is tailored to the needs of
              the space — whether that’s bringing calm to a hospital wing, joy to a nursing home,
              or comfort to a community gathering.
            </p>
          </div>

          <div className="card p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sol-deep" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4" fill="#FFC83D" />
                <path
                  d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"
                  stroke="#FFC83D"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h2 className="mt-5 text-2xl text-sol-deep">Our vision</h2>
            <p className="mt-3 leading-relaxed">
              We envision expanding these healing experiences to hospitals, care facilities, and
              community centers throughout Tulsa and beyond. Every note, every vibration, is
              offered with the intention of connection, presence, and love.
            </p>
          </div>
        </div>
      </section>

      {/* Tagline + CTA */}
      <section className="relative overflow-hidden bg-sol-deep text-white">
        <SunMotif className="pointer-events-none absolute -left-24 -top-32 h-[24rem] w-[24rem] opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <p className="mx-auto max-w-2xl font-display text-3xl font-bold leading-snug">
            ✨ Because music doesn’t just entertain — it heals.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-secondary">
              Invite us to your facility
            </Link>
            <Link href="/donate" className="btn-outline-light">
              Support the Healing Branch
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

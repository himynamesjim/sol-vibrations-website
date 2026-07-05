import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { PageHero } from '@/components/PageHero'

export const metadata: Metadata = {
  title: 'Community',
  description:
    'Sol Vibrations brings healing music into the community — nursing homes, veterans hospitals, classrooms, and the spaces where love and connection are deeply needed.',
}

export default function CommunityPage() {
  return (
    <>
      <PageHero
        title="Community"
        intro="Healing music for the spaces where love and connection are needed most."
      />

      {/* Mission */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
        <div>
          <h2 className="text-3xl text-sol-deep">Music that heals</h2>
          <p className="mt-4 leading-relaxed">
            At Sol Vibrations, we believe music carries the power to restore peace, awaken joy, and
            bring comfort to the soul. Beyond teaching children, we extend our mission into the
            community by offering healing music experiences for those who are often overlooked —
            residents of nursing homes, veterans in hospitals, and individuals in spaces where love
            and connection are deeply needed.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary px-5 py-2.5 text-sm">
              Bring us to your community
            </Link>
            <Link href="/donate" className="btn-secondary px-5 py-2.5 text-sm">
              Support this work
            </Link>
          </div>
        </div>
        <Image
          src="/community-outing.jpg"
          alt="Sol Vibrations mentors and kids hold colorful discs in front of their faces at a park outing"
          width={1215}
          height={1280}
          className="mx-auto w-full max-w-md rounded-2xl shadow-[var(--shadow-card)]"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </section>

      {/* Singing bowl story */}
      <section className="bg-white" aria-labelledby="bowl-heading">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_minmax(16rem,20rem)]">
          <div>
            <h2 id="bowl-heading" className="text-3xl text-sol-deep">
              The sound of the crystal singing bowl
            </h2>
            <p className="mt-4 leading-relaxed">
              This week through Sol Vibrations in the classroom and community, we shared the sound
              of the crystal singing bowl in the note of C with nearly 50 third graders. ❤️🎶
            </p>
            <p className="mt-4 leading-relaxed">
              We talked about the root chakra — grounding, safety, stability, and the feeling of
              being supported. One of the most important things we shared with students was this:
            </p>
            <blockquote className="my-6 rounded-2xl bg-sol-gold/15 p-6 font-display text-lg font-semibold leading-relaxed text-sol-deep">
              At school, they do not have to live in survival mode.
              <br />
              They are safe here.
              <br />
              They are cared for here.
              <br />
              They are allowed to breathe, learn, create, and grow.
            </blockquote>
            <p className="leading-relaxed">
              The deep vibration of the C bowl created a moment of stillness, listening, and
              emotional connection within the classroom community. These experiences remind us that
              music and sound can become tools for calm, confidence, healing, and empowerment for
              young people.
            </p>
            <p className="mt-4 leading-relaxed">
              This is part of the heart of Sol Vibes — bringing music, grounding, creativity, and
              care into the spaces where children learn every day. 🖤💜
            </p>
          </div>

          <figure className="md:sticky md:top-24">
            {/* TODO: move to a streaming service (Mux / Cloudflare Stream) if we
                accumulate more/longer videos — this one is a small static file. */}
            <video
              controls
              playsInline
              preload="metadata"
              className="w-full rounded-2xl bg-sol-deep shadow-[var(--shadow-card)]"
            >
              <source src="/singing-bowl.mp4" type="video/mp4" />
              Your browser doesn’t support embedded video —
              <a href="/singing-bowl.mp4">download it instead</a>.
            </video>
            <figcaption className="mt-3 text-center text-sm text-sol-ink/70">
              The crystal singing bowl in the note of C.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* YouTube */}
      <section className="bg-sol-deep text-white" aria-labelledby="videos-heading">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="videos-heading" className="text-3xl">
              Watch us in action
            </h2>
            <a
              href="https://www.youtube.com/channel/UCK9Nn0Q1Jz9t0shY1v1thQw"
              target="_blank"
              rel="noopener noreferrer"
              className="font-display font-bold text-sol-gold hover:underline"
            >
              Visit our YouTube channel →
            </a>
          </div>
          <div className="mt-8 overflow-hidden rounded-2xl bg-black shadow-xl">
            {/* Channel uploads playlist (UC… → UU…) — always shows the latest videos */}
            <iframe
              src="https://www.youtube-nocookie.com/embed/videoseries?list=UUK9Nn0Q1Jz9t0shY1v1thQw"
              title="Sol Vibrations on YouTube"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="aspect-video w-full"
            />
          </div>
        </div>
      </section>
    </>
  )
}

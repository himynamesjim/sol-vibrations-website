import type { Metadata } from 'next'

import { PageHero } from '@/components/PageHero'
import { RichText } from '@/components/RichText'
import { getDonateSettings, getSiteSettings } from '@/utilities/data'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Donate',
  description:
    'Support free music lessons for Tulsa kids and healing music outreach. Sol Vibrations is a 501(c)(3) nonprofit — donations are tax-deductible.',
}

export default async function DonatePage() {
  const [donate, settings] = await Promise.all([getDonateSettings(), getSiteSettings()])

  return (
    <>
      <PageHero
        title={donate.heading || 'Help us put instruments in kids’ hands'}
        intro="Every dollar goes toward instruments, lessons, and outreach performances."
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <RichText data={donate.body} />

        {donate.givingLinks && donate.givingLinks.length > 0 && (
          <ul className="mt-10 space-y-4">
            {donate.givingLinks.map((link) => (
              <li key={link.id} className="card flex flex-wrap items-center justify-between gap-4 p-6">
                <div>
                  <p className="font-display text-lg font-bold text-sol-deep">{link.label}</p>
                  {link.description && <p className="mt-1 text-sm text-sol-ink/70">{link.description}</p>}
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary px-5 py-2.5 text-sm"
                >
                  Give now
                  <span className="sr-only"> via {link.label} (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-12 rounded-2xl bg-sol-gold/20 p-6 text-sm leading-relaxed">
          <p>{settings.nonprofitBlurb}</p>
          {settings.ein && <p className="mt-1">EIN: {settings.ein}</p>}
        </div>
      </section>
    </>
  )
}
